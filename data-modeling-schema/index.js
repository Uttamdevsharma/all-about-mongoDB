const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = 3000;

app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1
  }
});

let usersCollection;  // <-- এখানে ডিক্লেয়ার

async function run() {
  try {
    await client.connect();
    const db = client.db("data-modeling");
    usersCollection = db.collection("users");  // <-- এখানে অ্যাসাইন
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}
run();

// POST create user
app.post("/create-user", async (req, res) => {
  try {
    const result = await usersCollection.insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Insert failed" });
  }
});

// GET user by email
app.get("/users", async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email)
    if (!email) return res.status(400).json({ error: "Please provide email query parameter" });

    const user = await usersCollection.find({ email }).toArray();
    if (user.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
