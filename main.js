
// main.js  - Proceso principal de  Electron 
const { app, BrowserWindow, BrowserView, ipcMAin } = require('electron'); // Trae mdodulos de Electron
const path = require('path'); // Modulo para manejar rutas de archivos 
const DB =  require('./db') // Modulo para manejar sqlite

let mainWindow ; // Ventana principal
let views = []; //array de vistas (pestañas)
let activeIndex = 0 ; // indice de la vista activa
