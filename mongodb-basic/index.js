const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


    //find all users
    // app.get("/users", async(req,res) => {
    //   try{
    //     const users = await usersCollection.find().sort({age: -1,name: 1}).toArray();
    //     console.log(users)

    //     res.status(200).json({
    //       message : "Your user List is below",
    //       users
    //     })

    //   }catch(error){
    //     res.status(403).json({
    //       message:"Failed to fetch users",
    //       error
    //     })
    //   }
    // })

    //find single user by id
    app.get("/users/:id" , async(req,res) =>{
      try{
        const {id} = req.params;
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        if(!user){
          return res.status(404).json({
            message: "User not found"
          })
        }

        res.status(200).json({
          message : "successfully find user",
          user
        })


      }catch(error){
        res.status(403).json({
          message:"Failed to fetch this user , please try again",
          error
        })
      }
    })


    //find user by email
    app.get("/users/user/:email" , async(req,res) => {
      const {email} = req.params;

      try{
        const user = await usersCollection.find({email : email , age : { $gt : 19 }} , {projection: {name :1}}).toArray();
        res.json({
          message:"your user list in below",
          user
        })
      }catch(error){
        res.status(403).json({
          message:"Failed to fetch to users",
          error
        })
      }    

    })

    //update information to db
    app.patch("/update-user/:id" , async(req,res) => {
      const {id} = req.params;
      const userData = req.body;

      try{

        const filter = {_id : new ObjectId(id)}

        const updateInfo = {
          $set: {
            ...userData 
          }               
          }

        const options = {upsert : true} 
        
        const result = await usersCollection.updateOne(filter,updateInfo,options);
        res.json(result)

        }catch(error){
          res.status(403).json({
            message : "not successfully",
            error
          })
        }   
    })


    //update many document
    app.patch("/users/increase-age" , async(req,res) => {
      try{
        const result = await usersCollection.updateMany({},{$inc: {age : 2}})
        res.json(result)

      }catch(error){
        res.status(403).json({
          message : "not successfully",
          error
        })
      }
      
    })

    //delete user
    app.delete("/delete-user/:id" , async(req,res) => {
      const {id} = req.params;
      try{
        const deleteUser = await usersCollection.deleteOne({_id: new ObjectId(id)})
        res.json(deleteUser)

      }catch(error){
        res.status(404).json({
          message:"not successfull",
          error
        })
      }
    })


    // delete conditions
app.delete("/delete-user/status", async(req, res) => {
  const { status } = req.body;
  try {

    const result = await usersCollection.deleteMany({ status: status });

    res.json({
      message: "Deleted successfully",
      result
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Not successfully",
      error: error.message
    });
  }
});







    //comparison operator - $eq, $gt , $gte , $in , $lt, $lte,$ne , $ nin
    app.get("/users/older-than/:age",async(req,res)=>{
      const {age} = req.params

      try{
        const result = await usersCollection.find({ age : { $ne : parseInt(age)}}).toArray();
        res.json(result);
      }catch(error){
        send.json({
          message : "unsuccesfull"
        })

      }
    })



    //logical operator -$and , $or , $not , $nor
    app.get("/users/logical-operators/and",async(req,res) => {

      const users = await usersCollection.find({
        $and: [
          {age : {$gte : 27}},
          {age: {$lte: 30}}
        ]
      }).toArray();

      res.json(users)

    })
    //not operator practice
    app.get("/users/not-operators/and" ,async(req,res) => {

      const result = await usersCollection.find({
        age : { $not : { $gt : 27}}
      }).toArray();
      res.json(result);
    })
    //nor operator - mane eitao na abar eitao na
    app.get("/users/nor-operator" , async(req,res) => {

      const result = await usersCollection.find({
        $nor: [
          {age : { $gt : 29}},
          {name: "user 5"}
        ]
      }).toArray();
      res.json(result);
    })






//element operator - $exists , $type
app.get("/element-operators/with-status" , async(req,res) => {

   //extis-example
  // const result = await usersCollection.find({
  //   study : { $exists : false}
  // }).toArray();


  const result =await usersCollection.find({
    age : { $type : "string"}
  }).toArray();

  res.json(result)

})


// evaluation operator -$reges
app.get("/evaluation-operator/name-starts-a" ,async(req,res) => {
  const users = await usersCollection.find({
    name: {$regex : "^A" ,$options: 'i'}
  }).toArray();
  res.json(users)
} )


//arry operators -$all , $size
app.get("/array-operators/skills" , async(req,res) => {
  const users = await usersCollection.find({
    // skill : {$all : ["js","nodejs"]}
    skill : {$size : 3}
}).toArray();
res.json(users);
})

  //pagination (3 users per page)
  app.get("/users/page/:page" , async(req,res) => {
    const page = parseInt(req.params.page) || 1;

    const limit = 5
    const skip=(page - 1) * limit;
     

    //pagination formula
    // const users = await usersCollection.find().skip((page -1 *limit).limit(limit)). toArray();
    const users = await usersCollection.find().sort({age: -1}).skip(skip).limit(limit).toArray();
    res.json(users);
  })

  //find all users(using dynamic pagination)
  app.get("/users", async(req,res) => {
    try{
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
      const users  = await usersCollection.find().sort({age: -1}).skip(skip).limit(limit).toArray();
      const totalUsers = await usersCollection.countDocuments();
      res.json({users , totalUsers});

    }catch(error){
      res.status(400).json({
        message : "Failed",
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
  console.log(`Example app in listening on port ${port}`)
})

//uttamrohit4545
//10eNSeDhxpmCRVTv
