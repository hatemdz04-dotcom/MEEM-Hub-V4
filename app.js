const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  try { tg.setHeaderColor("#f4f9fd"); tg.setBackgroundColor("#f4f9fd"); } catch(e) {}
}

const modules = [
  {name:"Thermodynamique", desc:"Chaleur · Cycle · Entropie", progress:"3/5", pct:60, color:"blue", icon:"⚙️"},
  {name:"Transfert de chaleur", desc:"Conduction · Convection · Rayonnement", progress:"2/5", pct:40, color:"yellow", icon:"♨️"},
  {name:"Énergétique", desc:"Cycles · Production · Renouvelables", progress:"4/5", pct:80, color:"green", icon:"🌿"},
  {name:"Mécanique des solides", desc:"RDM · Résistance · Statique", progress:"1/5", pct:20, color:"purple", icon:"⚙️"},
  {name:"Maintenance", desc:"Préventive · Corrective · Fiabilité", progress:"3/5", pct:60, color:"teal", icon:"🔧"},
  {name:"Machines tournantes", desc:"Paliers · Vibrations · Alignement", progress:"2/5", pct:40, color:"pink", icon:"✣"}
];

const files = [
  {name:"Cours - Thermodynamique.pdf", type:"Cours", size:"2.4 Mo", date:"Aujourd'hui", icon:"📕"},
  {name:"Exercice_TD_Transfert.pdf", type:"TD", size:"1.8 Mo", date:"Hier", icon:"📝"},
  {name:"TP_Transfert_Chaleur.pdf", type:"TP", size:"3.1 Mo", date:"12 avr.", icon:"🧪"},
  {name:"Sujet_Examen_2019.pdf", type:"Examens", size:"3.2 Mo", date:"12 avr.", icon:"📕"},
  {name:"Correction_Examen_2023.pdf", type:"Examens", size:"2.1 Mo", date:"10 avr.", icon:"📋"},
  {name:"CoolPack_guide.pdf", type:"Outils", size:"5.6 Mo", date:"10 avr.", icon:"⚙️"}
];

function moduleCard(m) {
  return `<article class="module-card ${m.color}">
    <header><h3>${m.icon} ${m.name}</h3><b>›</b></header>
    <p>${m.desc}</p>
    <small>${m.progress}</small>
    <span class="progress"><i style="width:${m.pct}%"></i></span>
  </article>`;
}

function renderModules() {
  document.querySelector("#homeModules").innerHTML = modules.slice(0,6).map(moduleCard).join("");
  document.querySelector("#allModules").innerHTML = modules.map(moduleCard).join("");
}

function renderFiles(filter="Tous", query="") {
  const q = query.trim().toLowerCase();
  const list = files.filter(f => (filter==="Tous" || f.type===filter) &&
    (!q || `${f.name} ${f.type}`.toLowerCase().includes(q)));
  document.querySelector("#libraryGrid").innerHTML = list.length ? list.map(f =>
    `<article class="file-card"><div class="file-icon">${f.icon}</div><h3>${f.name}</h3><p>${f.size} · ${f.date}</p></article>`
  ).join("") : `<div class="empty-state" style="grid-column:1/-1;padding:40px">🔎<p>Aucun fichier trouvé.</p></div>`;
}

function showView(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active-view"));
  const target = document.querySelector(`#view-${view}`) || document.querySelector("#view-home");
  target.classList.add("active-view");
  document.querySelectorAll("[data-view]").forEach(b => b.classList.toggle("active", b.dataset.view===view));
  window.scrollTo({top:0, behavior:"smooth"});
  if (tg) tg.BackButton[view==="home" ? "hide" : "show"]();
}

document.addEventListener("click", e => {
  const nav = e.target.closest("[data-view]");
  if (nav) showView(nav.dataset.view);

  const filterBtn = e.target.closest("[data-filter]");
  if (filterBtn) {
    showView("library");
    document.querySelectorAll("#libraryFilters button").forEach(b => b.classList.toggle("active", b.dataset.filter===filterBtn.dataset.filter));
    renderFiles(filterBtn.dataset.filter);
  }
});

document.querySelector("#libraryFilters").addEventListener("click", e => {
  const b = e.target.closest("button[data-filter]");
  if (!b) return;
  document.querySelectorAll("#libraryFilters button").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  renderFiles(b.dataset.filter, document.querySelector("#librarySearch").value);
});

document.querySelector("#librarySearch").addEventListener("input", e => {
  const active = document.querySelector("#libraryFilters button.active")?.dataset.filter || "Tous";
  renderFiles(active, e.target.value);
});

if (tg) tg.BackButton.onClick(() => showView("home"));

const user = tg?.initDataUnsafe?.user;
if (user) {
  const name = user.first_name || "Étudiant";
  ["userName","profileName","rightName"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = name;
  });
}

function renderCalendar() {
  const days = Array.from({length:35},(_,i)=>i<2 ? "" : i-1);
  document.querySelector("#calendarGrid").innerHTML = days.map(d => `<span class="${[3,9,14,19,25].includes(d)?'event':''}">${d}</span>`).join("");
}

renderModules();
renderFiles();
renderCalendar();
