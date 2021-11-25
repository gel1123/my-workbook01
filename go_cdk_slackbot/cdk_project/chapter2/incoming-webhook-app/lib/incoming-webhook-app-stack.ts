import * as cdk from '@aws-cdk/core';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { StringParameter } from '@aws-cdk/aws-ssm';
import * as fs from 'fs';

/**
 * スタック。デプロイ可能な単位.
 * @aws-cdk/core » Stack を継承することで実装できる。
 * https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_core.Stack.html
 */
export class IncomingWebhookAppStack extends cdk.Stack {
  // 個別リソースの定義
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * SlackのWebHookURL.
     * ハードコートを避けたいので、
     * AWS Systems Mangaerのパラメータストアから情報を取得する。
     */
     const webHookUrl = StringParameter.valueFromLookup(this, '/Studying/url/slack_webhook01');


    const lambdaFunction: Function = new Function(this, "SampleIncomingWebhookApp", {
      functionName: "sample-incoming-webhook-app",
      runtime: Runtime.GO_1_X,
      // code: Code.asset("./lambdaSource"), //非推奨
      code: Code.fromAsset("./lambdaSource"), //推奨
      handler: "main",
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        webHookUrl: webHookUrl,
        slackChannel: "C02NHBNBS49"
      }
    });
    // Lambdaに EC2の情報を取得する ロールを付与
    lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      resources: ["*"],
      actions: ["ec2:DescribeInstances"],
    }));

    interface IEc2State {
      source: string[];
      "detail-type": string[];
      detail: {
        state: string[];
      }
    }
    const ec2State: IEc2State = JSON.parse(fs.readFileSync('event_pattern/ec2.json', { encoding: "utf-8" }));

    /**
     * EventBridge.
     * ここではEC2の "stoppped", "running" を監視させている。
     * イベント検出時には、Lambdaをトリガーするようにしている。
     */
    const ec2WatchRule = new events.Rule(this, "ec2WatchRule", {
      eventPattern: {
        source: ec2State.source,
        detailType: ec2State['detail-type'],
        detail: ec2State.detail
      }
    });
    ec2WatchRule.addTarget(new targets.LambdaFunction(lambdaFunction));
  }
}
