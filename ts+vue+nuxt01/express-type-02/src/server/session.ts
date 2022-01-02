import Express from "express";
import session from "express-session";
import Redis from 'ioredis'
import connectRedis from 'connect-redis'
import { REDIS_HOST, REDIS_PORT } from "../constant";

/**
 * Redisへ接続するクライアント。
 * 旧来のRedis（"connect-redis": "3.x.x"）では、これは不要で
 * 後述のコメントアウトだけ書けば動いたが、
 * 4.x.x以降は redis パッケージを用いたクライアントの指定
 * が必要となる。
 * 
 * なおClientの作成方法にはほかにもあるっぽいが、
 * 下記では上手くいかなかった
 * （クライアントの接続まわりが謎。connectしても切断されるか、
 * 切断されずともそもそもExpressのルーティングまで処理が到達しないか）
 * 
 * ```
 * import { createClient } from 'redis'
 * const redisUrl = `redis://${REDIS_HOST}:${REDIS_PORT}`
 * const redisClient = createClient({url: redisUrl})
 * ```
 * 
 * 下記の方法なら繋がる。
 * この方法は次の記事を参考にさせていただきました。
 * [ExpressとRedisでセッションを実装してAWS Fargateにデプロイしよう-ローカル編](https://zenn.dev/michinosuke/articles/express_redis_aws_01)
 */
export const redisClient = new Redis(REDIS_PORT, REDIS_HOST)

export default (app: Express.Application) => {
    // const c = redisClient.connect()
    // c.then(() => {
    //   console.log("---- redis connected! ----")  
    // })
    /** AWSでもおなじみ。OSSのインメモリストア */
    const RedisStore = connectRedis(session)
    /** express-sessionのオプション */
    const option: session.SessionOptions = {
        // セッション保存用のストア
        store: new RedisStore({
            client: redisClient
        }),
        // 旧来のRedis（"connect-redis": "3.x.x"）では、
        // 次のように書けば動いていたが、
        // 4.x.x以降は、コンパイルエラーこそでないものの、
        // 実行時に `A client must be directly provided to the RedisStore` 
        // というエラーが出るようになっている
        // store: new RedisStore({
        //     host: REDIS_HOST,
        //     port: REDIS_PORT
        // }),
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