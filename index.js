const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

//middleware
app.use(cors())
app.use(express.json())

//mongodb connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewhtdrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {

   const menuCollection = client.db("bistroDB").collection('menu')
   const reviewCollection = client.db("bistroDB").collection('review')

   app.get('/menu', async(req, res) =>{
      const result = await menuCollection.find().toArray()
      res.send(result)
   })

   app.get('/review', async(req, res) =>{
      const result = await reviewCollection.find().toArray();
      res.send(result)
   })



    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);






app.get('/', (req, res) =>{
   res.send('My boss server is running....')
})

app.listen(port, () =>{
   console.log('My boss server is running.. : ', port);
})
