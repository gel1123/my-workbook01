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
import { Chain, Task } from '@aws-cdk/aws-stepfunctions';


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
    trail.addS3EventSelector([{bucket:inputBucket}], {
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

    // 感情分析LambdaにS3アクセス権限を付与する
    inputBucket.grantRead(detectionFunc);
    outputBucket.grantWrite(detectionFunc);
    // 感情分析LambdaにComprehendを利用できるロールを付与する
    const policy = new iam.PolicyStatement({
      resources: ['*'],
      actions: ['comprehend:BatchDetectSentiment']
    });
    detectionFunc.addToRolePolicy(policy);
    // 入力ファイル削除LambdaにS3アクセス権限を付与する。
    outputBucket.grantDelete(deletionFunc);

    const successTask = new sfn.Task(this, 'SendSuccessMail', {
      task: new tasks.PublishToTopic(emailTopic, {
        subject: 'Osenchi Success',

        /**
         * ステートマシン（ワークフロー）に組込む最終成功時Task。
         * 
         * タスクの実行データから入力パラメータを取得している.
         * なお引数の文字列は、インプット情報のセレクタである。
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
        message: sfn.TaskInput.fromDataAt('$.*'),
      })
    });

    /**
     * ステートマシン（ワークフロー）に組込むTask。
     * 感情分析LambdaをTaskに組み込んでいる。
     */
    const sentimentTask: sfn.Task = new sfn.Task(this, 'DetectSentiment', {
      task: new tasks.InvokeFunction(detectionFunc)
    });

    /**
     * ステートマシン（ワークフロー）に組込むTask。
     * 感情分析の入力としてS3にアップしたJSONを削除するLambdaを組み込んでいる。
     */
    const deleteTask: sfn.Task = new sfn.Task(this, 'DeleteTask', {
      task: new tasks.InvokeFunction(deletionFunc)
    });

    /** 感情分析失敗時のエラー通知タスク */
    const errorTask: sfn.Task = new sfn.Task(this, 'errorTask', {
      task: new tasks.PublishToTopic(emailTopic, {
        subject: 'Osenchi Error',
        message: sfn.TaskInput.fromDataAt('$.*')
      })
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
