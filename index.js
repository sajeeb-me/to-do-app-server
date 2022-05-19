const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ztqml.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("to-do-app").collection("tasks");

        app.get('/task', async (req, res) => {
            const email = req.query;
            const task = await taskCollection.find(email).toArray();
            res.send(task)
        })

        app.post('/task', async (req, res) => {
            const body = req.body;
            const task = await taskCollection.insertOne(body);
            res.send(task)
        })

        app.patch('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const time = req.body.time;
            console.log(time);
            const updateDoc = {
                $set: {
                    completed: true,
                    completedTime: time,
                }
            }
            const updatedTask = await taskCollection.updateOne(filter, updateDoc);
            res.send(updatedTask)
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result)
        })

    }
    catch (error) {
        console.error(error);
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello From TO DO!')
})

app.listen(port, () => {
    console.log(`To do is listening on port ${port}`)
})