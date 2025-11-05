
// preload.js - se ejecuta antes que el renderer, con contexto aislado (sandbox)
const { contextBridge, ipcRenderer } = require('electron'); 
// ❗ Había un espacio extra después de 'electron ' en tu código original

contextBridge.exposeInMainWorld('navixAPI', {
    // Crear una nueva pestaña en el proceso principal
    createTab: (url) => ipcRenderer.invoke('create-tab', url),

    // Cambiar a una pestaña existente por su índice
    switchTab: (index) => ipcRenderer.invoke('switch-tab', index),
    // ❗ En tu código decía 'create-tab' y usaba 'url', debía ser 'switch-tab' y 'index'

    // Cerrar una pestaña específica
    closeTab: (index) => ipcRenderer.invoke('close-tab', index),
    // ❗ Habías puesto 'closeeTab', se cambió a 'closeTab' (coherencia con renderer.js)

    // Navegar la pestaña activa a una nueva URL
    navigate: (url) => ipcRenderer.invoke('navigate', url),

    // Obtener la lista completa de pestañas
    getTabs: () => ipcRenderer.invoke('get-tabs'),
    // ❗ Tu código decía 'get-tab' (en singular), debe ser 'get-tabs' si devolvés un array

    // Escuchar eventos enviados desde el proceso principal
    on: (channel, listener) => ipcRenderer.on(channel, (_, data) => listener(data))
});
