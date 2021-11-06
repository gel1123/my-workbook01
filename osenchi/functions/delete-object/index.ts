import { IStateRequest } from '../detect-sentiment';
import { JobExecutor } from './job-executor';

/**
 * ステート情報インターフェイス.
 * 
 * Lambdaハンドラ第一引数の入力型であり、
 * 前段階のTaskの応答型の部分集合である。
 */
export interface IStateInfo {
    id: string;
    srcBucket: string;
    objectKey: string;
    sentiment: string;
}

/**
 * S3オブジェクト削除Lambdaのハンドラ
 */
export async function handler(event: IStateInfo): Promise<IStateInfo> {
    await JobExecutor.execute(event.srcBucket, event.objectKey);
    return event;
}