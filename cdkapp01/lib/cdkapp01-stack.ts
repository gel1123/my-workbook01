import * as cdk from '@aws-cdk/core';
import * as api from '@aws-cdk/aws-apigateway';
import * as dyanmo from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as route53 from '@aws-cdk/aws-route53';
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as route53Targets from "@aws-cdk/aws-route53-targets";
import { StringParameter } from "@aws-cdk/aws-ssm"

/**
 * 
 * ## これはなに？
 * メモを書いたり読んだりする簡単なアプリケーションを題材に、
 * AWS CDK について学習しようとしています。
 * 
 * ## 構成部品
 * * DynamoDB
 * * API Gateway
 * 
 * ## usage
 * 
 * ### メモIDでメモ取得： //TODO 例が古いので要更新
 * GET => [API Gateway endpoint]/memos?memo_id=xxx
 * 
 * 応答例： //TODO 例が古いので要更新
 * {"Item":{"memo_id":{"S":"0"},"body":{"S":"ここにメモを書きます"}}}
 * 
 * ### メモを新たに保存：
 * POST => [API Gateway endpoint]/memos
 * 
 * ## コーディングで参考にさせていただいたページ一覧
 * 
 * ### CDK全般
 * * https://qiita.com/yoppie_x/items/4636d4ed360473e58b30
 * * https://dev.classmethod.jp/articles/aws-cdk-101-typescript/
 * 
 * ### CDKにおけるDynamoDB
 * * https://itotetsu.hatenablog.com/entry/amazon-dynamodb-via-aws-cdk
 * 
 * ### CDKとRoute53
 * * https://dev.classmethod.jp/articles/aws-cdk-all-resources-for-api-gateway/
 * 
 * ### DynamoDB自体
 * * https://dev.classmethod.jp/articles/re-introduction-2020-amazon-dynamodb/
 * * https://hack-le.com/dynamodb-query/
 * 
 * ### TODO
 * * Route53との連携もCDKでやりたい
 * * HTTPS化
 * * 利用者に表示する時刻に時差を反映
 * * サーバ側の日時を確実に国際標準時にする
 * 
 */
