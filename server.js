const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.hn6ma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("travelAgency");
      const bookingCollection = database.collection("booking");
      const serviceCollection = database.collection("service");

      //POST API for service
      app.post('/services', async(req, res)=>{
        const cursor = req.body;
        const result = await serviceCollection.insertOne(cursor);
        res.json(result);
      });
      //GET API for service
      app.get('/services', async(req, res)=>{
        const cursor = serviceCollection.find({});
        const result = await cursor.toArray();
        res.json(result)
      });
      app.get('/services/:id', async(req, res)=>{
        const id =req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await serviceCollection.findOne(query);
        res.json(result)
      });
      // POST API booking
      app.post('/bookings', async(req, res)=>{
        const cursor = req.body;
        const result = await bookingCollection.insertOne(cursor);
        res.json(result);
      })
      //GET API booking
      app.get('/bookings', async(req, res)=>{
        const cursor = bookingCollection.find({});
        const result = await cursor.toArray();
        res.json(result)
      });

      // DELETE booking list
      app.delete('/bookings/:id/:uid', async(req, res)=>{
        const id = req.params.id;
        const uid = req.params.uid;
        const query = {_id: ObjectId(id), userId:uid};
        const result = await bookingCollection.deleteOne(query);
        res.json(result);
      });
  
      
      //find single data form booking
      app.put('/bookings/:id/:uid', async(req, res)=>{
        const id = req.params.id;
        const uid = req.params.uid;
        const filter = {_id: ObjectId(id), userId:uid};
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            status: 'Approve'
          },
        };
        const result = await bookingCollection.updateOne(filter, updateDoc, options);
        res.json(result);
      });

      // UPDATE API for booking list

  
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

  
app.get('/', (req, res)=>{
    res.send('Assignment Number 11')
});

app.listen(port, ()=>{
    console.log('This server is running on', port);
})