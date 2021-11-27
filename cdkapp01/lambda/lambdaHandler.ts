import * as sdk from 'aws-sdk';
import { PutItemInput, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { callbackify } from 'util';

const Region = process.env.REGION!;
const TABLE_NAME = process.env.TABLE_NAME!;
const Dynamo = new sdk.DynamoDB({
    region: Region
});

export interface Memo {
    memo_id: string
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
export async function memoHandler(memo: Memo)
    : Promise<PromiseResult<sdk.DynamoDB.GetItemOutput, sdk.AWSError>> {

    // 最後に実行している aws-sdk >> Request::promiseメソッドは、
    // 旧来の コールバック地獄 / Promiseラップ地獄 を回避するためにAWS-SDKが用意してくれたもの。
    // 応答をPromiseで返却してくれる。
    // 参考：https://qiita.com/taqm/items/f22ee3c3f0fb3d433a85
    return Dynamo.getItem({
        TableName: TABLE_NAME,
        Key: { memo_id: { S: memo.memo_id } }
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
    const datestr = `${d.YYYY}年${d.M}月${d.D}日（${d.E}曜日）${d.H}時${d.m}分`;

    const newItem: PutItemInputAttributeMap = {
        memo_id: { S: "101" },
        body: { S: `このメモは ${datestr} に作成されました。引数には次の値が指定されています：${JSON.stringify(req)}` }
    }
    const input: PutItemInput = {
        TableName: TABLE_NAME,
        Item: newItem
    }
    // ---- ※補足 ----
    // もしこれがasyncではない関数だったら、awaitを使うのはNG!
    //
    // ```
    // const result = await Dynamo.putItem(input).promise();
    // ```
    //
    // これは awaitがさながら Step Functions のように動作するからである。
    // awaitはいっけん「同期的に動く」ように見えるが、
    // その実、「非同期で動く」ものである。
    // そのためasyncではない関数で使うことは、できない。
    //
    // 非同期だが、ステップで連動する関数を生成することで、
    // いっけん同期的に動いているように見せかけるもの。
    //
    // 参考：https://qiita.com/jun1s/items/ecf6965398e00b246249
    //

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