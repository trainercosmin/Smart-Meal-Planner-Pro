const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conectare la DB
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if(err) console.error(err.message);
  else console.log('Connected to SQLite database.');
});

// Creare tabel user dacă nu există
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// Înregistrare cont
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO users(username, password) VALUES(?, ?)`, [username, password], function(err){
    if(err) return res.status(400).json({error: err.message});
    res.json({success: true, id: this.lastID});
  });
});

// Login cont
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username=? AND password=?`, [username, password], (err, row) => {
    if(err) return res.status(500).json({error: err.message});
    if(row) res.json({success: true, user: row});
    else res.status(401).json({success: false, message: "Username sau parola incorectă"});
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
