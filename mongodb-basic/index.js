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
    app.get("/users", async(req,res) => {
      try{
        const users = await usersCollection.find().toArray();
        console.log(users)

        res.status(200).json({
          message : "Your user List is below",
          users
        })

      }catch(error){
        res.status(403).json({
          message:"Failed to fetch users",
          error
        })
      }
    })

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
