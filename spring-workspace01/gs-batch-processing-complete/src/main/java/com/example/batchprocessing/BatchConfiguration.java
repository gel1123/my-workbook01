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
 * 各種機能を利用することができる。
 */
@Configuration
@EnableBatchProcessing
public class BatchConfiguration {

	/**
	 * このフィールドには、 @Autowired により、DIコンテナに登録済みの jobBuilderFactory が注入される。
	 */
	@Autowired
	public JobBuilderFactory jobBuilderFactory;

	/**
	 * このフィールドには、 @Autowired により、DIコンテナに登録済みの stepBuilderFactory が注入される。
	 */
	@Autowired
	public StepBuilderFactory stepBuilderFactory;
	// end::setup[]

	// tag::readerwriterprocessor[]
	/**
	 * このメソッドは @Bean アノテーション付きメソッドなので、
	 * コンポーネントスキャンにより実行され、
	 * return したインスタンスがDIコンテナに登録されるようになっている。
	 * 
	 * @return FlatFileItemReaderBuilder<Person>
	 */
	@Bean
	public FlatFileItemReader<Person> reader() {
		return new FlatFileItemReaderBuilder<Person>()
			.name("personItemReader")
			.resource(new ClassPathResource("sample-data.csv"))
			.delimited()
			.names(new String[]{"firstName", "lastName"})
			.fieldSetMapper(new BeanWrapperFieldSetMapper<Person>() {{
				setTargetType(Person.class);
			}})
			.build();
	}

	/**
	 * このメソッドは @Bean アノテーション付きメソッドなので、
	 * コンポーネントスキャンにより実行され、
	 * return したインスタンスがDIコンテナに登録されるようになっている。
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
	 * 
	 * @return JdbcBatchItemWriter<Person>
	 */
	@Bean
	public JdbcBatchItemWriter<Person> writer(DataSource dataSource) {
		return new JdbcBatchItemWriterBuilder<Person>()
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
	 * 
	 * ジョブのインスタンス生成にあたって、フィールドで @Autowired によりDIコンテナから注入された
	 * jobBuilderFactoryインスタンスを使用している。
	 * 
	 * @return Job
	 */
	@Bean
	public Job importUserJob(JobCompletionNotificationListener listener, Step step1) {
		return jobBuilderFactory.get("importUserJob")
			.incrementer(new RunIdIncrementer())
			.listener(listener)
			.flow(step1)
			.end()
			.build();
	}

	/**
	 * このメソッドは @Bean アノテーション付きメソッドなので、
	 * コンポーネントスキャンにより実行され、
	 * return したインスタンスがDIコンテナに登録されるようになっている。
	 * 
	 * ステップのインスタンス生成にあたって、フィールドで @Autowired によりDIコンテナから注入された
	 * stepBuilderFactoryインスタンスを使用している。
	 * 
	 * @return Step
	 */
	@Bean
	public Step step1(JdbcBatchItemWriter<Person> writer) {
		return stepBuilderFactory.get("step1")
			.<Person, Person> chunk(10)
			.reader(reader())
			.processor(processor())
			.writer(writer)
			.build();
	}
	// end::jobstep[]
}
