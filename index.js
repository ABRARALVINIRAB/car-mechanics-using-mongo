const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors')
const objectId = require("mongodb").ObjectId;


const app = express()
const port = process.env.PORT || 4000
//middle ware for cors
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_pass}@cluster0.a6fks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//connect db


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//connect db
async function run() {
    try {
        await client.connect();
        console.log('db connect');
        const database = client.db('car-mechanic')
        const servicesCollection = database.collection('services')

        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit services', service);

            // const service = {
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        //get api
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        //get single service
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)

        })

        //delete api
        app.delete("/services/:id",async(req,res)=>{
            const id=req.params.id;
            const query={_id:objectId(id)}
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})