package com.example.batchprocessing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * プロジェクト名：gs-batch-processing-complete（完成版サンプル）
 * <hr>
 * 「Spring 入門コンテンツのインポート」から生成されたSpring Batchの入門アプリ。
 * 似た名前のプロジェクト「gs-batch-processing-initial」も生成されるが、 そちらは主要な処理が実装されていないテンプレート。
 * 一方でこちらは、すでに必要な処理を実装し終えた完成版のサンプルアプリである。
 * <hr>
 * アプリケーションコンテキストをmain()で取得している。 なおアプリケーションコンテキストはDIコンテナの役割を担っている。
 * コンテナには、ConfigurationによってBeanと呼ばれるコンポーネントが登録されるようになっているが、
 * SpringBootApplicationでは、Configurationの明示的な指定がなくても いい感じに動くようになっている。
 * <hr>
 * <h3>参考</h3>
 * Spring Batchの日本語公式ドキュメントは次リンク：
 * https://spring.pleiades.io/spring-batch/docs/current/reference/html/
 */
@SpringBootApplication
public class BatchProcessingApplication {

	public static void main(String[] args) throws Exception {

		/**
		 * System::exitメソッド。
		 * 現在実行中のJVMを終了する。引数はステータスコードとして機能する。
		 * なおステータスコードは、慣例によりゼロ以外を異常とみなす。
		 * Runtime.getRuntime().exit(n)と同様。
		 */
		System.exit(
				/**
				 * SpringApplication::exitメソッド。
				 * 現在実行中のSpringアプリケーションを終了する。 
				 * 処理が成功ならゼロを返し、異常ならいくつかのルールに基づきゼロ以外の数値を返す。
				 * なお第一引数には、アプリケーションコンテキストを要求する。
				 */
				SpringApplication.exit(
						/**
						 * SpringApplication::runメソッド。
						 * 指定されたソースからSpringApplicationを実行する。
						 * 第一引数には primary source（大抵の場合は、いわゆるmainメソッドが定義されたクラス）を
						 * 指定する。
						 * 戻り値は実行中のアプリケーションコンテキスト。
						 * 
						 * ※補足1
						 * 通常、Spring Frameworkのアプリケーションでは、
						 * SpringApplication::runの第一引数のBean定義を含む @Configuration クラス
						 * を指定する。
						 * しかしSpringBootでは、 @SpringBootApplication 内に @Configuration が
						 * 内包されているので、いっけん @Configuration の指定がないように見える。
						 * 
						 * ※補足2
						 * 「 @SpringBootApplication に @Configuration が内包されているのは分かったけど、
						 * どうして同じパッケージ内の別クラスに付与された @Configuration まで、ちゃんとDIコンテナ
						 * に登録されるようになってるの？」
						 * と、思うかもしれないが、その答えは、同じく @SpringBootApplication に内包された
						 * @ComponentScan にある。
						 * 
						 * @ComponentScan は、文字通り
						 * コンポーネントスキャン（Bean定義を探して DIコンテナに登録する）を行う。
						 * このアノテーションには、「value属性」「basePackages属性」が存在しており、
						 * これらに設定したパッケージの配下をスキャンするようになっている。
						 * 
						 * また、上記属性が設定されていない場合は、 @ComponentScan が付与された
						 * @Configuration クラスと同じパッケージの配下をスキャンする。
						 * 
						 * @SpringBootApplication が内包する @ComponentScan には上記属性が付与されていない
						 * ので、 @SpringBootApplication と同じパッケージの配下を
						 * コンポーネントスキャンするようになっている。 
						 */
						SpringApplication.run(BatchProcessingApplication.class, args)));
	}
}
