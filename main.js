
// main.js  - Proceso principal de  Electron 
const { app, BrowserWindow, BrowserView, ipcMAin } = require('electron'); // Trae mdodulos de Electron
const path = require('path'); // Modulo para manejar rutas de archivos 
const DB =  require('./db'); // Modulo para manejar sqlite
const { title } = require('process');

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
    //Guarda metadatos de la pestana 
    views.push({view, url});

    // anade la vista a la ventana principal
    mainWindow.addBrowserView(view);

    // Fija la posicion  y tamaño del browser view debajo  de la barra de navegacion (y 40 px  de alto  para la barra )
    const [w,h] = mainWindow.getContentSize();
    view.setBounds({x: 0 , y: 40,  width: w, height: h -40});
    view.setAutoResize({width: true, height:true});

    // Carga la URL inicial 
    view.webContents.loadURL(url);
    
    // cuando cambia la url , avisamos al renderer y guardamos en historial
    view.webContents.on('did-navigate-in-page  ', (event, url) => {
        const idx = views.findIndex(v => v.view === view);
        if (idx !== -1 ){
            views[idx].url = newUrl;   // actualiza URL interna
            // notifica renderer con IPC 
            mainWindow.webContents.send('tab-updated', {index: idx, url:newURL});
            //guarda el historial en la DB 
            DB.addHistory(newURL);
        }
});

// cuando cambia titulo , notificaciones  al renderer para actualizar la pestana
view.webContents.on ('page-title-updated', (_, title) => {
    const idx = views.findIndex( v = >  v.view ===view);
    if (idx !==  -1 ){
        mainWindow.webContens.send('tab-updated', {index: idx, title});
    }
});

//activa la pestana creada 
switchTab(views.length -1);
return views.length -1 ; // devuelve el indice de la nueva pestana
}

// cambia a la pestana indicada por indice
function switchTab(index){
    if (index < 0 || index >= views.length) return; // indice invalido
    // primero escondemos todos los browserViews
    views.forEach((v , i ) => {
        mainWindow.removeBrowserView(v.view);
    });
}