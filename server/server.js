import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
let db = null;
let client = null;

// Initialize MongoDB connection if URI is provided
if (MONGODB_URI) {
  try {
    client = new MongoClient(MONGODB_URI);
    client.connect().then(() => {
      db = client.db('transformation-tree');
      console.log('Connected to MongoDB');
    }).catch(err => {
      console.error('MongoDB connection error:', err);
    });
  } catch (error) {
    console.error('Failed to initialize MongoDB:', error);
  }
}

// Fallback: File-based storage for local development
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'ornaments.json');

// Ensure data directory exists for local development
if (!MONGODB_URI && !fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!MONGODB_URI && !fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ ornaments: [] }, null, 2));
}

// Helper function to read ornaments (MongoDB or file)
async function readOrnaments() {
  if (db) {
    try {
      const collection = db.collection('ornaments');
      const doc = await collection.findOne({ _id: 'main' });
      return doc ? { ornaments: doc.ornaments || [] } : { ornaments: [] };
    } catch (error) {
      console.error('Error reading from MongoDB:', error);
      return { ornaments: [] };
    }
  } else {
    // Fallback to file storage
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading ornaments:', error);
      return { ornaments: [] };
    }
  }
}

// Helper function to write ornaments (MongoDB or file)
async function writeOrnaments(data) {
  if (db) {
    try {
      const collection = db.collection('ornaments');
      await collection.updateOne(
        { _id: 'main' },
        { $set: { ornaments: data.ornaments, updatedAt: new Date() } },
        { upsert: true }
      );
      return true;
    } catch (error) {
      console.error('Error writing to MongoDB:', error);
      return false;
    }
  } else {
    // Fallback to file storage
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing ornaments:', error);
      return false;
    }
  }
}

// GET all ornaments
app.get('/api/ornaments', async (req, res) => {
  try {
    const data = await readOrnaments();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ornaments' });
  }
});

// POST initialize ornaments (save all ornaments structure)
app.post('/api/ornaments/initialize', async (req, res) => {
  try {
    console.log('Initialize request received, body keys:', Object.keys(req.body || {}));
    
    const { ornaments } = req.body;

    if (!ornaments) {
      console.error('No ornaments in request body');
      return res.status(400).json({ error: 'Ornaments field is required' });
    }

    if (!Array.isArray(ornaments)) {
      console.error('Ornaments is not an array:', typeof ornaments);
      return res.status(400).json({ error: 'Ornaments must be an array' });
    }

    console.log(`Initializing ${ornaments.length} ornaments`);

    // Check if ornaments already exist
    const existingData = await readOrnaments();
    if (existingData.ornaments && existingData.ornaments.length > 0) {
      console.log(`Ornaments already exist (${existingData.ornaments.length}), skipping initialization`);
      return res.json({ 
        success: true, 
        count: existingData.ornaments.length,
        message: 'Ornaments already initialized, using existing data'
      });
    }

    // Validate ornaments have required fields
    const validOrnaments = ornaments.map((ornament, index) => ({
      id: ornament.id !== undefined ? ornament.id : index,
      text: typeof ornament.text === 'string' ? ornament.text : '',
      x: typeof ornament.x === 'number' ? ornament.x : 0,
      y: typeof ornament.y === 'number' ? ornament.y : 0,
      color: typeof ornament.color === 'string' ? ornament.color : '#ef4444'
    }));

    const data = { ornaments: validOrnaments };
    
    if (await writeOrnaments(data)) {
      console.log(`Successfully initialized ${validOrnaments.length} ornaments`);
      res.json({ success: true, count: validOrnaments.length });
    } else {
      console.error('Failed to write ornaments');
      res.status(500).json({ error: 'Failed to initialize ornaments' });
    }
  } catch (error) {
    console.error('Error in initialize endpoint:', error);
    res.status(500).json({ error: 'Failed to initialize ornaments', details: error.message });
  }
});

// POST update ornament text
app.post('/api/ornaments/:id', async (req, res) => {
  try {
    const ornamentId = parseInt(req.params.id);
    const { text } = req.body;

    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'Text must be a string' });
    }

    const data = await readOrnaments();
    const ornamentIndex = data.ornaments.findIndex(o => o.id === ornamentId);

    if (ornamentIndex === -1) {
      return res.status(404).json({ error: 'Ornament not found' });
    }

    data.ornaments[ornamentIndex].text = text;

    if (await writeOrnaments(data)) {
      res.json({ success: true, ornament: data.ornaments[ornamentIndex] });
    } else {
      res.status(500).json({ error: 'Failed to save ornament' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ornament' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    storage: db ? 'MongoDB' : 'File'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Storage: ${db ? 'MongoDB' : 'File-based (local development)'}`);
});
