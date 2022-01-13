#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
// import { SugarCdk01Stack } from '../lib/sugar-cdk01-stack';
import { SugarNuxtSSR01Stack } from '../lib/sugar-nuxt01-stack';

const app = new cdk.App();
// new SugarCdk01Stack(app, 'SugarCdk01Stack');

/**
 * `Lambda@Edge` を含むスタックをデプロイするときには、
 * スタックとしてのリージョンを明示する必要がある。
 */ 
new SugarNuxtSSR01Stack(app, 'SugarNuxtSSR01Stack', {
  env: {
    // region: "ap-northeast-1"
    region: "us-east-1"
  }
});