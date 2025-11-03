
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
        btn.textContent = t.url.replace((/(^\w+:|^)\/\//, '').slice(0, 20); // mostrar URL corta
    btn.onclick = () => {
        window.navixAPI.switchTab(t.index); // pide al main  que cambie la pestana 
    };
     const  close = document.createElement('span');
     close.textContent = 'x';
     close.style.margineLeft = '6px';
     close.onclick = (e) => {
        e.stopPropagation(); // evitar disparar el onclick del boton
         window.navixAPI.closeTab(t.index);  //  pide cierre  de pestana 
         // actualizar  UI localmente  sera hecho  por evento  'tabs-changed enviado desde main 
     };
      btn.appendChild(close); 
      tabsDiv.appendChild(btn);
    });
}