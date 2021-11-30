#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Cdkapp01Stack } from '../lib/cdkapp01-stack';

/**
 * デプロイ実行時には、次のようなｺﾏﾝﾄﾞを打つことを想定して実装している。
 * 
 * ```
 * cdk deploy --profile studying --context hostZoneName=hogehoge.com
 * ```
 */
const app = new cdk.App();
new Cdkapp01Stack(app, 'Cdkapp01Stack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */

  /**
 * デプロイ先を明示的に指定。
 * cdkコマンドに profileオプション を渡すと、
 * 環境変数からリージョンとアカウントを取得できる。
 * 
 * スタックのインスタンス作成時にアカウントとリージョン情報を渡さないと、
 * SSMパラメータストアから情報を取得するときなどに、
 * 以下のようなエラーが生じる。
 * 
 * ```
 * Cannot retrieve value from context provider ssm since account/region are not specified at the stack level. Configure "env" with an account and region when you define your stack.See https://docs.aws.amazon.com/cdk/latest/guide/environments.html for more details.
 * ```
 * 
 * 参考サイト1：https://qiita.com/mitsuoka0423/items/325dfe91e7073b358435
 * 参考サイト2：https://qiita.com/kai_kou/items/e35fd8c6af7dff9f2624
 */
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT
  }
});

// AWS CDK にアプリからクラウドアセンブリを合成するよう指示する
// 参考：https://docs.aws.amazon.com/cdk/latest/guide/apps.html
app.synth();
