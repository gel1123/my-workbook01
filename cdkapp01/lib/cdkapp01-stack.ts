import * as cdk from '@aws-cdk/core';
import * as api from '@aws-cdk/aws-apigateway';
import * as dyanmo from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as route53 from '@aws-cdk/aws-route53';
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as route53Targets from "@aws-cdk/aws-route53-targets";
// import { StringParameter } from "@aws-cdk/aws-ssm"

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
 * ### REST API設計
 * * [翻訳: WebAPI 設計のベストプラクティス](https://qiita.com/mserizawa/items/b833e407d89abd21ee72)
 * 
 * ### TODO
 * * ~Route53との連携もCDKでやりたい~
 * * ~HTTPS化~ <= そもそもAPI Gatewayでカスタムドメイン使うなら、必ずHTTPSにする必要があった
 * * 利用者に表示する時刻に時差を反映
 * * サーバ側の日時を確実に国際標準時にする
 * * CI/CD構築
 * * CloudWatchとの連携
 * * S3 + CloudFront構成でなにか
 * * StepFunctionsでなにか
 * * API Gatewayのカスタムドメインを、ステージごとに複数APIマッピングする
 * * API GatewayのURLに、APIのバージョンを含める1
 * * API Gatewayのデプロイするステージを、デプロイ時に指定できるようにする
 * * API Gatewayのデプロイするバージョンを、デプロイ時に指定できるようにする
 * * 開発環境のデプロイ時に、誤って本番環境を消してしまったり上書いてしまわないようにする
 * * 本番環境で、スムーズに漸進リリースできるようにする（漸進のつもりが「一度削除して全アップデート」とならないように...!）
 * 
 * #### 別スタックで、だけど後日やってみたいこと
 * * EC2スポットインスタンスを活用するためのCDKスタック作成
 * * Fargateの活用
 * * AWS Lambda + Spring
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
      ],
      deployOptions: {
        stageName: "dev"
      }
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
     * 
     * ## そのほか覚書
     * 下記の参考リンクによると、REST APIは次のようにあるべきだとされている。
     * [参考 => 翻訳: WebAPI 設計のベストプラクティス](https://qiita.com/mserizawa/items/b833e407d89abd21ee72)
     * 
     * * REST API においてエンドポイントの名前は複数形がいい。  
     *   なぜなら、取得単位に応じて person/people のような単複変換を扱うのは手間がかかるから
     * 
     * * URLにはAPIのバージョンを含めるべき。  
     *   これには次のメリットがある
     *     * 開発速度アップ
     *     * 廃止済みのリクエストを弾く実装が簡単
     *     * アップデート時の移行期間を設けるのが簡単
     * 
     * ### API Gatewayのバージョン管理について
     * 参考：[API Gateway – Lambda 構成のバージョン管理について教えてください | DevelopersIO](https://dev.classmethod.jp/articles/tsnote-lambda-apigw-version-control/)
     * 
     * ポイント：
     * * APIGatewayとLambda関数は、それぞれ別々に管理されている。
     *     * API Gatewayには「デプロイ」と「ステージ」
     *     * Lambdaには「バージョン」と「エイリアス」
     * 
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
     * // 例：ここで下記のようにパラメータストアから取得するつもりでいると...
     * const hostZoneName = StringParameter.valueFromLookup(this, "/Studying/route53/hostzone/name/001");
     * // 後続処理で API Gateway のカスタムドメイン設定時に次のエラーが出る
     * Error: Domain name does not support uppercase letters. Got: cdk01api01.dummy-value-for-/XXXX/XXXX/XX
     * ```
     * 
     * これについてはaws-cdkリポジトリに[Issue](https://github.com/aws/aws-cdk/issues/9138)
     * がたてられており、2021年11月末時点ではOPENのままである。
     * 
     * ___________________________________
     * 
     * 上記の経緯により、ここでは context から値を取得するようにしている。  
     * 参考：[実践！AWS CDK #4 Context  | DevelopersIO](https://dev.classmethod.jp/articles/cdk-practice-4-context/)
     * 
     * ただし、cdk.jsonにホストゾーン名を載せたくなかったので、
     * CDKｺﾏﾝﾄﾞの --context オプションから値を取得する想定でいる。
     * 
     * 下記のように CDKｺﾏﾝﾄﾞを実行することで、hostZoneNameをContextとして取得できる
     * 
     * ```
     * # ※ 下記のcontextオプションは「-c」で縮めて書くこともできる
     * cdk deploy --context hostZoneName=hogehoge.com
     * ```
     */
    const hostZoneName = this.node.tryGetContext("hostZoneName");
    if (!hostZoneName || "string" !== typeof hostZoneName) {
      throw new Error("context [hostZoneName] is invalid.");
    }
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
    const apiDomainName: api.DomainName = cdkApp01Api01.addDomainName("cdk01api01domain", {
      domainName: `cdk01api01.${zone.zoneName}`,
      certificate: certificate,
      endpointType: api.EndpointType.REGIONAL
    });

    /**
     * hogehoge.com/d に対して、ステージを紐づけている.
     * 第二引数のオプションでstageプロパティを指定しない場合、
     * ベースパス（上記のd）は自動的に、第一引数のAPIの
     * deploymentStageに紐づけられる。
     * 
     * なお、まだ仕様について確認できていないが、
     * どうやらベースパスマッピングを行ったからといって、
     * ベースパスなしのURLでアクセスできなくなるわけではない模様。
     * その場合に紐づけられているステージはどこだ...?
     */
    apiDomainName.addBasePathMapping(cdkApp01Api01, {
      basePath: "d"
    });

    /** サブドメインの定義 */
    new route53.ARecord(this, "CdkApp01SubDomain", {
      zone: zone,
      target: route53.RecordTarget.fromAlias(new route53Targets.ApiGateway(cdkApp01Api01)),
      recordName: `cdk01api01.${zone.zoneName}`,
    });

  }
}
