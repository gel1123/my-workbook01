package com.example.batchprocessing;

import javax.sql.DataSource;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.builder.FlatFileItemReaderBuilder;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

// tag::setup[]
/**
 * プロジェクト名：gs-batch-processing-complete（完成版サンプル）
 * <hr>
 * このクラスは @SpringBootApplication と同じパッケージにあるため、
 * 自動的にコンポーネントスキャンの対象となり、DIコンテナに登録される。
 *
 *@EnableBatchProcessing を付与することで、バッチ処理に有用な
 * 各種Bean定義をインポートできる。
 * （JobRepositoryやJobBuilderFactory、StepBuilderFactoryなど）
 * 
 * また、JobLancherなど Spring Batch の根幹となる機能も、同じく @EnableBatchProcessing に内包されている。
 */
@Configuration
@EnableBatchProcessing
public class BatchConfiguration {

	/**
	 * このフィールドには、 @Autowired により、DIコンテナに登録済みの jobBuilderFactory が注入される。
	 * なお jobBuilderFactory のBean定義は、@EnableBatchProcessing が内包している。
	 */
	@Autowired
	public JobBuilderFactory jobBuilderFactory;

	/**
	 * このフィールドには、 @Autowired により、DIコンテナに登録済みの stepBuilderFactory が注入される。
	 * なお stepBuilderFactory のBean定義は、@EnableBatchProcessing が内包している。
	 */
	@Autowired
	public StepBuilderFactory stepBuilderFactory;
	// end::setup[]

	// tag::readerwriterprocessor[]
	/**
	 * このメソッドは @Bean アノテーション付きメソッドなので、
	 * コンポーネントスキャンにより実行され、
	 * return したインスタンスがDIコンテナに登録されるようになっている。
	 * <hr/>
	 * Stepが担う「入力」「加工」「出力」機能のうち、「入力」を担う
	 * ItemReaderの継承クラス「FlatFileItemReader」をBean定義している。
	 * 後述のStepのBean定義メソッドで利用される。
	 * <hr/>
	 * この「FlatFileItemReader」は 
	 * 『最大 2 次元（表）データを含む任意の型のファイル』を
	 * 行ごとに読み取るための再起動可能なItemReaderである。
	 * <hr/>
	 * なお今回読み取るフラットファイルは、次に示す形式のCSVファイルである。
	 * <pre>
	 * Jill,Doe
	 * Joe,Doe
	 * Justin,Doe
	 * </pre>
	 * 
	 * @return FlatFileItemReaderBuilder<Person>
	 */
	@Bean
	public FlatFileItemReader<Person> reader() {
		/**
		 * ### デリミタの指定について補足
		 * 下記の delimited() の応答に対し、「.delimiter("区切り文字")」で任意のデリミタを指定できる。
		 * 指定がない場合、DelimitedLineTokenizerのデフォルト設定により、
		 * デリミタはコンマになる。
		 */
		return new FlatFileItemReaderBuilder<Person>() // genericsで行ごとの情報の型を定義
			.name("personItemReader") // ItemReaderを命名
			.resource(new ClassPathResource("sample-data.csv")) // 入力リソースを指定
			.delimited() // デリミタのビルダー生成（デリミタ指定なしなら、コンマ区切りとみなす）
			.names(new String[]{"firstName", "lastName"}) // CSVの列を命名
			.fieldSetMapper(new BeanWrapperFieldSetMapper<Person>() {{
				// CSVの列ごとの値をPersonクラスにマップする
				setTargetType(Person.class);
			}})
			.build(); // ItemReader
	}

	/**
	 * このメソッドは @Bean アノテーション付きメソッドなので、
	 * コンポーネントスキャンにより実行され、
	 * return したインスタンスがDIコンテナに登録されるようになっている。
	 * <hr/>
	 * Stepが担う「入力」「加工」「出力」機能のうち、「加工」を担う
	 * ItemProcessorのカスタム継承クラスをBean定義している。
	 * 後述のStepのBean定義メソッドで利用される。
	 * 
	 * @return PersonItemProcessor
	 */
	@Bean
	public PersonItemProcessor processor() {
		return new PersonItemProcessor();
	}

	/**
	 * このメソッドは @Bean アノテーション付きメソッドなので、
	 * コンポーネントスキャンにより実行され、
	 * return したインスタンスがDIコンテナに登録されるようになっている。
	 * <hr/>
	 * Stepが担う「入力」「加工」「出力」機能のうち、「出力」を担う
	 * ItemWriterの継承クラス「JdbcBatchItemWriter」をBean定義している。
	 * 後述のStepのBean定義メソッドで利用される。
	 * <hr/>
	 * この「JdbcBatchItemWriter」は、名前付きパラメータを使用できるタイプのJDBCテンプレート
	 * が有すバッチ機能を用いて、SQLを指定し、データの書き込みを行うことができる。
	 * 
	 * @return JdbcBatchItemWriter<Person>
	 */
	@Bean
	public JdbcBatchItemWriter<Person> writer(DataSource dataSource) {
		return new JdbcBatchItemWriterBuilder<Person>() // 書き込みを行う情報の型をgenericsで定義
			.itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
			.sql("INSERT INTO people (first_name, last_name) VALUES (:firstName, :lastName)")
			.dataSource(dataSource)
			.build();
	}
	// end::readerwriterprocessor[]

	// tag::jobstep[]
	/**
	 * このメソッドは @Bean アノテーション付きメソッドなので、
	 * コンポーネントスキャンにより実行され、
	 * return したインスタンスがDIコンテナに登録されるようになっている。
	 * <hr/>
	 * ジョブのインスタンス生成にあたって、フィールドで @Autowired によりDIコンテナから注入された
	 * jobBuilderFactoryインスタンスを使用している。
	 * 
	 * @return Job
	 */
	@Bean
	public Job importUserJob(JobCompletionNotificationListener listener, Step step1) {
		return jobBuilderFactory.get("importUserJob") // ジョブを命名し、JobRepository登録
			.incrementer(new RunIdIncrementer()) // JobRepositoryの主キーをどう加算していくか
			.listener(listener) // JobListerをジョブに加える(イベントハンドリング用)
			.flow(step1) // フロー定義の外部化
			.end() // フローのビルド
			.build(); // 提供されたフローを実行するジョブのビルド 
	}

	/**
	 * このメソッドは @Bean アノテーション付きメソッドなので、
	 * コンポーネントスキャンにより実行され、
	 * return したインスタンスがDIコンテナに登録されるようになっている。
	 * <hr/> 
	 * ステップのインスタンス生成にあたって、フィールドで @Autowired によりDIコンテナから注入された
	 * stepBuilderFactoryインスタンスを使用している。
	 * 
	 * @return Step
	 */
	@Bean
	public Step step1(JdbcBatchItemWriter<Person> writer) {
		return stepBuilderFactory.get("step1") // Step命名 & JobRepository登録
			.<Person, Person> chunk(10) // 入力をPerson型、出力もPerson型。仕事量の単位（チャンク）を 10 に設定
			.reader(reader()) // ItemReader（入力）を指定
			.processor(processor()) // ItemProcessor（加工）を指定
			.writer(writer) // ItemWriter（出力）を指定
			.build(); // Step生成
	}
	// end::jobstep[]
}
