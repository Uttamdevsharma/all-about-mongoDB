const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URL;
const port = process.env.PORT || 3000


//middleware
app.use(express.json())
app.use(cors())


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

    const db = client.db("mydatabase")
    const usersCollection = db.collection("users")

    app.post("/users" , async(req,res) => {
        try{
            const user = req.body;

        const res = await usersCollection.insertOne(user);
        res.json({
            mes : "successfully assigned",
            res
        })
    }catch(error){
        error
    }
        
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// username - uttamrohit4545_db_user
// password - HB993D7dpgvV78Bv