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

   //single purpose aggregation - countDocuments , distinct
  // const salesDocument = await salesCollection.countDocuments();
  //  console.log("total document is:",salesDocument);

  //  const regionDistinct = await salesCollection.distinct("region")
  //   console.log(regionDistinct)



// basic pipeline stage - match, group,sort, project, limit
const result = await salesCollection.aggregate([
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        year: 2023
      }
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$region",
        totalSales: {
          $sum: "$amount"
        }
      }
  },
  {
    $sort:
      /**
       * Provide any number of field/order pairs.
       */
      {
        totalSales: -1
      }
  },
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        totalSales: 1,
        _id: 0
      }
  },
  {
    $limit:
      /**
       * Provide the number of documents to limit.
       */
      3
  }
]).toArray()


//advance stage lookup and unwind
const res1 = await salesCollection.aggregate([
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        year: 2023
      }
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$region",
        totalSales: {
          $sum: "$amount"
        }
      }
  },
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "regions",
        localField: "_id",
        foreignField: "regionId",
        as: "regionInfo"
      }
  }
]).toArray()





console.log(res1)





    
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