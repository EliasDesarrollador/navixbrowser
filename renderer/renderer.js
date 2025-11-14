
// renderer.js - ejecuta en el renderer (UI). Usa navixAPI expuesto en preload.
const address = document.getElementById('address'); // input de direcciones 
const btnGo = document.getElementById('btn-go'); // botón "Ir"
const btnNew = document.getElementById('btn-new'); // botón nueva pestaña
const btnBack = document.getElementById('btn-back'); // botón atrás
const btnForward = document.getElementById('btn-forward'); // botón adelante
const btnReload = document.getElementById('btn-reload'); // botón recargar
const tabsDiv = document.getElementById('tabs'); // contenedor de pestañas

let tabs = []; // info local de pestañas

// Renderiza las pestañas en la UI
function renderTabs() {
  tabsDiv.innerHTML = ''; // limpiar contenedor
  tabs.forEach(t => {
    const btn = document.createElement('button');
    btn.textContent = t.url.replace(/(^\w+:|^)\/\//, '').slice(0, 20); // mostrar URL corta

    // Cambiar pestaña al hacer clic
    btn.onclick = () => {
      window.navixAPI.switchTab(t.index);
    };

    // Botón de cerrar pestaña
    const close = document.createElement('span');
    close.textContent = ' x';
    close.style.marginLeft = '6px';
    close.onclick = (e) => {
      e.stopPropagation(); // evitar disparar el onclick del botón principal
      window.navixAPI.closeTab(t.index);
    };

    btn.appendChild(close);
    tabsDiv.appendChild(btn);
  });
}

// Crear nueva pestaña
async function newTab(url) {
  const actualUrl = url || 'https://www.google.com';
  await window.navixAPI.createTab(actualUrl);
  const list = await window.navixAPI.getTabs();
  tabs = list;
  renderTabs();
}

// Navegar a una URL
async function navigate() {
  const urlText = address.value.trim();
  if (!urlText) return;
  const url = urlText.match(/^https?:\/\//) ? urlText : `https://${urlText}`;
  await window.navixAPI.navigate(url);
}

// Ir hacia atrás
async function goBack() {
  await window.navixAPI.back();
}

// Ir hacia adelante
async function goForward() {
  await window.navixAPI.forward();
}

// Recargar la pestaña actual
async function reloadPage() {
  await window.navixAPI.reload();
}

// Eventos UI
btnGo.addEventListener('click', navigate);
address.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') navigate();
});
btnNew.addEventListener('click', () => newTab('https://www.google.com'));
btnBack.addEventListener('click', goBack);
btnForward.addEventListener('click', goForward);
btnReload.addEventListener('click', reloadPage);

// Escucha eventos desde el main
window.navixAPI.on('tab-changed', async () => {
  const list = await window.navixAPI.getTabs();
  tabs = list;
  renderTabs();
});

window.navixAPI.on('active-tab', (data) => {
  address.value = data.url || '';
});

window.navixAPI.on('tab-updated', async () => {
  const list = await window.navixAPI.getTabs();
  tabs = list;
  renderTabs();
});

// Al cargar la UI, obtener las pestañas
window.addEventListener('DOMContentLoaded', async () => {
  const list = await window.navixAPI.getTabs();
  tabs = list;
  renderTabs();
});
