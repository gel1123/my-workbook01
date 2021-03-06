import * as sdk from 'aws-sdk';
import { PutItemInput, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';

const Region = process.env.REGION!;
const TABLE_NAME = process.env.TABLE_NAME!;
const Dynamo = new sdk.DynamoDB({
    region: Region
});

export interface Memo {
    user_id: string;
    fullpath: string;
}

/**
 * メモを読むLambda
 * @param memo 
 * @returns 
 * 
 * ### 補足
 * 未実装だが参考にすべきリンク：
 *   [DynamoDB でのエラー処理](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/Programming.Errors.html)
 */
export async function readHandler(memo: Memo)
    : Promise<PromiseResult<sdk.DynamoDB.GetItemOutput, sdk.AWSError>> {

    // 最後に実行している aws-sdk >> Request::promiseメソッドは、
    // 旧来の コールバック地獄 / Promiseラップ地獄 を回避するためにAWS-SDKが用意してくれたもの。
    // 応答をPromiseで返却してくれる。
    // 参考：https://qiita.com/taqm/items/f22ee3c3f0fb3d433a85
    return Dynamo.getItem({
        TableName: TABLE_NAME,
        Key: {
            user_id: { S: memo.user_id },
            fullpath: { S: memo.fullpath }
        }
    }).promise();
}

/**
 * プロキシ統合におけるLambdaの要求形式の一部.
 * bodyを持っていることを明示的にしたいがために、このような定義としている。
 * 
 * ※body以外にも色々とキーがあるはずだが、
 *   ひとつひとつ書いていくのがとても大変なので、
 *   すべてのインデックスシグネチャにanyを割り当てている。
 * 
 *   そうすることで、次の条件のオブジェクトを定義している
 * 
 *     * bodyは必須
 *     * ほかはなんでもよい
 * 
 *   ※もっと良いやり方あればだれか教えてほしいです...!
 * 
 *   ※当初 `[key: string | number]: any;`と書いていたら、コンパイラに次のように怒られた。
 *   
 *   ```
 *   lambda/lambdaHandler.ts:55:6 - error TS1337: An index signature parameter type cannot be a union type. Consider using a mapped object type instead.
 *   ```
 */
export interface proxyReq {
    body: string;
    [key: string]: any;
}

/**
 * プロキシ統合におけるLambdaが沿うべき応答形式
 */
export interface proxyRes {
    statusCode: number;
    body: string;
    isBase64Encoded?: true | false;
    headers?: object;
    multiValueHeaders?: object;
}

/**
 * メモを書くLambda。
 * プロキシ統合でAPI Gatewayに組み込むので、
 * 応答を特定の形式にする必要がある。
 * 
 * また、プロキシ統合で組込むためasync関数ではなく、通常の関数として定義する...つもりだったが、
 * どうやらそういう意味ではなかったらしい。
 * 勉強中...
 * 
 * @param req 
 * @returns 
 */
export async function writeHandler(req: proxyReq)
    : Promise<proxyRes> {


    const now = new Date();
    const d = {
        YYYY: now.getFullYear(),
        M: now.getMonth() + 1,
        D: now.getDate(),
        H: now.getHours(),
        m: now.getMinutes(),
        E: "日_月_火_水_木_金_土".split("_")[now.getDay()]
    }
    /** 例：2021年11月26日（金曜日）8時45分 */
    const datestrJa = `${d.YYYY}年${d.M}月${d.D}日（${d.E}曜日）${d.H}時${d.m}分`;
    /** 例：2021-11-26-8-45 */
    const datestr = `${d.YYYY}-${d.M}-${d.D}-${d.H}-${d.m}`;

    // 要求本文の抽出
    interface IBody {
        user_id?: string;
        fullpath?: string;
        category?: string;
        tags?: string[];
        body?: string;
        user_name?: string;
        references?: string[];
        [key: string]: any;
    }
    const body: IBody = JSON.parse(req.body);

    const newItem: PutItemInputAttributeMap = {
        user_id: { S: body.user_id ?? "0" }, // PK ※ちなみにTypeScript3.7以降で登場した「??」演算子は、undefineとnull限定版のOR演算子（||)
        fullpath: { S: body.fullpath ?? "/sample-dir/sample-title" }, // SK
        category: { S: body.category ?? "sample-category" },
        tags: { SS: body.tags ?? ["sample-tag1", "sample-tag2", "sample-tag3"] },
        body: { S: body.body ?? `このメモは ${datestrJa} に作成されました。引数には次の値が指定されています：${JSON.stringify(req)}` },
        user_name: { S: body.user_name ?? "sample-user" },
        lastUpdated: { S: datestr },
        lastAccess: { S: datestr },
        created: { S: datestr },
        references: {
            SS: body.references ?? [
                "https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/best-practices.html",
                "https://aws.amazon.com/jp/blogs/news/operating-lambda-design-principles-in-event-driven-architectures-part-2/",
                "https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/welcome.html",
            ]
        }
    }
    const input: PutItemInput = {
        TableName: TABLE_NAME,
        Item: newItem
    }
    // ---- ※補足 ----
    // もしこれがasyncではない関数だったら、awaitを使うのはNG!
    //
    // なぜならこれは awaitがさながら Step Functions のように動作するからである。
    // awaitはいっけん「同期的に動く」ように見えるが、
    // その実、「非同期で動く」ものである。
    // そのためasyncではない関数で使うことは、できない。
    //
    // 非同期だが、ステップで連動する関数を生成することで、
    // いっけん同期的に動いているように見せかけるもの。
    //
    // 参考：https://qiita.com/jun1s/items/ecf6965398e00b246249
    //

    /**
     * DynamoDBの更新結果。
     * 
     * ### 応答例
     * * result.$response.httpResponse.body：{}
     * * result.$response.httpResponse.statusCode: 200
     * * result.$response.httpResponse.statusMessage: "OK"
     * * result.$response.httpResponse.headers: {
     *     "server":"Server",
     *     "date":"Sat, 27 Nov 2021 21:10:21 GMT",
     *     "content-type":"application/x-amz-json-1.0",
     *     "content-length":"2",
     *     "connection":"keep-alive",
     *     "x-amzn-requestid":"xxxxxxxxxxxxx",
     *     "x-amz-crc32":"1111111"
     * }%
     * 
     */
    const result = await Dynamo.putItem(input).promise();
    const res: proxyRes = {
        statusCode: 200,
        body: `${result.$response.httpResponse.body}, 
${result.$response.httpResponse.statusCode}, 
${result.$response.httpResponse.statusMessage},
${JSON.stringify(result.$response.httpResponse.headers)}`
    }
    console.log("original:", res);
    return res;
}