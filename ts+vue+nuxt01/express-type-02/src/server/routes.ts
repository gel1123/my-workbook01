import Express from 'express'
import createError from 'http-errors'
import { IResBody } from '../types/api'

declare module 'express-session' {
    // ExpressのSessionData型にプロジェクトドメイン固有の知識（型）を拡張する
    interface SessionData {
        count?: number
    }
}

export default (app: Express.Application) => {
    // session.countの初期化ミドルウェア
    app.use(async (req, res, next) => {
        console.log('Request URL:', req.originalUrl)
        console.log("checkpoint1")
        // `@types/express-session` のおかげで、req.sessionの型参照が追加されている
        if (req.session !== undefined) {
            console.log("checkpoint1-1")
            if (req.session.count === undefined || req.session.count === null) {
                console.log("checkpoint1-2")
                req.session.count = 0;
            }
        }
        console.log("checkpoint1-3")
        next()
    })
    app.get('/', (req, res, next) => {
        console.log("checkpoint2")
        if (req.session && req.session.count !== undefined) {
            console.log("checkpoint2-1")
            const data: { count: number } = { count: req.session.count }
            console.log("checkpoint2-2")
            res.render('index.ejs', data)
            return
        }
        next(createError(401))
    })
    app.get('/ping', (req, res, next) => {
        console.log("checkpoint3")
        if (req.session && req.session.count !== undefined) {
            req.session.count++
            const data: IResBody = { message: "pong", count: req.session.count }
            res.send(data)
            return
        }
        next(createError(401))
    })
}