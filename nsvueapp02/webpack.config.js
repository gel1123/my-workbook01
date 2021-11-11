const webpack = require("@nativescript/webpack");
const { DefinePlugin } = require('webpack');

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	// 下記で必要なので、tns migrate前の同名ファイルから定義を移植
	const {
        production, // --env.production
    } = env;
	const mode = production ? "production" : "development"

	// first we add our callback to the internal chain
	webpack.chainWebpack(config => {
		// we add the plugin
		config.plugin('DefinePlugin').use(DefinePlugin, [
			{
				"TNS_ENV": JSON.stringify(mode),
				__UI_USE_EXTERNAL_RENDERER__: false,
			}
		])
	});

	/*************************************
	 * TNS_ENVがReferenceErrorとなるため、DefinePluginを入れようとしたが、
	 * そのとき動かなかったことに関する対策メモ
	 * 
	 * ※引用：
	 * https://blog.nativescript.org/nativescript-8-1-announcement/index.html
	 * 
	 * 
	 * ## Using 8.1 with webpack 4.x.x?
	 * If you are still using @nativescript/webpack ~4.1.0 (or prior), you may see an error like this one 😱
	 * 
	 * ```
	 * System.err: An uncaught Exception occurred on "main" thread.
	 * System.err: Calling js method getView failed
	 * System.err: ReferenceError: __UI_USE_EXTERNAL_RENDERER__ is not defined
	 * ```
	 * 
	 * To use 8.1 you will need to modify your webpack.config.js by adjusting the DefinePlugin rules:
	 * 
	 * ```
	 * new webpack.DefinePlugin({
	 *   'global.TNS_WEBPACK': 'true',
	 *   'global.isAndroid': platform === 'android',
	 *   'global.isIOS': platform === 'ios',
	 *   process: 'global.process',
	 * 
	 *   // add these 3 lines
	 *   __UI_USE_XML_PARSER__: true,
	 *   __UI_USE_EXTERNAL_RENDERER__: false,
	 *   __CSS_PARSER__: JSON.stringify('css-tree')
	 * }),
	 * ```
	 */

	return webpack.resolveConfig();
};


