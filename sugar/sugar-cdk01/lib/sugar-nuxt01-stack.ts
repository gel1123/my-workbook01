import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { CloudFrontWebDistribution, experimental, LambdaEdgeEventType, OriginAccessIdentity, OriginProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
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
    // lambda@Edgeなら、EdgeFunctionインスタンスでないと、スタック全体のリージョンとの差異がある場合にエラーになる。
    // ※lambda@Edgeは us-east-1 リージョン限定（CloudFrontに紐づいているから）
    // 参考にさせていただいた記事：https://www.dkrk-blog.net/aws/lambda_edge_crossregion
    const lambdaEdge = new experimental.EdgeFunction(this, "sugarHandlerEdge", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("./nuxt3.output/server"),
      handler: "index.handler"
    });
    // const lambdaVersion = new Version(this, "sugarHandlerVersion", {
    //   lambda: lambdaEdge
    // });
    const lambda = new Function(this, "sugarHandler", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("./nuxt3.output/server"),
      handler: "index.handler"
    });
    const api = new LambdaRestApi(this, "sugarEndpoint", {
      handler: lambda
    });
    new CfnOutput(this, "Sugar API URL", {value: api.url});
    const apiDomainName = `${api.restApiId}.execute-api.${this.region}.amazonaws.com`;
    // </--------Lambda-------->

    // <--------CloudFront-------->
    const distribution = new CloudFrontWebDistribution(this, "sugarCdn", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: oai
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              lambdaFunctionAssociations: [
                {
                  eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
                  lambdaFunction: lambdaEdge.currentVersion
                }
              ]
            }
          ]
        },
        {
          customOriginSource: {
            domainName: apiDomainName,
            originPath: "/prod",
            originProtocolPolicy: OriginProtocolPolicy.HTTPS_ONLY
          },
          behaviors: [
            {
              pathPattern: "/ssr"
            }
          ]
        }
      ]
    });
    new CfnOutput(this, "CF URL", {
      value: `https://${distribution.distributionDomainName}`
    });
    new CfnOutput(this, "Lambda SSR URL", {
      value: `https://${distribution.distributionDomainName}/ssr`
    });
    new CfnOutput(this, "Lambda@Edge SSR URL", {
      value: `https://${distribution.distributionDomainName}/edgessr`
    });
    // </--------CloudFront-------->
  }
}