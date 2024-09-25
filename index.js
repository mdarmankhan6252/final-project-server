const express = require('express');
const app = express()
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

   const userCollection = client.db("bistroDB").collection('users')
   const menuCollection = client.db("bistroDB").collection('menu')
   const reviewCollection = client.db("bistroDB").collection('review')
   const cartCollection = client.db("bistroDB").collection('cart')

   //users related api.
   app.post('/users', async(req, res) =>{
      const user = req.body;
      //insert email if user doesn't exists:
      const query = {email: user.email}
      const existingUser = await userCollection.findOne(query)
      if(existingUser){
         return res.send({message: 'User already exists', insertedId: null})
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
   })

   app.get('/users', async(req, res) =>{
      const result = await userCollection.find().toArray();
      res.send(result)
   })

   app.patch('/users/admin/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const updatedDoc = {
         $set:{
            role:"admin"
         }
      }
      const result = await userCollection.updateOne(filter, updatedDoc)
      res.send(result)
   })

   app.delete('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
   })

   //menu related api.

   app.get('/menu', async(req, res) =>{
      const result = await menuCollection.find().toArray()
      res.send(result)
   })

   app.get('/review', async(req, res) =>{
      const result = await reviewCollection.find().toArray();
      res.send(result)
   })

   //cart collection 
   app.post('/carts', async(req, res) =>{
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem)
      res.send(result)
   })
   app.get('/carts', async(req, res) =>{
      const email = req.query.email;
      const query = {email : email}
      const result = await cartCollection.find(query).toArray()
      res.send(result)
   })

   app.delete('/carts/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result =await cartCollection.deleteOne(query)
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
