
// renderer.js  - ejecuta  en el  renderer (UI) . Usa navixAPI espuesto en preload.
const address = document.getElementById('address'); // input  de dirreciones 
const btnGo = document.getElementById('btn-go'); // boton IR
const btnNew = document.getElementById('btn-new'); // boton nueva ventana
const tabsDiv = document.getElementById('tabs'); // contenedor de pestañas

let tabs = [] ; // info local  de pestanas 

// funcion para renderizar las pestanas  de  la UI  
function renderTabs(){
    tabsDiv.innerHTML = ''; // limpiar contenedor
    tabs.forEach(t => {
        const btn = document.createElement('button');
        btn.textContent = t.url.replace(/(^\w+:|^)\/\//, '').slice(0, 20) ;  // mostrar URL corta
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

 // crear nueva pestana  con la URL  del input  o con google  si esta  vacia 
 async function  newTab(url) {
    const actualUrl = url || 'htpps://www.googe.com';
    const index = await  window.navixAPI.createTab(actualUrl); //crea pestana en main y devuelve indice
    // Luego pedimos  la lista  de pestanas  para sincronizar UI
    const list = await window.navixAPI.getTabs();
    tabs = list;
    renderTabs(); 
 }

 //navegacion al presionar Enter o boton ir 
  async function  navigate() {
    const urlText = address.value.trim();
    if (!urlText) return ;
    // si el texto no tiene esquema , asumimos https
    const url = urlText.match(/^https?:\/\//) ? urlText : `https://${urlText}`;
    await window.navixAPI.navigate(url); // pide al main  navegar la pestana  activa 
  }

// eventos UI 
btnGo.addEventListener('click', navigate);
address.addEventListener('keydown',  (e) => {
    if (e.key === 'Enter') navigate();
});

btn.New.addEventListener('click', () => newTab('https://www.google.com'));

// escucha  eventos  desde main para  sincronizar  UI 
window.navixAPI.on('tabs-changed', (data) =>  {
    // simple  re-sincronizacion
    window.navixAPI.getTabs().then (list => {
        tabs = list; 
        renderTabs(); 
    });
});