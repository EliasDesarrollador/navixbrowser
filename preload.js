
// preload.js - se ejecuta antes que el renderer (interfaz) y expone una API segura.
const { contextBridge, ipcRenderer } = require('electron');

// Exponemos funciones seguras en el objeto global window.navixAPI
contextBridge.exposeInMainWorld('navixAPI', {

    // Crear una nueva pestaña en el proceso principal
    createTab: (url) => ipcRenderer.invoke('create-tab', url),

    // Cambiar a una pestaña existente por su índice
    switchTab: (index) => ipcRenderer.invoke('switch-tab', index),

    // Cerrar una pestaña específica
    closeTab: (index) => ipcRenderer.invoke('close-tab', index),

    // Navegar la pestaña activa a una nueva URL
    navigate: (url) => ipcRenderer.invoke('navigate', url),

    // Ir hacia atrás en la pestaña activa
    back: () => ipcRenderer.invoke('back'),

    // Ir hacia adelante en la pestaña activa
    forward: () => ipcRenderer.invoke('forward'),

    // Recargar la pestaña activa
    reload: () => ipcRenderer.invoke('reload'),

    // Obtener la lista de pestañas activas
    getTabs: () => ipcRenderer.invoke('get-tabs'),

    // Escuchar eventos que vienen desde el proceso principal (main.js)
    on: (channel, listener) => ipcRenderer.on(channel, (_, data) => listener(data))
});
