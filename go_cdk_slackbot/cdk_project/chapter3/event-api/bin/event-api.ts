#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EventApiStack } from '../lib/event-api-stack';
import * as util from 'util';
const exec = util.promisify(require('child_process').exec);

async function deploy() {
  // Lambdaで使うGoのソースコードをビルドする
  //
  // ### 2021年11月末 追記
  // GLIBCのバージョンの問題がLambda上で発生したため、オプションに「CGO_ENABLED=0」を追加した.
  // 参考：https://github.com/aws/aws-lambda-go/issues/340
  await exec('go get -v -t -d ./lambdaSource/... && GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ./lambdaSource/main ./lambdaSource/**.go');

  const app = new cdk.App();
  new EventApiStack(app, 'EventApiStack');
  app.synth();

  await exec('rm ./lambdaSource/main')
}

deploy()