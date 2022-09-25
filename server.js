require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orz1c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// collection
const todoCollection = client.db("todo").collection("todoList");

async function run() {
    await client.connect();
    console.log('database connected...');

    // get todo
    app.get('/todo', async (req, res) => {
        const result = await todoCollection.find().toArray()
        res.send(result)
    })

    // post todo
    app.post('/todo', async (req, res) => {
        const {message, isDone} = req.body.todo
        const result = await todoCollection.insertOne({message, isDone})
        res.send(result)
    })

    // update todo
    app.put('/todo/:id', async (req, res) => {
        const { id } = req.params
        const complete = req.body.complete
        const filter = { _id: ObjectId(id) }
        const update = {
            $set: { isDone : complete }
        }
        const result = await todoCollection.updateOne(filter, update, { upsert: true })
        res.send(result)
    })

    // remove todo
    app.delete('/todo/:id', async (req, res) => {
        const { id } = req.params
        const filter = { _id: ObjectId(id) }
        const result = await todoCollection.deleteOne(filter)
        res.send(result)
    })






}

run().catch(console.dir)



app.get('/', (req, res) => {
    res.send({ message: 'tod server' })
})

app.listen(port, () => {
    console.log(`server is online on port ${port}...`);
})