const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON in requests


const uri = `mongodb+srv://marriottResort:${process.env.DB_PASS}@cluster0.sju0f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server
    await client.connect();
    const db = client.db("marriottResort");
    
    // Get the collections
    const hotelData = db.collection("hotelData");
    const usersDataCollection = db.collection("users");
    const AllHotelListCollection = db.collection("hotelList");
    const earningListCollection = db.collection("earningList");
    const PropertyDataCollection = db.collection("propertyData");

    // Route to fetch hotel data
    app.get('/hotel-data', async (req, res) => {
      try {
        const result = await hotelData.find().toArray();
        res.json(result);
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Route to fetch hotel data
    app.get('/users', async (req, res) => {
      try {
        const result = await usersDataCollection.find().toArray();
        res.json(result);
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Route to fetch hotel list data
    app.get('/hotels-list', async (req, res) => {
      try {
        const result = await AllHotelListCollection.find().toArray();
        res.json(result);
      } catch (error) {
        console.error('Error fetching hotel list data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Route to insert new hotel list data
    app.post('/hotels-list', async (req, res) => {
      try {
        const newItem = req.body;
        const result = await AllHotelListCollection.insertOne(newItem);
        res.json(result);
      } catch (error) {
        console.error('Error inserting into hotel list data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Route to fetch earning list data
    app.get('/all-earnings', async (req, res) => {
      try {
        const result = await earningListCollection.find().toArray();
        res.json(result);
      } catch (error) {
        console.error('Error fetching earning list data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Route to insert new earnings data
    app.post('/all-earnings', async (req, res) => {
      try {
        const newItem = req.body;
        const result = await earningListCollection.insertOne(newItem);
        res.json(result);
      } catch (error) {
        console.error('Error inserting into hotel list data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });


    // Add this route to handle receiving add-property data
app.post('/add-property', async (req, res) => {
  try {
    const propertyData = req.body; // Extract property data from request body
    if (!propertyData || !propertyData.name || !propertyData.description || !propertyData.location || !propertyData.image) {
      return res.status(400).json({ error: 'Invalid property data' });
    }

    // Insert property data into the hotel list collection
    const result = await PropertyDataCollection.insertOne(propertyData);

    // Respond with the result
    res.status(201).json({
      message: 'Property added successfully',
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Start the server after setting up routes and connecting to MongoDB
    app.listen(port, () => {
      console.log(`Marriott Resort server is running on Port ${port}`);
    });
  } catch (error) {
    console.error('Error running the server:', error);
  }
}

run().catch(console.dir);

// Route for health check
app.get('/', (req, res) => {
  res.send('Marriott Resort Server is running');
});