const express = require('express')
const app = express()
const port = 3000
const logger = require("./logger")
const bodyParser = require("body-parser")



app.use(require("./metrics"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200).send('Cats api')
})

app.get("/-/healthy", (req, res) => {
  logger.info('hi')

  res.status(200).send("ok")
});
app.get("/error", (req,res)=>{

  logger.error("teste error")
  res.status(500).send("error")
})
app.get("/latencia", (req,res) =>{

  setTimeout(()=>{
    res.send("teste")
  }, 5000)
})
app.use("/cats", require("./cats"))

function logErrors(err, req, res, next) {

  logger.error(`error request ${req.url} ${req.method}`, {
    "body_from": req.body,
    err: err.stack
  });

  next(err);
}
app.use(logErrors)

app.listen(port, () => {console.log("listenig")})