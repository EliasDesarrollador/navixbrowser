
// preload.js - se ejecuta antes que el renderer, con contexto aislado (sandbox)
const { contextBridge, ipcRenderer } = require('electron'); 

contextBridge.exposeInMainWorld('navixAPI', {
    // Crear una nueva pestaña en el proceso principal
    createTab: (url) => ipcRenderer.invoke('create-tab', url),

    // Cambiar a una pestaña existente por su índice
    switchTab: (index) => ipcRenderer.invoke('switch-tab', index),

    // Cerrar una pestaña específica
    closeTab: (index) => ipcRenderer.invoke('close-tab', index),

    // Navegar la pestaña activa a una nueva URL
    navigate: (url) => ipcRenderer.invoke('navigate', url),

    // Obtener la lista completa de pestañas
    getTabs: () => ipcRenderer.invoke('get-tabs'),

    // Escuchar eventos enviados desde el proceso principal
    on: (channel, listener) => ipcRenderer.on(channel, (_, data) => listener(data))
});
