
// main.js  - Proceso principal de  Electron 
const { app, BrowserWindow, BrowserView, ipcMAin } = require('electron'); // Trae mdodulos de Electron
const path = require('path'); // Modulo para manejar rutas de archivos 
const DB =  require('./db') // Modulo para manejar sqlite

let mainWindow ; // Ventana principal
let views = []; //array de vistas (pestañas)
let activeIndex = 0 ; // indice de la vista activa

// Funcion para crear la ventana principal
function createWindow(){
    mainWindow = new BrowserWindow({
        width: 1200,  // ancho nicial
        height: 800, // alto inicial
        webPreferences{
            preload: path.join(__dirname, 'preload.js'), // carga preload.js  para exponer API segura
            contexIsolation: true , // Aisla contexto (seguridad)
            nodeIntegratio: false , // evita node en renderer (seguridad)
            sanbox: true // habilita sandbox (seguridad)
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'renderer','index.html')) // Carga la UI 
    // Cuando la ventana se cierra la app se cierra
    mainWindow.on ('closed', () => {
        mainWindow = null; // Limpia referencia a ventana
    });
}

// Creamos una nueva pestana usando BrowserView
function createTab(url = 'https://www.google.com'){
    const view = new BrowserView({
        webPreferences: {
            nodeIntegration: false, //seguridad
            contextIsolation: true, 
            sainbox: true
        }
    });
}