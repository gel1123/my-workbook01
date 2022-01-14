import * as output from "./index.mjs";

async function handler(event, context) {
  // Lambda@Edge向けリクエスト形式を、Nuxt3がビルドしたindex.mjs（Lambdaプロキシ統合を想定）に変換する
  const e = {
    "resources": event.Records[0].cf.request.uri,
    "path": event.Records[0].cf.request.uri,
    "httpMethod": event.Records[0].cf.request.method,
    "headers": event.Records[0].cf.request.headers,
    "queryStringParameters": {
      /**
       * Edgeでは event.Records[0].cf.request.querystringだが、これは文字列である可能性が高い。
       * 一方Lambdaプロキシでは文字列ではなくオブジェクト。
       * もし使うなら変換が必要だが、現状では使用していないため無視する
       */
    }
  }
  // Lambda@Edge用に応答形式を変換
  const res = await output.handler(e, context);
  return {
    status: res.statusCode,
    headers: {
      'content-type': [{
          key: 'Content-Type',
          value: res.headers['content-type']
      }]
  },
    body: res.body
  }
}

export { handler };
