import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import multer from 'multer';
import cors from 'cors';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'skincare.db');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER,
    gender TEXT,
    skin_type TEXT
  );

  CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT NOT NULL,
    image_path TEXT,
    acne_score INTEGER,
    dryness_score INTEGER,
    oiliness_score INTEGER,
    pigmentation_score INTEGER,
    wrinkle_score INTEGER,
    redness_score INTEGER,
    overall_condition TEXT,
    recommendations TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    suitable_for TEXT NOT NULL,
    description TEXT
  );
`);

// Insert some dummy products if empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare('INSERT INTO products (name, category, suitable_for, description) VALUES (?, ?, ?, ?)');
  insertProduct.run('Gentle Hydrating Cleanser', 'Cleanser', 'Dry, Sensitive', 'A mild, non-foaming cleanser that hydrates while removing dirt.');
  insertProduct.run('Salicylic Acid Acne Wash', 'Cleanser', 'Oily, Acne-Prone', 'Deep cleans pores and helps prevent breakouts.');
  insertProduct.run('Hyaluronic Acid Serum', 'Moisturizer', 'All', 'Plumps skin with intense hydration.');
  insertProduct.run('Oil-Free Mattifying Lotion', 'Moisturizer', 'Oily', 'Lightweight hydration without the shine.');
  insertProduct.run('Vitamin C Brightening Serum', 'Treatment', 'Pigmentation, Aging', 'Evens skin tone and boosts radiance.');
  insertProduct.run('Retinol Night Cream', 'Treatment', 'Aging, Wrinkles', 'Accelerates cell turnover for smoother skin.');
  insertProduct.run('Mineral Sunscreen SPF 50', 'Sunscreen', 'All', 'Broad-spectrum protection without irritation.');
}

// Setup Multer for image uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Serve uploaded images statically
app.use('/uploads', express.static(uploadDir));

// API Routes

// 1. User Management
app.post('/api/users/register', (req, res) => {
  const { name, email, age, gender, skin_type } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO users (name, email, age, gender, skin_type) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(name, email, age, gender, skin_type);
    res.json({ success: true, userId: info.lastInsertRowid });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/users/login', (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/users/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// 2. Image Upload and AI Analysis
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    const userId = req.body.userId || null; // UUID string from Supabase Auth
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = req.file.path;
    const imageBytes = fs.readFileSync(imagePath).toString('base64');
    const mimeType = req.file.mimetype;

    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    const ai = new GoogleGenAI({ apiKey });

    // Retry helper for transient 429 rate-limit errors with model fallback
    const callWithRetry = async (maxRetries = 5) => {
      const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
      
      for (const model of models) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            // Small initial delay to stagger requests and reduce 429s
            if (attempt > 0) {
              const delay = Math.pow(2, attempt) * 3000; // 3s, 6s, 12s, 24s, 48s
              console.warn(`Rate limited. Retrying with model ${model} in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
              await new Promise(r => setTimeout(r, delay));
            }
            
            const response = await ai.models.generateContent({
              model: model,
              contents: {
                parts: [
                  {
                    inlineData: {
                      data: imageBytes,
                      mimeType: mimeType
                    }
                  },
                  {
                    text: 'Analyze this facial image for skin conditions. Provide a score from 0 to 10 for each of the following: acne, dryness, oiliness, pigmentation, wrinkles, and redness (0 is none/perfect, 10 is severe). Also provide an overall condition summary and 3 specific skincare recommendations. Return the result as JSON.'
                  }
                ]
              },
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    acne_score: { type: Type.INTEGER, description: 'Score from 0 to 10' },
                    dryness_score: { type: Type.INTEGER, description: 'Score from 0 to 10' },
                    oiliness_score: { type: Type.INTEGER, description: 'Score from 0 to 10' },
                    pigmentation_score: { type: Type.INTEGER, description: 'Score from 0 to 10' },
                    wrinkle_score: { type: Type.INTEGER, description: 'Score from 0 to 10' },
                    redness_score: { type: Type.INTEGER, description: 'Score from 0 to 10' },
                    overall_condition: { type: Type.STRING, description: 'Brief summary of overall skin condition' },
                    recommendations: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'List of 3 specific skincare recommendations'
                    }
                  },
                  required: ['acne_score', 'dryness_score', 'oiliness_score', 'pigmentation_score', 'wrinkle_score', 'redness_score', 'overall_condition', 'recommendations']
                }
              }
            });
            console.log(`✅ Gemini API call succeeded with model: ${model}`);
            return response;
          } catch (err: any) {
            const status = err?.status || err?.httpStatusCode || err?.code;
            const isRateLimit = status === 429 || String(err?.message).includes('429') || String(err?.message).includes('Too Many Requests') || String(err?.message).includes('RESOURCE_EXHAUSTED');
            if (isRateLimit && attempt < maxRetries) {
              continue;
            }
            if (isRateLimit) {
              console.warn(`All retries exhausted for model ${model}, trying next model...`);
              break; // Try next model
            }
            throw err;
          }
        }
      }
      throw new Error('All models and retries exhausted. API quota exceeded.');
    };

    // Call Gemini with retry logic
    const response = await callWithRetry();

    const analysisResult = JSON.parse(response.text || '{}');

    // Save to local SQLite as a backup (primary save done by frontend to Supabase)
    try {
      const stmt = db.prepare(`
        INSERT INTO analyses 
        (user_id, date, image_path, acne_score, dryness_score, oiliness_score, pigmentation_score, wrinkle_score, redness_score, overall_condition, recommendations) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        userId || 0,
        new Date().toISOString(),
        `/uploads/${req.file!.filename}`,
        analysisResult.acne_score,
        analysisResult.dryness_score,
        analysisResult.oiliness_score,
        analysisResult.pigmentation_score,
        analysisResult.wrinkle_score,
        analysisResult.redness_score,
        analysisResult.overall_condition,
        JSON.stringify(analysisResult.recommendations)
      );
    } catch (sqliteErr) {
      console.warn('SQLite backup save failed (non-critical):', sqliteErr);
    }

    res.json({
      success: true,
      result: analysisResult,
      imageUrl: `/uploads/${req.file!.filename}`
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze image' });
  }
});

// 3. Get Analysis History
app.get('/api/users/:id/history', (req, res) => {
  try {
    const userId = req.params.id;
    const history = db.prepare(`
      SELECT * FROM analyses 
      WHERE user_id = ? 
      ORDER BY date DESC
    `).all(userId);

    const parsedHistory = history.map((record: any) => ({
      ...record,
      recommendations: JSON.parse(record.recommendations || '[]')
    }));

    res.json(parsedHistory);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get Product Recommendations based on skin type
app.get('/api/products/recommend', (req, res) => {
  const { skin_type } = req.query;
  let products;
  if (skin_type) {
    products = db.prepare('SELECT * FROM products WHERE suitable_for LIKE ? OR suitable_for = "All"').all(`%${skin_type}%`);
  } else {
    products = db.prepare('SELECT * FROM products').all();
  }
  res.json(products);
});





async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
