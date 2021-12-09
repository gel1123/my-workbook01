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

STSでインポートできる Spring Batch の入門コンテンツ（の完成版）では、次のファイルが用意されている。

* BatchProcessingApplication.java
  * アプリケーションコンテキスト。
  * @SpringBootApplication が内包する機能により、パッケージ内のBeanをDI登録したりする。
  * なお起動時に SptingBoot の便利機能によって、データソースが自動で登録されたり、schema-@@platform@@.sql が自動実行されたりする。
* BatchConfiguration.java
  * Bean定義。
  * @EnableBatchProcessing で JobRepository, JobBuilderFactory, StepBuilderFactory など Spring Batch に必要なBeanを予め取り込んでいる。  
  * 上記を用いながら、JobやStepのBean定義を行っている。
  * さらに JobLancherなど Spring Batch の根幹となる機能も、同じく @EnableBatchProcessing に内包されている。
* JobCompletionNotificationListener.java
  * JobExecutionListener実装クラスであり、ジョブの前後に実行したい処理を挿入できる。
  * ここでは afterJob だけ定義されており、beforeJobは継承したJobExecutionListenerSupportに従い処理なしとなっている。
* Person.java
  * 「姓」と「名」が用意されているエンティティ
* PersonItemProcessor.java
  * 「入力」「加工」「出力」を担うStepの機能のうち、「加工」フローの実装。
  * BatchConfigurationで、ItemProcessorのBean定義時に使用されている。
* sample-data.csv
  * BatchConfigurationで定義したItemReaderが読み取っている
* schema-all.sql
  * Personエンティティに対応するテーブル作っている。
  * [ドキュメント](https://spring.pleiades.io/guides/gs/batch-processing/)によると、Spring Boot は、起動時に schema-@@platform@@.sql を自動的に実行する模様。-all はすべてのプラットフォームのデフォルトであるため、毎回必ず実行される。

上記の入門コンテンツのファイル構成をもとに、「基本的な使い方」としてざっくりまとめるなら、下記のようになる。

1. まずアプリケーションコンテキストを定義する
2. 次にバッチ処理に必要な下記コンポーネントを、Bean定義する  
  a. Job  
  b. Step（ItemReader, ItemProcessor, ItemWriterを内包）  
  c. 必要ならListenerも
3. 入出力する情報の構造を示すクラスを定義
4. 入力データを用意
5. もしDBに情報を出力したいなら（そして SpringBootアプリケーションとして実行するなら）テーブル定義となる schema-@@platform@@.sql を用意
