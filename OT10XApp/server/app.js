const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the OT10XApp folder
// Serve static files including the /files directory
app.use(express.static(path.join(__dirname, '../')));

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize an in-memory SQLite database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  // Create a sample users table
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

  // Insert sample data
  db.run("INSERT INTO users (name) VALUES ('Alice')");
  db.run("INSERT INTO users (name) VALUES ('Bob')");
  db.run("INSERT INTO users (name) VALUES ('Eve')");
});

// Vulnerable endpoint for demonstrating SQL Injection
app.get('/search', (req, res) => {
  const query = req.query.query;
  // WARNING: The following query is vulnerable to SQL Injection.
  const sql = `SELECT * FROM users WHERE name LIKE '%${query}%'`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.send(rows.length ? JSON.stringify(rows, null, 2) : 'No results found');
  });
});

// Optional: Route for the main index if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Insecure, plaintext authentication for demonstration
  // In a real application, credentials should be hashed and securely compared.
  if (username === 'admin' && password === 'password123') {
    res.send('Authentication successful!');
  } else {
    res.send('Authentication failed.');
  }
});

app.get('/update', (req, res) => {
  // Simulated update script that might be malicious
  res.send("console.log('Malicious update executed!'); document.body.style.backgroundColor = 'red';");
});

// Vulnerable SSRF endpoint
app.post('/proxy', async (req, res) => {
  const { url } = req.body;
  try {
      // WARNING: This call does not validate the URL, making it vulnerable to SSRF.
      const response = await axios.get(url);
      res.send(response.data);
  } catch (error) {
      res.status(500).send('Error fetching URL.');
  }
});

// New endpoint: /payload that returns HTML code
app.get('/payload', (req, res) => {
  res.send(`
    <div style="border: 2px dashed blue; padding: 10px; margin: 10px;">
      <h2>Injected HTML Content</h2>
      <p>This content is injected via the /payload endpoint.</p>
    </div>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
