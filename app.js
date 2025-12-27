const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const app = express();

// Membuat folder data jika belum ada untuk menyimpan database SQLite
const fs = require('fs');
if (!fs.existsSync('./data')) { fs.mkdirSync('./data'); }

const db = new Database('./data/eco.db');

// Inisialisasi Tabel Database
db.exec("CREATE TABLE IF NOT EXISTS electric_usage (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, kwh REAL)");

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    const history = db.prepare("SELECT * FROM electric_usage ORDER BY date DESC LIMIT 10").all();
    res.render('index', { history });
});

app.post('/add', (req, res) => {
    const { date, kwh } = req.body;
    db.prepare("INSERT INTO electric_usage (date, kwh) VALUES (?, ?)").run(date, kwh);
    res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Aplikasi berjalan di http://localhost:${PORT}`);
});