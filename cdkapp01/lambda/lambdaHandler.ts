import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

const Region = process.env.REGION!;
const TABLE_NAME = process.env.TABLE_NAME!;
const Dynamo = new AWS.DynamoDB({
    region: Region
});

export interface Memo {
    memo_id: string
}

export async function memoHandler(memo: Memo)
    : Promise<PromiseResult<AWS.DynamoDB.GetItemOutput, AWS.AWSError>> {

    return Dynamo.getItem({
        TableName: TABLE_NAME,
        Key: { memo_id: { S: memo.memo_id } }
    }).promise();
}