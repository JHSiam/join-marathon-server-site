const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

//middle ware
//iamjhsiam
//0mwW4VeE24OcnDlF
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://iamjhsiam:0mwW4VeE24OcnDlF@cluster0.iyayy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db('MarathonDB');
        const UsersCollection = database.collection('MarathonCollection');
        const RegisterCollection = database.collection('RegisterCollection');

        app.get('/users', async (req, res) => {
            const cursor = UsersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/home-marathon', async (req, res) => {
            try {
                const result = await UsersCollection.find().limit(6).toArray();
                res.send(result);
            } catch (error) {
                console.error('Error fetching users:', error);
                res.status(500).send({ error: 'An error occurred while fetching users.' });
            }
        });
        
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await UsersCollection.findOne(query);
            res.send(result);
        })
        app.get('/marathons/:email', async (req, res) => {
            const email = req.params.email; // Get email from query parameters
            //console.log(email);
            
        
            if (!email) {
                return res.status(400).send({ error: 'Email is required' });
            }
        
            try {
                const cursor = UsersCollection.find({ email: email }); // Filter by userEmail
                const result = await cursor.toArray(); // Convert to array
                res.send(result); // Send the filtered result
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch campaigns' });
            }
        });

        app.get('/registrations/:email', async (req, res) => {
            const email = req.params.email; // Get email from route parameters
            const title = req.query.title; // Get optional title query parameter
        
            if (!email) {
                return res.status(400).send({ error: 'Email is required' });
            }
        
            try {
                const filter = { registerEmail: email };
        
                // If a title query is provided, add it to the filter
                if (title) {
                    filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
                }
        
                const cursor = RegisterCollection.find(filter); // Apply the filter
                const result = await cursor.toArray(); // Convert to array
                res.send(result); // Send the filtered result
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch registrations' });
            }
        });
        

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: req.body
            }

            const result = await UsersCollection.updateOne(filter, updatedDoc, options )

            res.send(result);
        })

        app.put('/registrations/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: req.body
            }

            const result = await RegisterCollection.updateOne(filter, updatedDoc, options )

            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user', user);
            const result = await UsersCollection.insertOne(user);
            res.send(result);

        })

        app.post('/registrations', async (req, res) => {
            const user = req.body;
            console.log('new user', user);
            const result = await RegisterCollection.insertOne(user);
            res.send(result);

        })

        app.delete('/users/:id', async (req, res) => {
            console.log('going to delete', req.params.id);
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await UsersCollection.deleteOne(query);
            res.send(result);
        })

        app.delete('/registrations/:id', async (req, res) => {
            console.log('going to delete', req.params.id);
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await RegisterCollection.deleteOne(query);
            res.send(result);
        })

        // app.patch('/users', async (req, res) => {
        //     const email = req.body.email;
        //     const filter = { email };
        //     const updatedDoc = {
        //         $set: {
        //             lastSignInTime: req.body?.lastSignInTime
        //         }
        //     }

        //     const result = await UsersCollection.updateOne(filter, updatedDoc);
        //     res.send(result);
        // })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('My first Server')
})

app.listen(port, () => {
    console.log(`Server is runnig on port: ${port}`);
})

//vercel login
//vercel --prod