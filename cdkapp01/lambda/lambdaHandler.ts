import * as sdk from 'aws-sdk';
import { PutItemInput, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';

const Region = process.env.REGION!;
const TABLE_NAME = process.env.TABLE_NAME!;
const Dynamo = new sdk.DynamoDB({
    region: Region
});

export interface Memo {
    memo_id: string
}

export async function memoHandler(memo: Memo)
    : Promise<PromiseResult<sdk.DynamoDB.GetItemOutput, sdk.AWSError>> {

    return Dynamo.getItem({
        TableName: TABLE_NAME,
        Key: { memo_id: { S: memo.memo_id } }
    }).promise();
}

export async function writeHandler()
    : Promise<PromiseResult<sdk.DynamoDB.PutItemOutput, sdk.AWSError>> {

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
        body: { S: `このメモは ${datestr} に作成されました。` }
    }
    const input: PutItemInput = {
        TableName: TABLE_NAME,
        Item: newItem
    }
    return Dynamo.putItem(input).promise();
}