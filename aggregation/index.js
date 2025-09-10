const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000


//middleware
app.use(express.json())
app.use(cors())

require('dotenv').config();
const uri = process.env.MONGODB_URL;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    // strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("mydatabase")
    const salesCollection = db.collection("sales")
    const regionsCollection = db.collection("regions")



//    //single purpose aggregation - countDocuments , distinct
//    const salesDocument = await salesCollection.countDocuments();
//    console.log("total document is:",salesDocument);

//    const regionDistinct = await salesCollection.distinct("region")
//    console.log(regionDistinct)




    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port , () => {
    console.log(`server is running on port ${port}`)
})


// username - uttamrohit4545_db_user
// password - HB993D7dpgvV78Bv