import { IStateRequest } from '../detect-sentiment';
import { JobExecutor } from './job-executor';

/** ステート情報インターフェイス */
export interface IStateInfo {
    id: string;
    srcBucket: string;
    objectKey: string;
}

/**
 * S3オブジェクト削除Lambdaのハンドラ
 */
export async function handler(event: IStateInfo): Promise<IStateInfo> {
    await JobExecutor.execute(event.srcBucket, event.objectKey);
    return event;
}