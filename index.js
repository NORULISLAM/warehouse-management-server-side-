const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqe8g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventroyCollection = client.db('inventory').collection('service');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = inventroyCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await inventroyCollection.findOne(query);
            res.send(service);
        });

        //POST
        app.post('/service', async (req, res) => {
            const newInventory = req.body;
            const result = await inventroyCollection.insertOne(newInventory);
            res.send(result);
        });

        //Delete
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventroyCollection.deleteOne(query);
            res.send(result);
        });

        //Update
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventroyCollection.findOne(query);
            res.send(result);
        });
        // update PUT
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: data.name,
                    email: data.email,
                    stock: data.stock
                }
            };
            const result = await inventroyCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        })

    }
    finally {

    }

}



run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Inventroy Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})