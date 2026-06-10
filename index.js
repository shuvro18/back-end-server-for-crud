const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://crud:b9MpKJoZtO63c1SW@cluster0.yi4lr2o.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("simpleCrud");
    const userCollection = database.collection("users");

    app.get("/users", async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    //Add a new user 
    app.post("/users", async(req, res)=>{
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result)
    })


    //get single user using id
    app.get("/users/:id", async(req, res, )=>{
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const user = await userCollection.findOne(query)
      console.log('user id ', id);
      res.send(user)
    })



    //Delete a single data by using id

    app.delete("/users/:id", async(req, res) => {
      const id = req.params.id ;
      const query = {
        _id: new ObjectId(id)
      }
      const user = await userCollection.deleteOne(query);
      res.send(user);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("crud server is serving");
});

app.listen(port, () => {
  console.log(`crud server is running on port ${port}`);
});
