import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit for large ornament arrays
app.use(express.static('public'));

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'ornaments.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ ornaments: [] }, null, 2));
}

// Helper function to read ornaments
function readOrnaments() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading ornaments:', error);
    return { ornaments: [] };
  }
}

// Helper function to write ornaments
function writeOrnaments(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing ornaments:', error);
    return false;
  }
}

// GET all ornaments
app.get('/api/ornaments', (req, res) => {
  try {
    const data = readOrnaments();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ornaments' });
  }
});

// POST initialize ornaments (save all ornaments structure)
// MUST come before /api/ornaments/:id to avoid route conflict
// Only initializes if no ornaments exist (prevents overwriting existing data)
app.post('/api/ornaments/initialize', (req, res) => {
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
    const existingData = readOrnaments();
    if (existingData.ornaments && existingData.ornaments.length > 0) {
      // Ornaments already exist, don't overwrite
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
    
    if (writeOrnaments(data)) {
      console.log(`Successfully initialized ${validOrnaments.length} ornaments`);
      res.json({ success: true, count: validOrnaments.length });
    } else {
      console.error('Failed to write ornaments to file');
      res.status(500).json({ error: 'Failed to initialize ornaments' });
    }
  } catch (error) {
    console.error('Error in initialize endpoint:', error);
    res.status(500).json({ error: 'Failed to initialize ornaments', details: error.message });
  }
});

// POST update ornament text
// MUST come after /api/ornaments/initialize to avoid route conflict
app.post('/api/ornaments/:id', (req, res) => {
  try {
    const ornamentId = parseInt(req.params.id);
    const { text } = req.body;

    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'Text must be a string' });
    }

    const data = readOrnaments();
    const ornamentIndex = data.ornaments.findIndex(o => o.id === ornamentId);

    if (ornamentIndex === -1) {
      return res.status(404).json({ error: 'Ornament not found' });
    }

    data.ornaments[ornamentIndex].text = text;

    if (writeOrnaments(data)) {
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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

