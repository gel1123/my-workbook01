import Express from 'express'
import { APP_HOST, APP_PORT } from '../constant'

export default (app: Express.Application) => {
    app.listen(APP_PORT, APP_HOST, () => {
        console.log(`Running on http://${APP_HOST}:${APP_PORT}`)
    })
}