import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';

/**
 * スタッククラス
 */
export class AwsCdkSampleStack extends cdk.Stack {
    /**
     * コンストラクタの中でSQSのQueueと
     * SNSトピック＆サブスクリプションを定義
     * @param scope
     * @param id
     * @param props
     */
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Queueの作成
        const queue = new sqs.Queue(this, 'AwsCdkSampleQueue', {
            // SQS可視性タイムアウト
            // メッセージをConsumerが受信した後、
            // ほかのCoonsumerが再度メッセージを受信できない時間のこと。
            // デフォルト設定は30秒。0秒〜12時間まで設定できる。
            visibilityTimeout: cdk.Duration.seconds(300),
        });

        // SNSトピックを定義。
        // SNSトピックとは、配信者から受信者へ
        // メッセージ配信を提供するマネージドサービスのこと。
        const topic = new sns.Topic(this, 'AwsCdkSampleTopic');

        // SNSサブスクリプションをSNSトピックに追加
        // トピックと配信対象のエンドポイントを紐づけるデータのこと。
        // ここではエンドポイントにQueueを指定しているので、
        // トピックから発行したメッセージは、Queueに登録される。
        topic.addSubscription(new subs.SqsSubscription(queue));
    }
}
