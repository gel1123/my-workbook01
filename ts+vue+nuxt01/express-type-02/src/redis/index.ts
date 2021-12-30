// @ts-ignore //<=型定義なしパッケージかつ型を重要視しないなら、コンパイルチェックをスキップさせるのもひとつの手
import RedisServer from 'redis-server'
import { REDIS_HOST, REDIS_PORT } from '../constant'
/**
 * Redisサーバ。
 * もしサーバ起動時に `Error: spawn redis-server ENOENT` と怒られたら、
 * サーバとして動作させる端末上にRedisがそもそもインストールされていないはずなので、
 * パッケージマネージャ等からインストールする。
 * 
 * ArchLinuxなら公式リポジトリにRedisが存在するから、
 * `sudo pacman -S redis` でインストールできる。
 */
const server = new RedisServer(REDIS_PORT)
server.open((err: any) => {
    if (err === null) {
        console.log(`Running on http://${REDIS_HOST}:${REDIS_PORT}`)
    } else {
        console.log(err)
    }
})