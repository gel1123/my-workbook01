## はじめに
### これはなに
STSからインポートできるSpring Batchの入門コンテンツをもとに、学習を試みるリポジトリです。

### 筆者の学習の状況と進捗
#### 2021年12月
何年か前にSpring BootでWebアプリを軽くひょいひょいすることしかしたことのなかった筆者が、
色々と転機があり、危機感を覚え、一度一通りSpring Framework自体のことを含めて手広く基本を抑えようとしているようです。

なお並行して「Spring徹底入門 Spring FrameworkによるJavaアプリケーション開発 | 株式会社NTTデータ」を読みはじめているようです。

## Spring Batchについて色々メモ

### Spring Batch のざっくりとしたイメージ

日本語版の公式ドキュメントは [こちら](https://spring.pleiades.io/spring-batch/docs/current/reference/html/)。

筆者はまともにバッチ処理の設計を行ったことがないが、
引用元によると、どうやらステレオタイプ的なバッチ参照アーキテクチャといえば、下記のような図になるらしい。

（同時にこの図は、『Spring Batch のドメイン言語を構成する重要な概念を協調している』らしい）

![spring-batch-reference-model](https://user-images.githubusercontent.com/41170561/145117317-b386a182-06df-4cd1-8c74-72c02a0588ee.png)  
※引用：[バッチのドメイン言語 | Spring](https://spring.pleiades.io/spring-batch/docs/current/reference/html/domain.html#domainLanguageOfBatch)

これを筆者自身の言葉でまとめてみる
（誰かがきれいにまとめてあるものを、わざわざ無視して自分なりに解釈しようとするのは、心的イメージの構築が狙い）。

* 3つのコンポーネントがある
  * ジョブを開始させるコンポーネント（JobLauncher）
  * ジョブそのものを司るコンポーネント（Job）
  * 実際の処理ひとつひとつを担うコンポーネント（Step）
* これら（JobLauncher、Job、Step）はすべて『現在実行中のプロセスに関するメタデータ』である JobRepository とやりとりを行う。
* 処理の実働部隊であるStepは「入力」「加工」「出力」の3つの機能を担う

書いていて、 AWS Step Functions の構成のようだと思った。たとえば
* Step Functions のステートマシンをトリガーするEventBridge（JobLancherと類似）
* タスクを管理するステートマシン（Jobと類似）
* 実際の処理ひとつひとつを担うタスク（Stepと類似）

という感じ。AWS Step Functions の場合は、JobRepository的なものを意識することがないが、
実際にはステートマシン（状態遷移図／ワークフロー）が、見えないところでプロセスのメタデータを管理してくれている。

### Spring Batch ってどう使うの？（入門コンテンツベースで探ってみる）

探り中...

STSでインポートできる Spring Batch の入門コンテンツ（の完成版）では、次のファイルが用意されている。

* BatchProcessingApplication.java
  * アプリケーションコンテキスト。
  * @SpringBootApplication が内包する機能により、パッケージ内のBeanをDI登録したりする。
* BatchConfiguration.java
  * Bean定義。
  * @EnableBatchProcessing でなんかしてそうだけどまだ調べられていない。
* JobCompletionNotificationListener.java
  * JobExecutionListenerSupportを継承
  * afterJobを @Override して、Job実行後の処理をなんかしてるっぽいけどまだ調べられていない
* Person.java
  * 「姓」と「名」が用意されているエンティティ
* PersonItemProcessor.java
  * ItemProcessorを継承していることから、Stepの加工処理を担っているのだと想定
  * あれ？ ItemReaderとItemWriteはどこ？
* sample-data.csv
  * ItemReaderがあるならそこで読み取ってそうだけど...
* schema-all.sql
  * Personエンティティに対応するテーブル作ってるみたい。
  * どこでこれ実行してる？
  * そもそもDBとの接続ってどこ？




