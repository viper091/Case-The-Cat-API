var MongoClient = require('mongodb').MongoClient;

const username = encodeURIComponent(process.env['mongo_user']);
const password = encodeURIComponent(process.env['mongo_pass']);
// Connection URI
const uri =
  `mongodb://${username}:${password}@mongo:27017/?authMechanism=DEFAULT`
// Create a new MongoClient
const client = new MongoClient(uri);

const logger=require("./logger")
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    logger.debug("Connected successfully to server");
  } 
  catch(e){

    logger.error("failed to connect mongo", {e})
  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    
  }
}
 
run().catch(console.dir);

module.exports = client