package com.example.batchprocessing;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.batch.item.ItemProcessor;

/**
 * プロジェクト名：gs-batch-processing-complete（完成版サンプル）
 * <hr>
 * Spring Batch は
 *   * JobLancher >> Job >> Step >> [ItemReader => ItemProcessor => ItemWriter]
 *  という構成になっており、
 *  このクラスのそのうちの「ItemProcessor」を担っている。
 *  Stepが担う「入力」「加工」「出力」機能のうち、「加工」に相当する。
 *  <br/>
 *  なおBatchConfigurationで、このクラスを用いたBean定義が行われている。
 */
public class PersonItemProcessor implements ItemProcessor<Person, Person> {

	private static final Logger log = LoggerFactory.getLogger(PersonItemProcessor.class);

	/**
	 * Stepの加工機能。
	 * 引数から入力を得て、加工した結果を return する。
	 * なおここで null を返却することは、「処理を継続しない」ことを意味する。
	 */
	@Override
	public Person process(final Person person) throws Exception {
		final String firstName = person.getFirstName().toUpperCase();
		final String lastName = person.getLastName().toUpperCase();

		final Person transformedPerson = new Person(firstName, lastName);

		log.info("Converting (" + person + ") into (" + transformedPerson + ")");

		return transformedPerson;
	}

}
