import * as cdk from '@aws-cdk/core';

/**
 * スタック。デプロイ可能な単位.
 * @aws-cdk/core » Stack を継承することで実装できる。
 * https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_core.Stack.html
 */
export class IncomingWebhookAppStack extends cdk.Stack {
  // 個別リソースの定義
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
  }
}
