
// renderer.js  - ejecuta  en el  renderer (UI) . Usa navixAPI espuesto en preload.
const address = document.getElementById('address'); // input  de dirreciones 
const btnGo = document.getElementById('btn-go'); // boton IR
const btnNew = document.getElementById('btn-new'); // boton nueva ventana
const tabsDiv = document.getElementById('tabs'); // contenedor de pestañas

let tabs = [] ; // info local  de pestanas 

// funcion para renderizar las pestanas  de  la UI  
function renderTab(){
    tabsDiv.innerHTML = ''; // limpiar contenedor
    tabs.forEach(t => {
        const btn = document.createElement('button');
        
    })
}