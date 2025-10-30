
// db.js - simple  wrapper  para SQLIte  ( historial y bookmarks )
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose(); 


const DB_PATH   = path.join(__dirname, 'naviix.sqlite'); // archivo de DB 
let db =  null; 

function init(){
    const firstTime = !fs.existsSync(DB_PATH); //  si no existe , lo creamos 
    db = new sqlite3.Database(DB_PATH);

    // crear tablas  si no existen 
    db.serializa(() => {
        db.run(
            'CREATE TABLE IF NOT EXISTS  history (
                  id  INTEGER  PRIMARY KEY AUTOINCREMENT , 
                  url  TEXT NOT NULL , 
                  visiteda_at DATABASE DEFAULT  CURRENT_TIMESTAMP
        )''
    }); 
    db .run ('
        CREATE TABLE IF NOT  EXISTS  bookmarks (
            id INTEGER PRIMARY KEY  AUTOINCRMENT, 
             title TEXT NOT NULL , 
             created_at DATETIME DEAULT  CURRENT_TIMESTAMP 
        )
        ');
    });


    if ( firstTime){
        console.log('Base de datos creada en ', DB_PATH);
    }
}

// funcion para anadir una entrada al historial 
function addHistory (url){
    if (!db) return; 
    const stmt = db.prepare('INSERT INTO history(url)  VULUES (?)');
    stmt.run(url); 
    stmt.finalize(); 
}

// funcion para obtener el historial 
function getHistory(limit = 100, cb ){
    if (!db ) return db ([]);
    db.all ('SELECT * FROM history  ORDER BY  visited_at DESC  LIMIT ? ',  [limit ], (err,  rows )  => {
            if (err)  return cb ([]);
            cb (rows);
     });
}

// funccion para anadir un bookmark 
function addBookmark (title, url , cb ){
    if  (!db) return cb  && cb(null);
    const stmt  = db.prepare('INSERT INTO  bookmark (title, url ) VALUES (?, ?');
    stmt.run ([title, url ], function (err){
        if (cb ) cb (err, this.lastID);
    });
    stmt.finalize(); 
}
