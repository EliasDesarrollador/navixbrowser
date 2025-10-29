
// preload.js  - ejecutando  en contexto aislado  antes   que  el renderer

const { contextBridge, ipcRenderer }  = require ('electron ');


contextBridge.exposeInMainWorld  ('navigxAPI', {
    // crea una nueva pestana en main y devuelve  su indice 
    createTab: (url ) => ipcRenderer.invoke('create-tab', url ),
    // cambiar pestana 
    switchTab : (index ) => ipcRenderer.invoke ('create-tab', url ),
    // cambiar  pestana 
    closeeTab: (index) => ipcRenderer.invoke('close-tab',index) , 
    // navegar la pestana  activa  a una url 
    navigate: (url ) => ipcRenderer.invoke ('navigate', url ), 
    // pedir lista de pestanas
    getTabs: () => ipcRenderer.invoke('get-tab'), 
    //escuchar  eventos  enviados desde main (tab actualizada , active-tab , etc )
    on: (channel , listener)  => ipcRenderer.on(channel, (_, data)  =>  listener(data))
});