import cors from 'cors'
import Express from 'express'
import { IResBody } from '../types/api'
/** Express server instance  */
const app = Express()
// CORS
app.use(cors())
// Routing（ハンドラ定義順で処理が実行されていく）
app.get('/', (req, res) => {
  const data: IResBody = {message: "Got a GET request."}
  res.send(data)
}).post('/', (req, res) => {
  const data: IResBody = {message: "Got a POST request."}
  res.send(data)
}).put('/', (req, res) => {
  const data: IResBody = {message: "Got a PUT request."}
  res.send(data)
}).delete('/', (req, res) => {
  const data: IResBody = {message: "Got a DELETE request."}
  res.send(data)
})
// 404 Route（ルートに一致しなかったから404）
app.use((req, res, next) => {
  res.sendStatus(404)
  next({statusCode: 404})
})
// Error Route（終点。NextFunctionの引数を第一引数で受け取る）
app.use((
  err: {statusCode: number},
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  console.log(err.statusCode)
})
const port = 8888
const host = 'localhost'
// Run Express Server
app.listen(port, host, () => {
  console.log(`* Running on http://${host}:${port}`)
})

