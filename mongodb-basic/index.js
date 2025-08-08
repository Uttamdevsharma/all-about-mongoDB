const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000


//middleware
app.use(express.json())
app.use(cors())



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
    


    //add new user to users collection
    app.post('/add-user', async(req,res) => {
      
      try{
        const newUser =req.body;
      const result = await usersCollection.insertMany(newUser)
      res.status(200).json({
        message:"User created successfully",
        result
      })
      }catch(error){
        res.status(400).json({
          message: "failed to create user",
          error
        })
      }
    })



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
