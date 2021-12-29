import Express from 'express'
/** Express server instance  */
const app = Express()
// Routing
app.get('/', (req, res) => {
  res.send("Got a GET request.")
}).post('/', (req, res) => {
  res.send("Got a POST request.")
}).put('/', (req, res) => {
  res.send("Got a PUT request.")
}).delete('/', (req, res) => {
  res.send("Got a DELETE request.")
})
// Settings
const port = 8888
const host = 'localhost'
// Run Express Server
app.listen(port, host, () => {
  console.log(`Running on http://${host}:${port}`)
})

