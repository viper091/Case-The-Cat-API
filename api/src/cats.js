
var express = require('express');
var router = express.Router();
const logger = require("./logger")
const mongo = require("./mongo")
// define the home page route
router.get('/', function (req, res) {

  mongo.db("animals")
    .collection("cats")
    .find({})
    .toArray()
    .then(x => {
      res.send(x)
      logger.info("listing all cats " + x.length)
    }).catch(err=>{
      logger.error("failed to connect to mongodb", {err})
      res.status(500).send("internal error")
    })

});
// define the about route
router.get('/breed', function (req, res) {
  id = req.query.id || undefined
  if (!id || id?.length < 4) {

    logger.warn("cats invalid id", { id })
    res.status(400).send("invalid")
    return
  }
  logger.info("breed "+id)
  mongo.db("animals")
    .collection("cats")
    .find({
      name: id
    })
    .toArray()
    .then(x => res.send(x))
    .catch(err=>{
      logger.error("failed to connect to mongodb", {err})
      res.status(500).send("internal error")
    })
});



// define the about route
router.get('/temperament', function (req, res) {
  temp = req.query.temp || undefined
  if (!temp || temp?.length < 4) {

    logger.warn("cats invalid temp", { temp: temp })
    res.status(400).send("invalid")
    return
  }

  temp = temp.replace(/,/g,", ")
  logger.info("temperament for:" + temp)
  const query = { 'temperament': { '$regex' : temp, '$options' : 'i' } }

  mongo.db("animals")
    .collection("cats")
    .find(query)
    .toArray()
    .then(x => res.send(x))
    .catch(err=>{
      logger.error("failed to connect to mongodb", {err})
      res.status(500).send("internal error")
    })
});


router.get('/origin', function (req, res) {
  country = req.query.country || undefined
  if (!country || !country?.length > 1) {

    logger.warn("cats invalid country", { country })
    res.status(400).send("invalid")
    return
  }
logger.info("country for:" + country)
  mongo.db("animals")
    .collection("cats")
    .find({
      origin: country.replace("-"," ")
    })
    .toArray()
    .then(x => res.send(x))
    .catch(err=>{
      logger.error("failed to connect to mongodb", {err})
      res.status(500).send("internal error")
    })
});

module.exports = router;