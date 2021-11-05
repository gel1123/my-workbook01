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

    const successTask = new sfn.Task(this, 'SendSuccessMail', {
      task: new tasks.PublishToTopic(emailTopic, {
        subject: 'Osenchi Success',

        /**
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
      definition: successTask,
      timeout: cdk.Duration.minutes(30)
    });

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
     * CloudWatch Events Rule.
     * 
     * 入力用バケットのPutObjectイベントを検出するようルール定義している。
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
     * CloudWatch Events Ruleで定義したイベントに対して、
     * そのイベントのターゲットを定義する。
     */
    const target = new targets.SfnStateMachine(stateMachine);
    rule.addTarget(target);
  }
}
