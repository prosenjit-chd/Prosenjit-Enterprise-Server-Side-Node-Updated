const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ocrjv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('prosenjit-app');
        const bikesCollection = database.collection('bikes');
        const ordersCollection = database.collection('orders');
        const reviewCollection = database.collection('review');
        const usersCollection = database.collection('users');

        // GET All Bike API
        app.get('/bikescollection', async (req, res) => {
            const cursor = bikesCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let bikes = [];
            const count = await cursor.count();
            if (page) {
                bikes = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                bikes = await cursor.toArray();
            }
            res.send({
                count,
                bikes
            });
        })

        // GET Single Bike API
        app.get('/bikescollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const bike = await bikesCollection.findOne(query);
            res.send(bike);
        })

        //POST Add Bike Admin API 
        app.post('/bikescollection', async (req, res) => {
            const newBikeadd = req.body;
            const result = await bikesCollection.insertOne(newBikeadd);
            res.json(result);
        })


        // POST Single Order data by user == 4
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            res.json(result);
        })

        // Order ===3
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            orderN = await cursor.toArray();
            res.send(orderN);
        })

        // DELETE Order==2
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        // Order UPDATE API==1
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upset: true };
            const updateDoc = {
                $set: {
                    status: updateOrder.status
                },
            }
            const result = await ordersCollection.updateOne(filter, updateDoc, options);
            // console.log(result);
            res.json(result);
        })

        // Single Review post data by user 
        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.json(result);
        })

        // Get Single Review data by user 
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let review = [];
            const count = await cursor.count();
            if (page) {
                review = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                review = await cursor.toArray();
            }
            res.send({
                count,
                review
            });
        })


        // DELETE Main Bike Component
        app.delete('/bikescollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikesCollection.deleteOne(query);
            res.json(result);
        })


        // Admin 
        // user get api
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // user Post Api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result);
        });

        // user Put Api
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // User Admin Put Api
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Prosenjit App Server is running successfully');
});

app.get('/test', (req, res) => {
    res.send('Prosenjit App Server is ok');
});

app.listen(port, () => {
    console.log('server is up and running at', port);
})