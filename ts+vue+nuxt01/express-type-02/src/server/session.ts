import Express from "express";
import session from "express-session";
import connectRedis from 'connect-redis'
import { REDIS_HOST, REDIS_PORT } from "../constant";

export default (app: Express.Application) => {
    /** AWSでもおなじみ。OSSのインメモリストア */
    const RedisStore = connectRedis(session)
    /** express-sessionのオプション */
    const option: session.SessionOptions = {
        // セッション保存用のストア
        store: new RedisStore({
            host: REDIS_HOST,
            port: REDIS_PORT
        }),
        // Cookieの暗号化キー
        secret: 'mugi-san-on-the-keyboard',
        /**
         * Trueなら、セッションを毎回セーブする（たとえ変更がなくとも）。
         * これにはセッションの有効期限が毎回更新されるというメリットがある。
         * デメリットは、特定の条件で意図せず「変更後のセッションを変更前のセッションで上書きする可能性」があること
         * （ロードバランサ使用時など）
         * 
         * 逆に、Falseなら変更があったときにしかセッションをストアに保存しない。
         * もしFalse設定であるものの、変更なし時にセッションの有効期限を更新したいなら、
         * `touch` をコールする必要がある。
         */
        resave: false
    }
    app.use(session(option))
}