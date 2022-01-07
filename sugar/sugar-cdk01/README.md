# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## 開発中につまづいたことのメモ

### 型 'Construct' からの次のプロパティがありません: onValidate, onPrepare, onSynthesize
このエラーが出たなら、AWS CDK v1 向けパッケージが混在している可能性あり。

ここで使っているCDKはバージョン2系のものであり、
LambdaやAPIGatewayのパッケージは旧来の
`@aws-cdk/aws-lambda` や `@aws-cdk/aws-apigateway` ではなく
`aws-cdk-lib` パッケージに統一されている。

たとえばLambdaなら、
[aws-cdk-lib/aws-lambda](https://docs.aws.amazon.com/cdk/api/v2//docs/aws-cdk-lib.aws_lambda-readme.html) を使用

（2022年1月時点ではまだまだWeb上の記事は v1時代のCDKのサンプルコードが多いため、注意）

### Lambdaへのaxios導入時エラー

```
% npm run build
> sugar-cdk01@0.1.0 build
> tsc
node_modules/axios/index.d.ts:93:12 - error TS2304: Cannot find name 'AbortSignal'.
93   signal?: AbortSignal;
Found 1 error.
```

これはtsconfig.jsonのlibプロパティを次のようにすることで解決する。
（エラー発生時には、下記の「DOM」がなかった）

```
"lib": [
  "es2018",
  "DOM"
],
```
