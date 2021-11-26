import * as cdk from '@aws-cdk/core';
import * as api from '@aws-cdk/aws-apigateway';
import * as dyanmo from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

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
 * ### メモIDでメモ取得：
 * GET => [API Gateway endpoint]/memos?memo_id=xxx
 * 
 * 応答例：
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
 * ### DynamoDB自体
 * * https://dev.classmethod.jp/articles/re-introduction-2020-amazon-dynamodb/
 * 
 */
export class Cdkapp01Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /** DynamoDBの定義 */
    const memoTable = new dyanmo.Table(this, 'memoTable', {
      partitionKey: {
        name: 'memo_id',
        type: dyanmo.AttributeType.STRING
      },
      billingMode: dyanmo.BillingMode.PAY_PER_REQUEST,
      tableName: 'memo',

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
    const memoLambda = new lambda.Function(this, 'memoLambda', {
      code: lambda.Code.fromAsset('lambda'), // Lambdaソースのパス指定
      handler: 'lambdaHandler.memoHandler', // 発火させたいメソッド指定
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
    memoTable.grantReadData(memoLambda);
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
     */
    const memoApi = new api.LambdaRestApi(this, 'memoApi', {
      handler: memoLambda,
      proxy: false
    });
    /**
     * API Gateway へのリクエストを処理するLambda統合の定義。
     */
    const memoApiIntegration = new api.LambdaIntegration(memoLambda, {
      proxy: false,

      // メソッドリクエストデータを統合リクエストパラメータにマップする
      // 参考：https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/request-response-data-mappings.html
      //
      // ※なおここではJSONPath式からプレフィックス「$」を除去した記法を使うことができる
      requestParameters: {
        'integration.request.querystring.memo_id': // 統合リクエストのクエリ文字列
          'method.request.querystring.memo_id' // メソッドリクエストのクエリ文字列
      },

      // 指定された MIME タイプのリクエストペイロード用のマッピングテンプレートを指定する
      // 参考：https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/api-gateway-swagger-extensions-integration-requestTemplates.html
      requestTemplates: {
        'application/json':
          JSON.stringify({
            // 参考：API Gateway マッピングテンプレートとアクセスのログ記録の変数リファレンス
            // https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
            memo_id:
              // セキュリティ対策としてエスケープを行う
              "$util.escapeJavaScript("

              // すべてのリクエストのパラメータマップのうち「memo_id」を取得.
              // なおここで $input.params(パラメータ名) で狙った値を取得できるのは、
              // 前述のrequestParametersで、統合リクエストのクエリ文字列を設定しているから。
              + "$input.params('memo_id')"
              + ")"
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
    const memos:api.Resource =  memoApi.root.addResource('memos')
    memos.addMethod('GET', memoApiIntegration, {
      // API Gateway が受け入れるリクエストパラメータ
      requestParameters: { 'method.request.querystring.memo_id': true },
      // クライアントに返却できるレスポンス
      methodResponses: [{ statusCode: '200' }]
    });
    memos.addMethod('POST', writeApiIntegration);
  }
}
