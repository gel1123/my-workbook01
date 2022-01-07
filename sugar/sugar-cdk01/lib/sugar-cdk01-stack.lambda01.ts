// @ts-ignore
import { Handler } from 'aws-lambda';
import axios from 'axios';

type EmptyHandler = Handler<void, string>;

/**
 * プロキシ統合時のレスポンス形式。
 * [こちら](https://aws.amazon.com/jp/premiumsupport/knowledge-center/malformed-502-api-gateway/) 参照
 */
interface PIRes {
    isBase64Encoded: true | false,
    statusCode: number,
    headers?: { [key: string]: string },
    body: string
}

export const handler: EmptyHandler = async function () {
    const response = await axios.get('https://dripcafe.ti-da.net/index.xml');
    const body = response.data;
    const res: PIRes = {
        isBase64Encoded: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/xml"
        },
        statusCode: response.status,
        body: body
    };
    return res;
}