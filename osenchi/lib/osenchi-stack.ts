import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class OsenchiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * 入力バケットのインスタンス
     * 
     * コンストラクタには第一引数にスタック自身、
     * 第二引数にConstructID、
     * 第三引数にバケットのプロパティを指定する。
     * 
     * なおバケット名を省くと、ConstructIDと構造をもとにハッシュ値を計算して自動命名する。
     * S3バケットの名前の衝突を回避したいなら、自動命名を使うのも一つの手。
     */
    const inputBucket: s3.Bucket = new s3.Bucket(this, 'OsenchiInputBucket', {
      bucketName: 'osenchi-inputbucket'
    });

    /**
     * 出力バケットのインスタンス
     */
    const outputBucket: s3.Bucket = new s3.Bucket(this, 'OsenchiOutputBucket', {
      bucketName: 'osenchi-outputbucket'
    });
  }
}
