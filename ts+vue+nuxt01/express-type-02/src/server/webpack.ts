import Express from 'express'
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const config = require('../../webpack.config')
const compiler = webpack(config)

/**
 * webpack-dev-serverっぽくExpressサーバを拡張する。
 * Hot Module Replacement（HMR）も適用される。
 */
export default (app: Express.Application) => {
    if (process.env.NODE_ENV !== 'production') {
        app.use(hotMiddleware(compiler))
        app.use(devMiddleware(compiler, {
            noInfo: true, // ビルドに関するログ出力を抑制
            publicPath: config.output.publicPath // バンドルされたファイルの配置先
        }))
    }
}
