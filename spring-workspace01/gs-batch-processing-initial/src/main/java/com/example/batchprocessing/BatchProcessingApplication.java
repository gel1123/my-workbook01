package com.example.batchprocessing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * プロジェクト名：gs-batch-processing-initial
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
