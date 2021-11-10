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
				"TNS_ENV": JSON.stringify(mode)
			}
		])
	})

	return webpack.resolveConfig();
};


