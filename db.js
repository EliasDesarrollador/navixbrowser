
// db.js - Wrapper simple para SQLite (historial y bookmarks)

// Importamos módulos de Node
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Definimos la ruta de la base de datos
const DB_PATH = path.join(__dirname, 'navix.sqlite');
let db = null;

// Inicializa la base de datos
function init() {
  const firstTime = !fs.existsSync(DB_PATH); // Si no existe, la creamos
  db = new sqlite3.Database(DB_PATH);

  // Creamos las tablas si no existen
  db.serialize(() => {
    // Tabla del historial
    db.run(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de marcadores
    db.run(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  if (firstTime) {
    console.log('📂 Base de datos creada en:', DB_PATH);
  }
}

// Función para añadir una entrada al historial
function addHistory(url) {
  if (!db) return;
  const stmt = db.prepare('INSERT INTO history(url) VALUES (?)');
  stmt.run(url);
  stmt.finalize();
}

// Función para obtener el historial
function getHistory(limit = 100, cb) {
  if (!db) return cb([]);
  db.all(
    'SELECT * FROM history ORDER BY visited_at DESC LIMIT ?',
    [limit],
    (err, rows) => {
      if (err) return cb([]);
      cb(rows);
    }
  );
}

// Función para añadir un marcador
function addBookmark(title, url, cb) {
  if (!db) return cb && cb(null);
  const stmt = db.prepare('INSERT INTO bookmarks (title, url) VALUES (?, ?)');
  stmt.run([title, url], function (err) {
    if (cb) cb(err, this.lastID);
  });
  stmt.finalize();
}

// Función para obtener los marcadores
function getBookmarks(cb) {
  if (!db) return cb([]);
  db.all('SELECT * FROM bookmarks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return cb([]);
    cb(rows);
  });
}

// Exportamos las funciones
module.exports = {
  init,
  addHistory,
  getHistory,
  addBookmark,
  getBookmarks,
};
