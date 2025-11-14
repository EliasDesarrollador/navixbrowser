// main.js - Proceso principal de Electron

const { app, BrowserWindow, BrowserView, ipcMain } = require('electron'); // módulos principales de Electron
const path = require('path'); // módulo para rutas de archivos
const DB = require('./db'); // módulo para manejar sqlite

let mainWindow; // Ventana principal
let views = []; // Array de pestañas
let activeIndex = 0; // Índice de pestaña activa

// 🔹 Función para crear la ventana principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // script intermedio
      contextIsolation: true, // aisla el contexto por seguridad
      nodeIntegration: false, // desactiva node en el renderer
      sandbox: true // habilita sandbox
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 🔹 Función para crear una nueva pestaña
function createTab(url = 'https://www.google.com') {
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Guarda metadatos de la pestaña
  views.push({ view, url });

  // Añade la vista a la ventana principal
  mainWindow.addBrowserView(view);

  // Define el tamaño y posición (40px reservados para barra superior)
  const [w, h] = mainWindow.getContentSize();
  view.setBounds({ x: 0, y: 40, width: w, height: h - 40 });
  view.setAutoResize({ width: true, height: true });

  // Carga la URL inicial
  view.webContents.loadURL(url);

  // Cuando cambia la URL
  view.webContents.on('did-navigate-in-page', (event, newURL) => {
    const idx = views.findIndex(v => v.view === view);
    if (idx !== -1) {
      views[idx].url = newURL;
      mainWindow.webContents.send('tab-updated', { index: idx, url: newURL });
      DB.addHistory(newURL);
    }
  });

  // Cuando cambia el título
  view.webContents.on('page-title-updated', (_, title) => {
    const idx = views.findIndex(v => v.view === view);
    if (idx !== -1) {
      mainWindow.webContents.send('tab-updated', { index: idx, title });
    }
  });

  // Activa la nueva pestaña
  switchTab(views.length - 1);
  return views.length - 1;
}

// 🔹 Cambia a la pestaña indicada
function switchTab(index) {
  if (index < 0 || index >= views.length) return;

  // Oculta todas las vistas
  views.forEach(v => {
    mainWindow.removeBrowserView(v.view);
  });

  // Muestra solo la activa
  const active = views[index].view;
  mainWindow.addBrowserView(active);
  const [w, h] = mainWindow.getContentSize();
  active.setBounds({ x: 0, y: 40, width: w, height: h - 40 });
  active.setAutoResize({ width: true, height: true });

  activeIndex = index;
  mainWindow.webContents.send('active-tab', { index: activeIndex, url: views[index].url });
}

// 🔹 Cierra una pestaña
function closeTab(index) {
  if (index < 0 || index >= views.length) return;

  const item = views[index];
  mainWindow.removeBrowserView(item.view);
  item.view.webContents.destroy();
  views.splice(index, 1);

  if (views.length === 0) {
    activeIndex = -1;
  } else {
    const next = Math.max(0, index - 1);
    switchTab(next);
  }

  mainWindow.webContents.send('tab-changed', { count: views.length });
}

// 🔹 IPC Handlers (mensajes desde el renderer)
ipcMain.handle('create-tab', (_, url) => createTab(url));
ipcMain.handle('switch-tab', (_, index) => switchTab(index));
ipcMain.handle('close-tab', (_, index) => closeTab(index));
ipcMain.handle('navigate', (_, url) => {
  if (activeIndex >= 0 && activeIndex < views.length) {
    views[activeIndex].view.webContents.loadURL(url);
    return true;
  }
  return false;
});
ipcMain.handle('get-tabs', () => {
  return views.map((v, i) => ({ index: i, url: v.url }));
});

// 🔹 Navegación: atrás, adelante, recargar
ipcMain.handle('back', () => {
  if (activeIndex >= 0 && activeIndex < views.length) {
    views[activeIndex].view.webContents.goBack();
  }
});

ipcMain.handle('forward', () => {
  if (activeIndex >= 0 && activeIndex < views.length) {
    views[activeIndex].view.webContents.goForward();
  }
});

ipcMain.handle('reload', () => {
  if (activeIndex >= 0 && activeIndex < views.length) {
    views[activeIndex].view.webContents.reload();
  }
});


// 🔹 Inicializa app
app.whenReady().then(() => {
  DB.init();
  createWindow();
  createTab('https://www.google.com');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 🔹 Salida de la app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
