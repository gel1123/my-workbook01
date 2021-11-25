#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { IncomingWebhookAppStack } from '../lib/incoming-webhook-app-stack';
import { SampleEc2 } from '../lib/sample-ec2';
import * as util from 'util'
const exec = util.promisify(require('child_process').exec);

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

  // Lambdaで使うGoのソースコードをビルドする
  //
  // ### 2021年11月末 追記
  // GLIBCのバージョンの問題がLambda上で発生したため、オプションに「CGO_ENABLED=0」を追加した.
  // 参考：https://github.com/aws/aws-lambda-go/issues/340
  await exec('go get -v -t -d ./lambdaSource/... && GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ./lambdaSource/main ./lambdaSource/**.go');

  const app = new cdk.App();

  // スタック追加
  new SampleEc2(app, 'SampleEc2');
  // スタック追加
  new IncomingWebhookAppStack(app, "IncomingWebhookAppStack");
  app.synth();

  // build結果のバイナリを削除する
  await exec('rm ./lambdaSource/main');
}
deploy();