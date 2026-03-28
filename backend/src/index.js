const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'people_db',
});

// Helper: validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ─── GET /api/people ─────────────────────────────────────────────
// Get all people
app.get('/api/people', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM people ORDER BY full_name ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching people:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─── GET /api/people/:id ────────────────────────────────────────
// Get single person by id
app.get('/api/people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM people WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'PERSON_NOT_FOUND' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching person:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─── POST /api/people ───────────────────────────────────────────
// Create a new person
app.post('/api/people', async (req, res) => {
  try {
    const { full_name, email } = req.body;

    // Validation
    if (!full_name || full_name.trim() === '') {
      return res.status(400).json({ error: 'FULL_NAME_REQUIRED' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'EMAIL_REQUIRED' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'INVALID_EMAIL_FORMAT' });
    }

    // Check for duplicate email
    const existing = await pool.query('SELECT id FROM people WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'EMAIL_ALREADY_EXISTS' });
    }

    const result = await pool.query(
      'INSERT INTO people (full_name, email) VALUES ($1, $2) RETURNING *',
      [full_name.trim(), email.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating person:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─── PUT /api/people/:id ────────────────────────────────────────
// Update an existing person
app.put('/api/people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email } = req.body;

    // Check person exists
    const person = await pool.query('SELECT * FROM people WHERE id = $1', [id]);
    if (person.rows.length === 0) {
      return res.status(404).json({ error: 'PERSON_NOT_FOUND' });
    }

    // Validation
    if (!full_name || full_name.trim() === '') {
      return res.status(400).json({ error: 'FULL_NAME_REQUIRED' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'EMAIL_REQUIRED' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'INVALID_EMAIL_FORMAT' });
    }

    // Check for duplicate email (exclude current person)
    const existing = await pool.query(
      'SELECT id FROM people WHERE email = $1 AND id != $2',
      [email, id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'EMAIL_ALREADY_EXISTS' });
    }

    const result = await pool.query(
      'UPDATE people SET full_name = $1, email = $2 WHERE id = $3 RETURNING *',
      [full_name.trim(), email.trim(), id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating person:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// ─── DELETE /api/people/:id ─────────────────────────────────────
// Delete a person
app.delete('/api/people/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM people WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'PERSON_NOT_FOUND' });
    }

    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (err) {
    console.error('Error deleting person:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
