import { JobExecutor, IJobParameter } from './job-executor';

/** ステート要求インターフェイス */
export interface IStateRequest {
    id: string;
    detail: {
        requestParameter: {
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
}

/**
 * 感情分析Lambdaハンドラ
 */
export async function handler(event: IStateRequest): Promise<IStateResponse> {
    const job: IJobParameter = {
        id: event.id,
        srcBucket: event.detail.requestParameter.bucketName,
        objectKey: event.detail.requestParameter.key,

        /**
         * 末尾のビックリマークは「Non-null assertion operator」。
         * 値が存在することを保証することで、たとえば
         * 型「string | undefined」を
         * 型「string」
         * にキャストしてくれる。
         */
        destBucket: process.env.DEST_BUCKET!
    };
    await JobExecutor.execute(job);
    return job;
}