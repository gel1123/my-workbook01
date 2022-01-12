import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { CloudFrontWebDistribution, experimental, LambdaEdgeEventType, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

/**
 * Nuxt3をLambdaでSSRさせる。
 * コーディングにあたって、[こちら](https://github.com/aws-samples/react-ssr-lambda/blob/main/cdk/lib/srr-stack.ts)
 * のコードを参考にさせていただきました。
 */
export class SugarNuxt01Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // <--------S3-------->
    const bucket = new Bucket(this, "sugraSite", {
      removalPolicy: RemovalPolicy.DESTROY
    });
    new CfnOutput(this, "Bucket", { value: bucket.bucketName });
    const oai = new OriginAccessIdentity(this, "sugarOAI");
    bucket.grantRead(oai);
    new BucketDeployment(this, "Sugar-ClientSide Nuxt3 app", {
      sources: [Source.asset("./nuxt3.output/public")],
      destinationBucket: bucket
    });
    // </--------S3-------->

    // <--------Lambda-------->
    // Lambda@Edgeなら、EdgeFunctionインスタンスでないと、スタック全体のリージョンとの差異がある場合にエラーになる。
    // ※Lambda@Edgeは us-east-1 リージョン限定（CloudFrontに紐づいているから）
    // 参考にさせていただいた記事：https://www.dkrk-blog.net/aws/lambda_edge_crossregion
    const lambdaEdge = new experimental.EdgeFunction(this, "sugarHandlerEdge", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("./nuxt3.output/server"),
      handler: "edge.handler"
    });
    // </--------Lambda-------->

    // <--------CloudFront-------->
    /**
     * Behavior 0 => 
     * Behavior 1 => 
     */
    const distribution = new CloudFrontWebDistribution(this, "sugarCdn", {
      defaultRootObject: "", //<= 指定なし. index.htmlはLambda@Edgeが出力する.
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: oai
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              pathPattern: "*",
              lambdaFunctionAssociations: [
                {
                  eventType: LambdaEdgeEventType.VIEWER_REQUEST,
                  lambdaFunction: lambdaEdge.currentVersion
                }
              ]
            },
            {
              isDefaultBehavior: false,
              pathPattern: "/*.*",
            }
          ]
        }
      ]
    });
    new CfnOutput(this, "CF URL", {
      value: `https://${distribution.distributionDomainName}`
    });
    // </--------CloudFront-------->
  }
}