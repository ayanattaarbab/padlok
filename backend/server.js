import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const port = process.env.PORT;
const url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize Database Connection gracefully
let db, collection;
const client = new MongoClient(url);

async function connectDB() {
    try { 
        await client.connect();
        db = client.db(dbName);
        collection = db.collection('passwords');
        console.log(`Connected successfully to database: ${dbName}`);
    } catch (error) {
        console.error('MongoDB Connection Failure:', error.message);
        process.exit(1); // Stop the server if the database isn't working
    }
}
connectDB();

// GET: Retrieve all passwords
app.get('/', async (req, res) => {
    try {
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch passwords' });
    }
});

// POST: Add a new password
app.post('/', async (req, res) => { 
    try {
        const passwordData = req.body;
        const result = await collection.insertOne(passwordData);
        res.status(201).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to save password' });
    }
});

// DELETE: Remove a password cleanly by explicit ID
app.delete('/', async (req, res) => { 
    try {
        const { id } = req.body;
        
        // Safety guard against empty filter objects deleting random rows
        if (!id) {
            return res.status(400).json({ success: false, error: 'No ID provided' });
        }

        const result = await collection.deleteOne({ id: id });
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete password' });
    }
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});