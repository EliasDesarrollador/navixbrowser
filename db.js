
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
    