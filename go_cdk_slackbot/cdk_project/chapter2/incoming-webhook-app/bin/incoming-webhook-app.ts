#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SampleEc2 } from '../lib/sample-ec2';

/**
 * コンパイルとデプロイで利用される.
 * なお `cdk bootstrap` などのｺﾏﾝﾄﾞを実行したときに下記のようなエラーが出たら、
 * aws-cdkパッケージのバージョン修正が必要。
 * 
 * ```
 * Cloud assembly schema version mismatch: Maximum schema version supported is 14.0.0, but found 15.0.0.
 * Please upgrade your CLI in order to interact with this app.
 * ```
 * 
 * ちなみに自分の環境では、バージョン修正後に再起動してはじめてエラーが出なくなった。
 * 
 * 参考：
 * https://qiita.com/honmaaax/items/d1467b1f49df2ae09b97#cloud-assembly-schema-version-mismatch-maximum-schema-version-supported-is-200-but-found-300
 */
async function deploy() {

  const app = new cdk.App();
  new SampleEc2(app, 'SampleEc2', {
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
  });
  app.synth();
}
deploy();