export class Cdkapp01Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * DynamoDBの定義.
     * 
     *  + パーティションキー：
     *  + ソートキー：
     *  + プライマリーキー：
     *  + 想定している属性例：
     *  + GSI：なし
     *  + LSI：なし
     * 
     * ### テクニック_複合ソートキー
     * 今度書きます...
     */
    const memoTable = new dyanmo.Table(this, 'MEMO', {
      partitionKey: {
        name: 'user_id',
        type: dyanmo.AttributeType.STRING
      },
      sortKey: {
        name: 'fullpath',
        type: dyanmo.AttributeType.STRING
      },
      billingMode: dyanmo.BillingMode.PAY_PER_REQUEST,
      tableName: 'MEMO',

      /**
       * データがある状態でスタックを削除しようとしたときの挙動を定義。
       * 
       * * RETAIN：テーブルを削除しない（本番環境での推奨）
       * * DESTROY：データごとテーブルを削除する
       * * SNAPSHOT：削除する代わりにすナップショットを保存する（ただしDynamoでは使用不可）
       * 
       * 参考：https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options
       */
      removalPolicy: cdk.RemovalPolicy.DESTROY,

      /** PITRを有効にすると、35日前までのバックアップからテーブル復元が可能 */
      pointInTimeRecovery: false
    });

    /** Lambdaに渡す環境変数 */
    const environment = {
      TABLE_NAME: memoTable.tableName,
      REGION: 'ap-northeast-1'
    };

    /** メモを読むLambda */
    const readLambda = new lambda.Function(this, 'readLambda', {
      code: lambda.Code.fromAsset('lambda'), // Lambdaソースのパス指定
      handler: 'lambdaHandler.readHandler', // 発火させたいメソッド指定
      runtime: lambda.Runtime.NODEJS_12_X, // Lambda実行環境
      environment: environment // 環境変数
    });
    /** メモを書くLambda */
    const writeMemoLambda = new lambda.Function(this, 'writeMemoLambda', {
      code: lambda.Code.fromAsset('lambda'),
      handler: 'lambdaHandler.writeHandler',
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: environment // 環境変数
    });

    // Lambdaに権限付与
    memoTable.grantReadData(readLambda);
    memoTable.grantWriteData(writeMemoLambda);

    /**
     * Amazon API Gateway の定義
     * 第三引数のオプションで、次のことを指定している。
     * 
     * * handler：
     *     すべてのリクエストに対してのデフォルトハンドリング。
     *     API Gateway の説明でよく使われる用語を使うとしたら、
     *     デフォルト統合とも呼べる。
     *     
     *     * API Gateway における「統合」とは、
     *        ざっくりいえば「リクエストを処理する対向先」のこと
     * 
     *     * 理解していないこと：デフォルト統合の要求／応答の形式は？ //TODO
     * 
     * * proxy：
     *     統合プロキシ使用有無。統合プロキシを使用する設定だと、
     *     それに沿った形式の応答を返すことが必要。
     *     なお指定しないとデフォルトで使用する（true）ことになる。
     * 
     * * endpointTypes:
     *     API Gatewayのエンドポイントタイプ。
     *     指定なしの場合「EDGE」になるが、今回はSSL証明書の関係でREGIONALとする。
     */
    const cdkApp01Api01 = new api.LambdaRestApi(this, 'cdkApp01Api01', {
      handler: readLambda,
      proxy: false,
      endpointTypes: [
        api.EndpointType.REGIONAL
      ]
    });
    /**
     * API Gateway へのリクエストを処理するLambda統合の定義。
     */
    const readApiIntegration = new api.LambdaIntegration(readLambda, {
      proxy: false,

      // メソッドリクエストデータを統合リクエストパラメータにマップする
      // 参考：https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/request-response-data-mappings.html
      //
      // ※なおここではJSONPath式からプレフィックス「$」を除去した記法を使うことができる
      requestParameters: {
        'integration.request.querystring.user_id': // 統合リクエストのクエリ文字列
          'method.request.querystring.user_id', // メソッドリクエストのクエリ文字列
        'integration.request.querystring.fullpath':
          'method.request.querystring.fullpath'
      },

      // 指定された MIME タイプのリクエストペイロード用のマッピングテンプレートを指定する
      // 参考：https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/api-gateway-swagger-extensions-integration-requestTemplates.html
      requestTemplates: {
        'application/json':
          JSON.stringify({
            // 参考：API Gateway マッピングテンプレートとアクセスのログ記録の変数リファレンス
            // https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
            user_id:
              // セキュリティ対策としてエスケープを行う
              "$util.escapeJavaScript("

              // すべてのリクエストのパラメータマップのうち「user_id」を取得.
              // なおここで $input.params(パラメータ名) で狙った値を取得できるのは、
              // 前述のrequestParametersで、統合リクエストのクエリ文字列を設定しているから。
              + "$input.params('user_id')"
              + ")",
            fullpath: "$util.escapeJavaScript($input.params('fullpath'))"
          })
      },
      /**
       * ## passthroughBehavior
       * マッピングされていないコンテンツタイプのリクエストボディを、どのようにして
       * 統合バックエンドに渡すかを指定するプロパティ
       * 
       * ### WHEN_NO_MATCH
       * マップされていないコンテンツタイプのリクエストボディを、
       * 変換せずに統合バックエンドに渡す
       */
      passthroughBehavior: api.PassthroughBehavior.WHEN_NO_MATCH,

      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: {
            'application/json':

              // $input.json(x) は、JSONPath式を評価して結果をJSON文字列で返却する。
              // JSONPath式における$はJSONPath式の root を示すので、
              // ここでは、すべてのJSONをそのまま応答に設定していることになる。
              '$input.json("$")'
          }
        }
      ]
    });

    /** 書き込みLambda統合 */
    const writeApiIntegration = new api.LambdaIntegration(writeMemoLambda);

    /**
     * 
     * API Gatewayのリソース「/memos」に、
     * GET通信でメモを読み取るLambda統合と、
     * POST通信でメモを書き込むLambda統合
     * がトリガーされるよう定義している。
     * 
     * ### rootプロパティ
     * このAPIエンドポイントのルート（"/"）を示す。
     * 
     * ### IResource::addResourceメソッド
     * リソースに対し、さらなるリソースを追加する。
     * API Gateway における「リソース」とは、ざっくり言えば「APIのパス」のこと。
     * 参考：https://dev.classmethod.jp/articles/getting-start-api-gateway/
     * 
     * ### IResource::addMethodメソッド
     * リソースに対し、新たにメソッドを追加する。
     */
    const memos: api.Resource = cdkApp01Api01.root.addResource('memos')
    memos.addMethod('GET', readApiIntegration, {
      // API Gateway が受け入れるリクエストパラメータ
      requestParameters: {
        'method.request.querystring.user_id': true,
        'method.request.querystring.fullpath': true
      },
      // クライアントに返却できるレスポンス
      methodResponses: [{ statusCode: '200' }]
    });
    memos.addMethod('POST', writeApiIntegration);


    /**
     * ホストゾーンの名前をパラメータストアから取得している。
     * ...だが、パラメータストアから値を取得するタイミングの問題により、
     * 使い方によっては、うまくデプロイできないことがあるので、
     * どう使うかは少し検討すべき
     * 
     * ※たとえばAPI Gateway のカスタムドメインの名前に、パラメータストアから取得する値を指定すると、
     *   パラメータストアから実際に値を取得するより先に、下記のようなエラーが生じて、
     *   想定どおりの動きになってくれない場合がある。
     * 
     * ```
     * Error: Domain name does not support uppercase letters. Got: cdk01api01.dummy-value-for-/XXXX/XXXX/XX
     * ```
     * 
     * これについてはaws-cdkリポジトリに[Issue](https://github.com/aws/aws-cdk/issues/9138)
     * がたてられており、2021年11月末時点ではOPENのままである。
     */
    const hostZoneName = StringParameter.valueFromLookup(this, "/Studying/route53/hostzone/name/001");
    console.log("hostZoneName is => " + hostZoneName);

    /**
     * Route53に定義済みの既存ホストゾーンのインポート。
     * 
     * ### コードを書くにあたって参考にしたページ
     * * [CDK公式ドキュメント | @aws-cdk/aws-route53 ](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-route53-readme.html)
     * * [WS CDK + TypeScript で Route 53 にサブドメインのホストゾーンを作成してレコード追加する方法と やってみてハマったところ、分かったこと｜ふじい](https://note.com/dafujii/n/ne1595c74bcc7)
     * 
     * 
     * ### 補足
     * ホストゾーンとは、ドメイン／サブドメインのルーティングを定義するコンテナのこと。
     * 参考：https://www.acrovision.jp/service/aws/?p=1568
     * 
     * 当初ホストゾーンのインポートを「route53.HostedZone.fromHostedZoneId()」で行おうとしたが、その場合
     * 後述のコードでホストゾーン名を「zone.zoneName」で取得する際に、次のようなエラーが出ることが分かった。
     * 
     * ```
     * HostedZone.fromHostedZoneId doesn't support "zoneName"
     * ```
     */
    const zone = route53.HostedZone.fromLookup(this, "cdkapp01zone", {
      domainName: hostZoneName,
    })

    /**
     * ACMからSSL証明書を獲得する
     * 
     * ### 参考にさせていただいた記事等
     * * [API Gatewayにカスタムドメインを設定するためのリソースを全てAWS CDKでつくってみた | DevelopersIO](https://dev.classmethod.jp/articles/aws-cdk-all-resources-for-api-gateway/)
     * 
     */
    const certificate: acm.Certificate = new acm.DnsValidatedCertificate(this, "cdkapp01_apicert", {
      domainName: `cdk01api01.${zone.zoneName}`,
      hostedZone: zone,
      validation: acm.CertificateValidation.fromDns(zone)
    });

    /**
     * API Gatewayにカスタムドメインを設定する。
     * 参考：https://qiita.com/ishizakit/items/15bff195205ee19f0294
     */
    cdkApp01Api01.addDomainName("cdk01api01domain", {
      domainName: `cdk01api01.${zone.zoneName}`,
      certificate: certificate,
      endpointType: api.EndpointType.REGIONAL
    })

    /** サブドメインの定義 */
    new route53.ARecord(this, "CdkApp01SubDomain", {
      zone: zone,
      target: route53.RecordTarget.fromAlias(new route53Targets.ApiGateway(cdkApp01Api01)),
      recordName: `cdk01api01.${zone.zoneName}`,
    });

  }
}
