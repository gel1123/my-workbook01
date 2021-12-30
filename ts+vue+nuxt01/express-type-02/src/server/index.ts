import Express from 'express'
import config from './config'
import session from './session'
import webpack from './webpack'
import routes from './routes'
import error from './error'
import listen from './listen'

const app = Express()

config(app)
session(app)
webpack(app)
routes(app)
error(app)
listen(app)
