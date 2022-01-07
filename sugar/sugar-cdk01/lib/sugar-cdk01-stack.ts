import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { EndpointType, LambdaIntegration, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

/**
 * 書いているときに参考にさせていただいた記事
 * + https://aws.amazon.com/jp/blogs/news/lambda-managed-by-cdk/
 * + https://qiita.com/ttkn9a/items/4824bacf80d2f500f837
 */
export class SugarCdk01Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * package.jsonを別で持つ必要がない（lambdaのリソースを分離する必要がない）
     * タイプのlambda定義。
     * 
     * + [参考1](https://qiita.com/tetsuya-zama/items/600bb0e187e9dead6e68)
     * + [参考2](https://zenn.dev/fuku710/articles/8fabcb6ff2dcd8)
     * + [公式DocのOverview](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html)
     */
    const lambda = new NodejsFunction(this, 'lambda01');
    
    /** API Gateway 定義 */
    const api = new LambdaRestApi(this, 'SugarApi01', {
      handler: lambda,
      proxy: true, // API自体をプロキシ統合にすると、addResourceでパスごとの処理を定義できない
      endpointTypes: [EndpointType.REGIONAL],
      deployOptions: {
        stageName: "v0", // Stage name only allows a-zA-Z0-9_
        // cachingEnabled: true, // キャッシュ有効にするならこのようにする（今はキャッシュ使うほどのアクセス数がない見込み）
        // cacheClusterEnabled: true,
        // cacheTtl: Duration.hours(1)
      } 
    });

    // 上記を proxy: false で運用するなら、次のように addResource で特定の処理を定義できる。
    // その際、下記のようにパスに生やした処理単独をプロキシ統合にすることもできる。
    // const integration = new LambdaIntegration(lambda, { proxy: true });
    // api.root.addResource("rss").addMethod("GET", integration);
  }
}
