import * as output from "./index.mjs";

async function handler(event, context) {
  // Lambda@Edge用に応答形式を変換
  const res = await output.handler(event, context);
  return {
    status: res.statusCode,
    body: res.body
  }
}

export { handler };
