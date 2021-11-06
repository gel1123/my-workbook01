import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
import { StringParameter } from '@aws-cdk/aws-ssm';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as cloudtrail from '@aws-cdk/aws-cloudtrail';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import { Chain } from '@aws-cdk/aws-stepfunctions';


export class OsenchiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * 入力バケットのインスタンス
     * 
     * コンストラクタには第一引数にスタック自身、
     * 第二引数にConstructID、
     * 第三引数にバケットのプロパティを指定する。
     * 
     * なおバケット名を省くと、ConstructIDと構造をもとにハッシュ値を計算して自動命名する。
     * S3バケットの名前の衝突を回避したいなら、自動命名を使うのも一つの手。
     * 
     * ### 注意！
     * 「S3バケットの名前」はアカウント内で一意、ではなく
     * "グローバルで一意" である必要がある。  
     * つまり、ほかのアカウントで同名バケットを利用している人がいれば、
     * そのバケット名は使うことができない。
     */
    const inputBucket: s3.Bucket = new s3.Bucket(this, 'OsenchiInputBucket', {
    });

    /**
     * 出力バケットのインスタンス
     */
    const outputBucket: s3.Bucket = new s3.Bucket(this, 'OsenchiOutputBucket', {
    });

    /**
     * SNSでeメール通知を行うためのSNSトピック。
     */
    const emailTopic = new sns.Topic(this, 'Topic', {
      topicName: 'osenchi-topic'
    });

    /**
     * 通知先email。
     * メアドのハードコートを避けたいので、
     * AWS Systems Mangaerのパラメータストアから情報を取得する。
     */
    const email = StringParameter.valueFromLookup(this, '/Studying/email/address01');
    emailTopic.addSubscription(new subscriptions.EmailSubscription(email));

    /** CloudTrail用のバケット. バケット名は自動命名に任せている */
    const logBucket = new s3.Bucket(this, 'LogBucket', {});

    /** ログのためにCloudTrail用意. 単一リージョンで運用 */
    const trail = new cloudtrail.Trail(this, 'Trail', {
      bucket: logBucket,
      isMultiRegionTrail: false
    });

    /**
     * S3バケットのデータイベントをCloudTrailで検出させる。
     * 第一引数には、対象のS3バケットの配列を指定。
     * 第二引数には、オプションを指定する。
     * 
     * オプションの「readWriteType」では、検出するデータイベントのタイプ指定ができる。
     * ここでは書き込みイベントだけ検出するように指定している。
     */
    trail.addS3EventSelector([{ bucket: inputBucket }], {
      readWriteType: cloudtrail.ReadWriteType.WRITE_ONLY
    });

    /**
     * EventBridge(旧CloudWatch Events) Rule.
     * 
     * 入力用バケットのPutObjectイベントを
     * CloudTrailを経由して検出するようルール定義している。
     */
    const rule = new events.Rule(this, 'EventRule', {
      eventPattern: {
        source: ['aws.s3'],
        detailType: ["AWS API Call via CloudTrail"],
        detail: {
          'eventSource': ['s3.amazonaws.com'],
          'eventName': ['PutObject'],
          'requestParameters': {
            'bucketName': [inputBucket.bucketName]
          }
        }
      }
    });

    /**
     * 感情分析用Lambda
     */
    const detectionFunc = new lambda.Function(this, 'DetectionFunc', {
      functionName: 'osenchi-detect-sentiment',

      /**
       * Lambda関数を格納したフォルダを指定。
       * TypeScriptで書いているので、デプロイ時に不要なtsファイルは除外する
       */
      code: lambda.Code.fromAsset('functions/detect-sentiment', {
        exclude: ['*.ts']
      }),

      /**
       * Lambda実行時のエントリポイント.
       * 今回は、トランスパイルされたindex.jsがexportするhandlerモジュールを指定
       */
      handler: 'index.handler',

      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: cdk.Duration.minutes(5),

      /**
       * Lambdaが利用する環境変数。
       * 今回は、感情分析結果の保存先バケットを環境変数で指定させる。
       */
      environment: {
        DEST_BUCKET: outputBucket.bucketName
      }
    });

    /**
     * 入力ファイル削除用Lambda
     */
    const deletionFunc = new lambda.Function(this, 'DeletionFunc', {
      functionName: 'osenchi-delete-object',
      code: lambda.Code.fromAsset('functions/delete-object', {
        exclude: ['*.ts']
      }),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X
    });

    // 感情分析LambdaのIAMロールに、S3アクセス権限を付与する
    inputBucket.grantRead(detectionFunc);
    outputBucket.grantWrite(detectionFunc);
    // 感情分析LambdaのIAMロールに、Comprehend権限を付与する
    const policy = new iam.PolicyStatement({
      resources: ['*'],
      actions: ['comprehend:BatchDetectSentiment']
    });
    detectionFunc.addToRolePolicy(policy);
    // 入力ファイル削除LambdaのIAMロールに、S3アクセス権限を付与する。
    inputBucket.grantDelete(deletionFunc);

    /**
     * ステートマシン（ワークフロー）に組込む最終成功時Task。
     * 
     * タスクの実行データから入力パラメータを取得している.
     * なおsfn.TaskInput.fromJsonPathAtの引数は、インプット情報のセレクタである。
     * AWSのドキュメントでは「JsonPath構文」という言葉で登場する。
     * 
     * ドル記号はJSONのルートを示す。
     * また、その後に続くアスタリスクはすべてのプロパティを示すワイルドカードである。
     * 
     * 参考1：https://docs.aws.amazon.com/ja_jp/step-functions/latest/dg/input-output-inputpath-params.html
     * 参考2：https://docs.aws.amazon.com/ja_jp/step-functions/latest/dg/amazon-states-language-paths.html
     * 
     * 同じ構文は、たとえばCloudWatchの構文でも出てくる。
     * https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
     * 
     * ワイルドカードですべてのプロパティから入力を取得するので、
     * たとえば入力が
     * ```
     * {
     *   "Comment1": "hello!",
     *   "Comment2": "hello!!",
     *   "Comment3": "hello!!!",
     *   "CommentArray": ["hoge","fuge","sage"]
     * }
     * ```
     * なら、messageは ["hello!","hello!!","hello!!!",["hoge","fuge","sage"]] になる。
     */
    const successTask = new tasks.SnsPublish(this, 'SendSuccessMail', {
      topic: emailTopic,
      subject: 'Osenchi Success',
      message: sfn.TaskInput.fromJsonPathAt('$.*')
    });

    /**
     * ステートマシン（ワークフロー）に組込むTask。
     * 感情分析LambdaをTaskに組み込んでいる。
     * 
     * なお [@aws-cdk/aws-stepfunctions >> Task] が非推奨となる以前の書き方は下記の通り
     * ```
     * const sentimentTask: sfn.Task = new sfn.Task(this, 'DetectSentiment', {
     *   task: new tasks.InvokeFunction(detectionFunc)
     * });
     * ```
     */
    const sentimentTask = new tasks.LambdaInvoke(this, 'DetectSentiment', {
      lambdaFunction: detectionFunc,
      // 入力JSONをすべて取得。デフォルト値なので、下記は省略しても同じ動きとなる。
      payload:sfn.TaskInput.fromJsonPathAt('$')
    });

    /**
     * ステートマシン（ワークフロー）に組込むTask。
     * 感情分析の入力としてS3にアップしたJSONを削除するLambdaを組み込んでいる。
     */
    const deleteTask = new tasks.LambdaInvoke(this, 'DeleteTask', {
      lambdaFunction: deletionFunc,
      // 入力JSONのうち、プロパティ「Payload」のJSONを取得。
      // 非推奨となった [@aws-cdk/aws-stepfunctions >> Task] を使ったタスク定義
      // が生成するASLでは、下記参考サイトにおける「方法1: Resourceに関数のARNを直接書く」
      // のASLが生成されていたため、Payload参照は不要であったが、
      // 現在推奨されている LambdaInvoke では、参考サイトにおける
      // 「方法2: Parameters.FunctionNameに関数名を書く」に相当するASLが生成
      // されるので、この場合、利用する引数はPayload配下になる。
      //
      // 参考サイト：
      // https://dev.classmethod.jp/articles/differences-between-2-ways-of-invoking-lambda-functions-with-step-functions/
      payload:sfn.TaskInput.fromJsonPathAt('$.Payload')
    });

    /**
     * 感情分析失敗時のエラー通知タスク
     * 
     * なお、sfn.Taskとsfn.TaskInput.fromDataAtが非推奨となる前の書き方は下記。
     * ```
     * const errorTask: sfn.Task = new sfn.Task(this, 'errorTask', {
     *   task: new tasks.PublishToTopic(emailTopic, {
     *     subject: 'Osenchi Error',
     *     message: sfn.TaskInput.fromDataAt('$.*')
     *   })
     * });
     * ```
     */
    const errorTask = new tasks.SnsPublish(this, 'errorTask', {
      topic: emailTopic,
      subject: 'Osenchi Error',
      message: sfn.TaskInput.fromJsonPathAt('$.*')
    });

    /**
     * ステートマシン（ワークフロー）を定義。
     * 
     * なおステートマシンに「どのタスクをどういう順番／ルールで
     * 組み込んでいくか」というルールのことを、
     * ASL（Amazon States Language）と呼んでいる。
     * 
     * ステートマシンの実体はこの「ASL」と「TASK」であるともいえる。
     * ```
     * StepFunctions > StateMachine === ASLとTaskの組み合わせ
     * ```
     */
    const mainFlow: Chain = sentimentTask.next(deleteTask).next(successTask);
    const parallel = new sfn.Parallel(this, 'Parallel');
    parallel.branch(mainFlow);
    parallel.addCatch(errorTask, { resultPath: '$.error' });

    /**
     * ステートマシン（状態遷移図）
     * 
     * サーバレスオーケストレーションサービスであるStep Functionsは、
     * ステートマシンとタスクで構成される。
     * Step Functions > ステートマシン > タスク の関係。
     * 
     * ステートマシンはワークフローに相当。
     * タスクは、ワークフロー内の状態を示す。
     */
    const stateMachine = new sfn.StateMachine(this, 'OsenchiStateMachine', {
      definition: parallel,
      timeout: cdk.Duration.minutes(30)
    });

    /**
     * EventBridge(旧CloudWatch Events) Ruleで定義したイベントに対して、
     * そのイベントのターゲットを定義する。
     * 
     * ここでのターゲットはStepFunctionsで構築した感情分析ステートマシン。
     * EventBridgeルールには、S3入力用バケットへのPUTイベントを定義しているため、
     * 「S3入力用バケットへPUTされたら、targetに指定したStepFunctionsを実行する」
     * という挙動になっている。
     */
    const target = new targets.SfnStateMachine(stateMachine);
    rule.addTarget(target);
  }
}
