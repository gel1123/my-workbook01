import path from 'path'
import Express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

export default (app: Express.Application) => {
    // Expressサーバの基本構成を行う
    const publicDir = path.join(__dirname, '../public')
    const clientDir = path.join(__dirname, '../client')
    // 静的ファイルのホスティング設定
    app.use(Express.static(publicDir))
    // ViewとしてEJSを利用することを宣言
    app.set('view engine', 'ejs')
    // EJSの配置ディレクトリを指定
    app.set('views', clientDir)
    /**
     * リクエストボディの解析方法をミドルウェアとして指定。
     * bodyParser::urlencodedメソッドのextendedオプションで、
     *  + falseを渡せば「appliation/json」形式
     *  + trueを渡せば「application/x-www-form-urlencoded」形式
     * で解析できる。
     * 
     * application/jsonは、文字通りJSON形式なので `{"hoge": "val1", "fuge": "val2"}` という感じ。
     * application/x-www-form-urlencodedは、URLクエリのような `hoge=val1&fuge=val2` という感じ。
     * 
     * ここでは後者を選択している。
     */
    app.use(bodyParser.urlencoded({extended: true}))
    // Cookieの解析をミドルウェアとして指定
    app.use(cookieParser())
}