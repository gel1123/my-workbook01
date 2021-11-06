import * as aws from 'aws-sdk';

/**
 * 感情分析用Lambdaのコアロジック.
 * テストのしやすさから、Lambdaではコアロジックを
 * ハンドラから分離するのが良いとされている。
 */

const COMPREHEND_BATCH_SIZE = 25;
const s3 = new aws.S3();
const comprehend = new aws.Comprehend();

/**
 * ジョブ実行時のパラメータ。
 * objectKeyは、s3からオブジェクトを取得するためのキー
 */
export interface IJobParameter {
    id: string;
    srcBucket: string;
    objectKey: string;
    destBucket: string;
}

/**
 * 感情分析の入出力JSONインターフェイス.
 */
interface IComprehend {
    id: string;
    topic: string;
    language: string;
    content: string;
    sentiment?: string;
    score?: {
        positive: number;
        negative: number;
        neutral: number;
        mixed: number;
    };
}

export class JobExecutor {
    public static async execute(job: IJobParameter): Promise<string> {
        const items: IComprehend[] = await JobExecutor.getItems(job.srcBucket, job.objectKey);

        /** キーが言語、値が入力配列 */
        const dict: Map<string, IComprehend[]> = JobExecutor.divideByLanguage(items);

        /**
         * Map型を「for of」で回すと...
         * ```
         * > new Map([ ["key1", "val1"], ["key2", "val2"] ])
         * Map(2) { 'key1' => 'val1', 'key2' => 'val2' }
         * 
         * > for (const m of new Map([ ["key1", "val1"], ["key2", "val2"] ]) ) console.log(m)
         * [ 'key1', 'val1' ]
         * [ 'key2', 'val2' ]
         * ```
         */
        for (const ary of dict) {
            // arr[0] はMapのキーなので、ここではlanguage
            // arr[1] はMapの値なので、ここではComprehend[]
            await JobExecutor.detectSentiment(ary[0], ary[1]);
        }
        const body: string = await JobExecutor.putJsonLines(job.destBucket, job.objectKey, items);
        return body;
    }

    /**
     * JSON Lines形式のオブジェクトから、
     * 感情分析の対象データを取得する。
     */
    private static async getItems(srcBucket: string, objectKey: string): Promise<IComprehend[]> {
        const res = await s3.getObject({
            Bucket: srcBucket,
            Key: objectKey
        }).promise();
        const items: IComprehend[] = [];

        if (res.Body) {
            /** 応答本文を改行コードを分割した配列 */
            const lines = res.Body.toString().split(/\r?\n/);
            lines.forEach(text => {
                if (text) {
                    /** 感情分析入力オブジェクト */
                    const obj: IComprehend = JSON.parse(text);
                    items.push(obj);
                }
            });
        }
        return new Promise(resolve => {
            resolve(items);
        });
    }

    /**
     * 感情分析対象データのリストを言語単位で分割する。
     */
    private static divideByLanguage(items: IComprehend[]): Map<string, IComprehend[]> {
        const dict = new Map<string, IComprehend[]>();

        items.forEach(item => {
            const key = item.language;
            const list = dict.get(key) || [];
            list.push(item);
            dict.set(key, list);
        });
        return dict;
    }

    /**
     * 感情分析を実行する
     */
    private static async detectSentiment(language: string, items: IComprehend[]): Promise<void> {

        /**
         * Comprehendが一度のバッチ処理で扱えるデータ量の塊ごとに、
         * 入力オブジェクトを行で分割する。
         */
        const blocks: IComprehend[][] = items.reduce<IComprehend[][]>(
            (previous, current, index) => index % COMPREHEND_BATCH_SIZE ?
                previous :
                [...previous, items.slice(index, index + COMPREHEND_BATCH_SIZE)]
            , []
        );

        // list === Comprehendが一度にバッチ処理できる入力オブジェクト
        for (const list of blocks) {
            const res = await comprehend.batchDetectSentiment({
                TextList: list.map(x => x.content),
                LanguageCode: language
            }).promise();

            res.ResultList.forEach(result => {
                const index = result.Index;
                if (index !== undefined) {
                    const doc = list[index];
                    doc.sentiment = result.Sentiment;
                    doc.score = {
                        positive: result.SentimentScore?.Positive || 0,
                        negative: result.SentimentScore?.Negative || 0,
                        neutral: result.SentimentScore?.Neutral || 0,
                        mixed: result.SentimentScore?.Mixed || 0
                    };
                }
            });
        }
    }

    /**
     * JSON Lines形式のオブジェクトを出力して、
     * 出力用S3バケットに格納する。
     * 
     * ### JSON Lines（JSONL）とは
     * ```
     * // JSON
     * [ {"key":"hoge","val":"1"}, {"key":"fuge","val":"2"}, {"key":"sage","val":"3"} ]
     * 
     * // JSONL
     * {"key":"hoge","val":"1"}
     * {"key":"fuge","val":"2"}
     * {"key":"sage","val":"3"}
     * ```
     * 
     * @param destBucket 
     * @param objectKey 
     * @param items 
     */
    private static async putJsonLines(destBucket: string, objectKey: string, items: IComprehend[]): Promise<string> {
        const lines: string[] = [];
        items.forEach(item => {
            const line = JSON.stringify(item);
            lines.push(line);
        });

        await s3.putObject({
            Bucket: destBucket,
            Key: objectKey,
            Body: lines.join('\n')
        }).promise();

        return lines.join('\n');
    }
}