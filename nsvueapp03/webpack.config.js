const webpack = require("@nativescript/webpack");
const { DefinePlugin } = require('webpack');

module.exports = (env) => {
	webpack.init(env);

	const {
		production, // --env.production
	} = env;
	const mode = production ? "production" : "development"
	const platform = env && (env.android && "android" || env.ios && "ios" || env.platform);

	webpack.chainWebpack(config => {
		config.plugin('DefinePlugin').use(DefinePlugin, [
			{
				"TNS_ENV": JSON.stringify(mode),
				'global.TNS_WEBPACK': 'true',
				'global.isAndroid': platform === 'android',
				'global.isIOS': platform === 'ios',
				process: 'global.process',

				__UI_USE_XML_PARSER__: true,
				__UI_USE_EXTERNAL_RENDERER__: false,
				__CSS_PARSER__: JSON.stringify('css-tree')
			}
		])
	});

	return webpack.resolveConfig();
};
