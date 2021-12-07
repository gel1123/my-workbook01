package com.example.batchprocessing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * プロジェクト名：gs-batch-processing-initial
 * <hr>
 * Spring Batchの入門コンテンツから生成されたテンプレート。
 * 「Spring 入門コンテンツのインポート」から始めると、
 * 似た名前のプロジェクト「gs-batch-processing-complete」も同時に作成されるが、
 * そちらは完成版のサンプルプロジェクト。
 * 
 * 一方でこちらの「gs-batch-processing-initial」は単なるテンプレートとなっている。
 * <hr>
 * アプリケーションコンテキストをmain()で取得している。
 * なおアプリケーションコンテキストはDIコンテナの役割を担っている。
 * コンテナには、ConfigurationによってBeanと呼ばれるコンポーネントが登録されるようになっているが、
 * SpringBootApplicationでは、Configurationの明示的な指定がなくても
 * いい感じに動くようになっている。
 *
 */
@SpringBootApplication
public class BatchProcessingApplication {

	public static void main(String[] args) {
		SpringApplication.run(BatchProcessingApplication.class, args);
	}

}
