import { JobExecutor, IJobParameter } from './job-executor';

/**
 * ステート要求インターフェイス
 * 
 * このファイルで定義する感情分析Lambdaの第一引数「event」の型に相当。
 * eventに渡されるオブジェクトは、呼出元が何のサービスであるかによって構造が変わる。
 * 今回、Lambda呼出を行うのは感情分析ステートマシン（StepFunctionsのワークフローの一単位）。
 * 
 * ステートマシンのASLで、Taskに対する「InputPath」や
 * 「Parameters」が定義されていれば、Lambadaにはそれらが入力として渡る。
 * 
 * しかし今回は、感情分析Taskには、InputPathもParametersも渡していないので、
 * ステートマシンに対する入力が、そのままLambdaに渡ることになる。
 * 
 * ※参考：
 * https://dev.classmethod.jp/articles/stepfunctions-parameters-inter-states/
 * 
 * 今回、呼び出し元のステートマシンを呼び出しているのは、
 * EventBridge(旧CloudWatch Events)であるため、
 * Lambdaに渡される第一引数「event」への入力は、
 * EventBridge定義時にセットした「eventPattern」プロパティの形式に従う。
 * 
 */
export interface IStateRequest {
    id: string;
    detail: {
        requestParameters: {
            bucketName: string;
            key: string;
        };
    };
}

/** ステート応答インターフェイス */
export interface IStateResponse {
    id: string;
    srcBucket: string;
    objectKey: string;
    destBucket: string;
    sentiment: string;
}

/**
 * 感情分析Lambdaハンドラ
 */
export async function handler(event: IStateRequest): Promise<IStateResponse> {
    const job: IJobParameter = {
        id: event.id,
        srcBucket: event.detail.requestParameters.bucketName,
        objectKey: event.detail.requestParameters.key,

        /**
         * 末尾のビックリマークは「Non-null assertion operator」。
         * 値が存在することを保証することで、たとえば
         * 型「string | undefined」を
         * 型「string」
         * にキャストしてくれる。
         */
        destBucket: process.env.DEST_BUCKET!
    };
    const body = await JobExecutor.execute(job);
    const result: IStateResponse = {
        id: job.id,
        srcBucket: job.srcBucket,
        objectKey: job.objectKey,
        destBucket: job.destBucket,
        sentiment: body
    };
    return result;
}