const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000



//connecting to mongodb
const uri = "mongodb+srv://uttamrohit4545:10eNSeDhxpmCRVTv@mongodb-basic.vhl6aay.mongodb.net/?retryWrites=true&w=majority&appName=mongodb-basic";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    //create db and collection
    const db = client.db("mydatabase");
    const usersCollection = db.collection("users")
    const jobsCollection =db.collection("jobs")
     
    //add user to the users collection
     const user = {name : "Uttam" , age : 24 , email : "uttam@gmail.com"}
    usersCollection.insertOne(user);




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




//home route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//uttamrohit4545
//10eNSeDhxpmCRVTv
