(() => {
  "use strict";

  // Mobile nav (one source of truth)
  const burger = document.getElementById("burger");
  const mobileNav = document.getElementById("mobileNav");
  const setMenu = (open) => {
  if (!burger || !mobileNav) return;
  const isOpen = !!open;
  burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  mobileNav.setAttribute("aria-hidden", isOpen ? "false" : "true");
  mobileNav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
};
  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      const isOpen = burger.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });
    mobileNav.addEventListener("click", (e) => {
      if (e.target && e.target.closest && e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) setMenu(false);
    });
  }

  // Mark JS enabled (used by CSS for reveal fallback / no-js)
  document.documentElement.classList.add("js");
  document.documentElement.classList.remove("no-js");

  // ====== CONFIG ======
  const LINKS = {
    phone: "tel:+79255156161",
    tgUser: "vremonte761",
    tg: "https://t.me/vremonte761",
    vk: "https://vk.com/vremonte161",
    max: "https://max.ru/u/f9LHodD0cOIcyLKszOi0I1wOwGuyOltplh3obPyqkL7_jwUK6DRgug2lKI8",
  };

  // ====== Helpers ======
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function escHtml(s){
    return String(s || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/\"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  async function copyToClipboard(text){
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch(_){
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand("copy"); }catch(_2){}
      ta.remove();
      return true;
    }
  }

  function openTelegramWithText(text){
    const url = `${LINKS.tg}?text=${encodeURIComponent(text || "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }
  async function openVKWithText(text){
    // VK не всегда поддерживает автоподстановку текста — копируем в буфер и открываем чат/сообщество
    if (text) await copyToClipboard(text);
    window.open(LINKS.vk, "_blank", "noopener,noreferrer");
  }
  async function openMaxWithText(text){
    if (text) await copyToClipboard(text);
    window.open(LINKS.max, "_blank", "noopener,noreferrer");
  }

  // ====== Year in footer ======
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // ====== Smooth anchors ======
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior:"smooth", block:"start" });
    setMenu(false);
  });


  // Issue quick chips (fills nearest "Проблема" input)
  document.addEventListener("click", (e)=>{
    const chip = e.target.closest("[data-issue]");
    if (!chip) return;
    const val = chip.getAttribute("data-issue") || chip.textContent.trim();
    // Prefer focused input, otherwise try common ids
    const active = document.activeElement;
    const candidates = [
      active && active.tagName === "INPUT" ? active : null,
      $("#quickIssue"),
      $("#leadProblem"),
      $("#mIssue")
    ].filter(Boolean);
    const input = candidates.find(i=> i && i instanceof HTMLInputElement);
    if (input){
      input.value = val;
      input.dispatchEvent(new Event("input", {bubbles:true}));
      input.focus();
    }
  });
  // ====== Reveal animation (safe) ======
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add("in"); });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }else{
    revealEls.forEach(el => el.classList.add("in"));
  }

  // ====== FAQ accordion ======
  const faq = $("#faqList");
  if (faq){
    faq.addEventListener("click", (e) => {
      const btn = e.target.closest(".qa__q");
      if (!btn) return;
      const box = btn.closest(".qa");
      if (!box) return;
      box.classList.toggle("open");
    });
  }

  // ====== UI Modal (create if missing) ======
  function ensureUiModal(){
    let uiModal = $("#uiModal");
    let uiModalContent = $("#uiModalContent");
    if (uiModal && uiModalContent) return { uiModal, uiModalContent };

    uiModal = document.createElement("div");
    uiModal.id = "uiModal";
    uiModal.className = "uimodal";
    uiModal.setAttribute("aria-hidden","true");
    uiModal.innerHTML = `
      <div class="uimodal__backdrop" data-close="1"></div>
      <div class="uimodal__panel" role="dialog" aria-modal="true">
        <button class="uimodal__close" type="button" data-close="1" aria-label="Закрыть">✕</button>
        <div id="uiModalContent"></div>
      </div>`;
    document.body.appendChild(uiModal);
    uiModalContent = $("#uiModalContent");
    return { uiModal, uiModalContent };
  }

  function openUiModal(html){
    const { uiModal, uiModalContent } = ensureUiModal();
    uiModalContent.innerHTML = html;
    uiModal.classList.add("open");
    uiModal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
  }
  function closeUiModal(){
    const uiModal = $("#uiModal");
    if (!uiModal) return;
    uiModal.classList.remove("open");
    uiModal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
  }

  // close handlers
  document.addEventListener("click", (e)=>{
    const uiModal = $("#uiModal");
    if (!uiModal || !uiModal.classList.contains("open")) return;
    const t = e.target;
    if (t && t.dataset && t.dataset.close === "1") closeUiModal();
  });
  document.addEventListener("keydown", (e)=>{
    const uiModal = $("#uiModal");
    if (e.key === "Escape" && uiModal && uiModal.classList.contains("open")) closeUiModal();
  });

  // Открытие картинок (сертификаты/логотипы) в модалке
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest?.("[data-modal-img]");
    if (!btn) return;
    const src = btn.getAttribute("data-modal-img");
    const title = btn.getAttribute("data-modal-title") || "";
    if (!src) return;
    openUiModal(`
      <div class="uimodal__title">${title}</div>
      <div class="uimodal__imgwrap">
        <img src="${src}" alt="${title}" loading="lazy" />
      </div>
    `);
  });

  // ====== Lead message builder ======
  function buildLeadMessage(formEl, extra){
    const getVal = (nameOrId) => {
      if (!formEl) return "";
      const byId = formEl.querySelector(`#${nameOrId}`);
      if (byId && "value" in byId) return String(byId.value || "").trim();
      const byName = formEl.querySelector(`[name="${nameOrId}"]`);
      if (byName && "value" in byName) return String(byName.value || "").trim();
      return "";
    };

    const device = getVal("device");
    const problem = getVal("issue");
    const urgencyEl = formEl.querySelector('[name="urgent"]');
    const urgency = urgencyEl ? String(urgencyEl.value || "").trim() : "";
    const contact = getVal("contact");

    const parts = [];
    parts.push("Здравствуйте! Заявка с сайта «В ремонте».");
    if (device) parts.push(`Устройство: ${device}`);
    if (problem) parts.push(`Проблема: ${problem}`);
    if (urgency) parts.push(`Срочность: ${urgency}`);
    if (contact) parts.push(`Контакт: ${contact}`);
    if (extra) parts.push(extra);
    parts.push("");
    parts.push("Отправлено с сайта vremonte61.online");
    return parts.join("\n");
  }

  function ensureLeadValid(formEl){
    if (!formEl) return false;
    const dev = (formEl.querySelector('[name="device"]')?.value || "").trim();
    const iss = (formEl.querySelector('[name="issue"]')?.value || "").trim();
    if (!dev || !iss){
      alert("Заполни, пожалуйста: Устройство и Проблема.");
      return false;
    }
    return true;
  }

  // Lead form actions
  const leadForm = $("#leadForm");
  if (leadForm){
    leadForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      if (!ensureLeadValid(leadForm)) return;
      openVKWithText(buildLeadMessage(leadForm));
    });
  }
  const leadForm2 = $("#leadForm2");
  if (leadForm2){
    leadForm2.addEventListener("submit",(e)=>{
      e.preventDefault();
      if (!ensureLeadValid(leadForm2)) return;
      openVKWithText(buildLeadMessage(leadForm2));
    });
  }
  $("#sendTg")?.addEventListener("click", ()=> { if (!ensureLeadValid(leadForm)) return; openTelegramWithText(buildLeadMessage(leadForm)); });
  $("#sendVk")?.addEventListener("click", async ()=> { if (!ensureLeadValid(leadForm)) return; await openVKWithText(buildLeadMessage(leadForm)); });
  $("#sendTg2")?.addEventListener("click", ()=> { if (!ensureLeadValid(leadForm2)) return; openTelegramWithText(buildLeadMessage(leadForm2)); });
  $("#sendVk2")?.addEventListener("click", async ()=> { if (!ensureLeadValid(leadForm2)) return; await openVKWithText(buildLeadMessage(leadForm2)); });
$("#sendMax")?.addEventListener("click", ()=> { if (!ensureLeadValid(leadForm)) return; openMaxWithText(buildLeadMessage(leadForm)); });
  $("#sendMax2")?.addEventListener("click", ()=> { if (!ensureLeadValid(leadForm2)) return; openMaxWithText(buildLeadMessage(leadForm2)); });
  $("#maxOpenM")?.addEventListener("click", ()=> window.open(LINKS.max, "_blank", "noopener,noreferrer"));

  // ====== Static template to Telegram (fallback) ======
  function openTemplateToTG(text){
    openTelegramWithText(text || "Здравствуйте!");
  }

  // ====== Modals content ======
  function openTimeModal(){
    openUiModal(`
      <h3>Срок ремонта</h3>
      <p class="muted">Срок зависит от модели, сложности неисправности и наличия запчастей.</p>
      <ul class="ul">
        <li><b>Типовые работы</b> (разъём, чистка, простые замены) — часто в день обращения.</li>
        <li><b>Средняя сложность</b> — обычно 1–3 дня.</li>
        <li><b>Сложный ремонт / плата</b> или редкие запчасти — дольше, согласуем после диагностики.</li>
      </ul>
      <div class="actions">
        <button class="btn btn--tg" type="button" data-send="tg" data-msg="time">Написать в Telegram</button>
        <button class="btn btn--vk" type="button" data-send="vk" data-msg="time">VK</button>
        <button class="btn btn--max" type="button" data-send="max" data-msg="time">MAX</button>
      </div>
    `);
  }

  function openCourierModal(){
    openUiModal(`
      <h3>Курьер / доставка</h3>
      <p class="muted">Заполни поля — мы сформируем сообщение и откроем выбранный мессенджер.</p>

      <form class="form" id="courierForm" style="margin-top:10px">
        <label class="field">
          <span>Адрес забора / доставки</span>
          <input name="addr" placeholder="Город, улица, дом, подъезд, этаж" required>
        </label>
        <label class="field">
          <span>Когда удобно</span>
          <input name="when" placeholder="Сегодня после 18:00 / Завтра 12–15" required>
        </label>
        <label class="field">
          <span>Устройство</span>
          <input name="dev" placeholder="Напр.: ТВ Samsung / iPhone 13 / кофемашина Philips" required>
        </label>
        <label class="field">
          <span>Проблема</span>
          <input name="issue" placeholder="Коротко опиши неисправность" required>
        </label>
        <label class="field">
          <span>Комментарий (необязательно)</span>
          <input name="comment" placeholder="Код домофона, ориентир, и т.д.">
        </label>

        <div class="actions">
          <button class="btn btn--tg" type="button" data-courier-send="tg">Отправить в Telegram</button>
          <button class="btn btn--vk" type="button" data-courier-send="vk">VK</button>
          <button class="btn btn--max" type="button" data-courier-send="max">MAX</button>
        </div>
      </form>
    `);
  }

  const MODEL_DATA = {
    phone: {
      title: "Телефоны",
      // used by phone-specific renderer
      iPhoneGroups: [
        { name:"iPhone 6–8", items:["iPhone 6","iPhone 6 Plus","iPhone 6s","iPhone 6s Plus","iPhone SE (1)","iPhone 7","iPhone 7 Plus","iPhone 8","iPhone 8 Plus"] },
        { name:"iPhone X–11", items:["iPhone X","iPhone XR","iPhone XS","iPhone XS Max","iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max","iPhone SE (2)"] },
        { name:"iPhone 12–13", items:["iPhone 12 mini","iPhone 12","iPhone 12 Pro","iPhone 12 Pro Max","iPhone 13 mini","iPhone 13","iPhone 13 Pro","iPhone 13 Pro Max","iPhone SE (3)"] },
        { name:"iPhone 14–15", items:["iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max","iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max"] },
        { name:"iPhone 16–17", items:["iPhone 16","iPhone 16 Plus","iPhone 16 Pro","iPhone 16 Pro Max","iPhone 17","iPhone 17 Plus","iPhone 17 Pro","iPhone 17 Pro Max"] },
      ],
      androidBrands: {
        "Samsung": ["Galaxy A02/A03/A04","Galaxy A10/A20/A30","Galaxy A12/A13/A14","Galaxy A22/A23/A24","Galaxy A32/A33/A34","Galaxy A42/A52/A53/A54","Galaxy A72","Galaxy S20/S21/S22/S23/S24","Galaxy Note 10/20","Galaxy M12/M21/M31/M51"],
        "Xiaomi": ["Mi 9/10/11","Xiaomi 11T/12T/13T","Xiaomi 12/13/14","Xiaomi Mix","Xiaomi (другая модель)"],
        "Redmi": ["Redmi 9/10/11/12","Redmi Note 8/9/10/11/12/13","Redmi Note Pro (серии)","Redmi A1/A2"],
        "POCO": ["POCO X3/X4/X5","POCO F3/F4/F5","POCO M3/M4/M5"],
        "Honor": ["Honor 8X/9X","Honor 10/20/30/50/70/90","Honor X8/X9/X10","Honor Magic (серии)"],
        "Huawei": ["P20/P30/P40","Mate 20/30/40","Nova (серии)","Y (серии)"],
        "Realme": ["Realme C (серии)","Realme 7/8/9/10/11","Realme GT (серии)"],
        "Tecno": ["Spark (серии)","Pova (серии)","Camon (серии)"],
        "Infinix": ["Hot (серии)","Note (серии)","Zero (серии)"],
        "OnePlus": ["OnePlus 8/9/10/11/12","Nord (серии)"],
        "OPPO": ["A (серии)","Reno (серии)","Find (серии)"],
        "Vivo": ["Y (серии)","V (серии)","X (серии)"],
        "Google Pixel": ["Pixel 5/6/7/8","Pixel Pro (серии)"],
        "Другое": ["Другая модель Android (укажу в тексте)"],
      },
      // fallback tabs (not used in new UI, but keep for compatibility)
      tabs: [
        { key:"apple", name:"Apple (iPhone)", items:["iPhone (выберу из списка)"] },
        { key:"android", name:"Android", items:["Android (выберу из списка)"] },
      ]
    },
    tv: {
      title: "Телевизоры",
      tabs: [
        { key:"tv", name:"Бренды", items:["Samsung","LG","Sony","Philips","TCL","Hisense","Xiaomi","Haier","BBK","DEXP","Другое"] }
      ]
    },
    coffee: {
      title: "Кофемашины",
      tabs: [
        { key:"coffee", name:"Бренды", items:["DeLonghi","Philips","Saeco","Jura","Bosch","Krups","Nivona","Siemens","Melitta","Другое"] }
      ]
    },
    print: {
      title: "Принтеры",
      tabs: [
        { key:"print", name:"Бренды", items:["HP","Canon","Epson","Brother","Samsung","Xerox","Kyocera","Ricoh","Pantum","Другое"] }
      ]
    },
    dyson: {
      title: "Dyson / бытовая",
      tabs: [
        { key:"dyson", name:"Модели", items:["Dyson V6","Dyson V7","Dyson V8","Dyson V10","Dyson V11","Dyson V12","Dyson V15","Supersonic (фен)","Airwrap","Другое"] }
      ]
    },
    pc: {
      title: "ПК / ноутбуки",
      tabs: [
        { key:"laptop", name:"Ноутбуки", items:["ASUS","Acer","Lenovo","HP","MSI","Dell","Apple MacBook","Huawei","Honor","Другое"] },
        { key:"pc", name:"ПК/моноблок", items:["Сборный ПК","Моноблок","Мини‑ПК","Другое"] }
      ]
    },
    ps: {
      title: "Приставки",
      tabs: [
        { key:"console", name:"Платформа", items:["PlayStation 4","PlayStation 5","Xbox One","Xbox Series","Nintendo Switch","Другое"] }
      ]
    },
    water: { // общий список "что ремонтируем"
      title: "Что ремонтируем",
      tabs: [
        { key:"phones", name:"Телефоны", items:["Apple (iPhone)","Android (Samsung/Xiaomi/… )"] },
        { key:"tv", name:"Телевизоры", items:["Samsung","LG","Sony","Philips","TCL/Hisense","Другое"] },
        { key:"coffee", name:"Кофемашины", items:["DeLonghi","Philips/Saeco","Jura","Bosch/Krups","Другое"] },
        { key:"dyson", name:"Dyson/бытовая", items:["V6/V7/V8","V10/V11","V12/V15","Supersonic/Airwrap","Другое"] },
        { key:"print", name:"Принтеры", items:["HP","Canon","Epson","Brother","Другое"] },
        { key:"pc", name:"ПК/ноутбуки", items:["Ноутбуки","ПК/моноблок","Другое"] },
        { key:"tablet", name:"Планшеты", items:["iPad","Samsung Tab","Huawei","Lenovo","Другое"] },
      ]
    }
  };

  
  function renderPhoneModal(){
    // Phone modal: Apple -> iPhone models; Android -> brand -> models (accordion-like)
    const cfg = MODEL_DATA.phone;
    const iPhoneGroups = cfg.iPhoneGroups || [];
    const androidBrands = cfg.androidBrands || {};

    const renderApple = () => {
      const blocks = iPhoneGroups.map(g => `
        <div class="card" style="padding:12px; margin-top:10px">
          <b style="display:block; margin-bottom:8px">${escHtml(g.name)}</b>
          <div class="modelgrid">
            ${g.items.map(m => `<button type="button" class="modelitem" data-pick="${escHtml("Apple (iPhone) — " + m)}">${escHtml(m)}</button>`).join("")}
          </div>
        </div>
      `).join("");
      return `<div class="modelswrap" id="phoneList">${blocks}</div>`;
    };

    const renderAndroidBrands = () => `
      <div class="modelswrap" id="phoneList">
        <div class="modelgrid">
          ${Object.keys(androidBrands).map(b => `<button type="button" class="modelitem" data-android-brand="${escHtml(b)}">${escHtml(b)}</button>`).join("")}
        </div>
        <div id="androidModels" style="margin-top:12px"></div>
      </div>
    `;

    openUiModal(`
      <h3>Телефоны</h3>
      <p class="muted">Выбери платформу и модель — ниже появится список. Окно не «прыгает», можно листать вверх/вниз.</p>

      <div class="chips" style="margin:10px 0 8px">
        <button class="chip active" type="button" data-phone-tab="apple">Apple (iPhone)</button>
        <button class="chip" type="button" data-phone-tab="android">Android</button>
      </div>

      <div id="phoneTabBody">
        ${renderApple()}
      </div>

      <div class="card" style="margin-top:12px">
        <label class="field">
          <span>Выбрано</span>
          <input id="mPicked" placeholder="Выбери модель выше" readonly>
        </label>

        <label class="field" style="margin-top:10px">
          <span>Проблема</span>
          <input id="mIssue" placeholder="Разбит дисплей / не заряжается / нет сети…" required>
        </label>

        <div class="row" style="margin-top:10px">
          <label class="field">
            <span>Срочность</span>
            <select id="mUrgency">
              <option>Не срочно</option>
              <option>Сегодня</option>
              <option>Срочно</option>
            </select>
          </label>
          <label class="field">
            <span>Контакт (по желанию)</span>
            <input id="mContact" placeholder="+7... или @telegram">
          </label>
        </div>

        <div class="actions" style="margin-top:12px">
          <button class="btn btn--tg" type="button" data-model-send="tg" data-cat="phone">Отправить в Telegram</button>
          <button class="btn btn--vk" type="button" data-model-send="vk" data-cat="phone">VK</button>
          <button class="btn btn--max" type="button" data-model-send="max" data-cat="phone">MAX</button>
        </div>
      </div>
    `);

    // bind tab switching (delegated by doc click handler below)
    // Android brand click handled by global delegation too.
    function setPhoneTab(tab){
      const body = $("#phoneTabBody");
      if (!body) return;
      if (tab === "android") body.innerHTML = renderAndroidBrands();
      else body.innerHTML = renderApple();
      // reset android models area if any
      $("#androidModels")?.replaceChildren();
    }
    // store function on modal for later use
    const panel = $(".uimodal__panel");
    if (panel) panel.dataset.phoneTab = "apple";
    // initial pick placeholder
  }

function renderModelsModal(categoryKey){
    if (categoryKey === "phone") return renderPhoneModal();
    const data = MODEL_DATA[categoryKey] || MODEL_DATA.water;
    const tabs = data.tabs || [];
    const tabButtons = tabs.map((t,i)=>`
      <button class="chip ${i===0?'active':''}" type="button" data-tab="${escHtml(t.key)}">${escHtml(t.name)}</button>
    `).join("");

    const firstKey = tabs[0]?.key || "tab";
    const listHtml = (key)=>{
      const tab = tabs.find(t=>t.key===key) || tabs[0];
      const items = tab?.items || [];
      return `<div class="modelgrid">
        ${items.map(it=>`<button type="button" class="modelitem" data-pick="${escHtml(it)}">${escHtml(it)}</button>`).join("")}
      </div>`;
    };

    openUiModal(`
      <h3>${escHtml(data.title)}</h3>
      <p class="muted">Выбери категорию/бренд/модель, опиши проблему — сформируем сообщение.</p>

      <div class="chips" style="margin:10px 0 8px">
        ${tabButtons}
      </div>

      <div id="modelsList" class="modelswrap">
        ${listHtml(firstKey)}
      </div>

      <div class="card" style="margin-top:12px">
        <label class="field">
          <span>Выбрано</span>
          <input id="mPicked" placeholder="Выбери пункт выше" readonly>
        </label>

        <label class="field" style="margin-top:10px">
          <span>Проблема</span>
          <input id="mIssue" placeholder="Не включается / нет изображения / не заряжается…" required>
        </label>

        <div class="row" style="margin-top:10px">
          <label class="field">
            <span>Срочность</span>
            <select id="mUrgency">
              <option>Не срочно</option>
              <option>Сегодня</option>
              <option>Срочно</option>
            </select>
          </label>
          <label class="field">
            <span>Контакт (по желанию)</span>
            <input id="mContact" placeholder="+7... или @telegram">
          </label>
        </div>

        <div class="actions" style="margin-top:12px">
          <button class="btn btn--tg" type="button" data-model-send="tg" data-cat="${escHtml(categoryKey||'water')}">Отправить в Telegram</button>
          <button class="btn btn--vk" type="button" data-model-send="vk" data-cat="${escHtml(categoryKey||'water')}">VK</button>
          <button class="btn btn--max" type="button" data-model-send="max" data-cat="${escHtml(categoryKey||'water')}">MAX</button>
        </div>
      </div>
    `);
  }

  // ====== Modal button actions (event delegation) ======
  document.addEventListener("click", async (e)=>{
    // Time modal send
    const send = e.target.closest("[data-send]");
    if (send){
      const type = send.getAttribute("data-send");
      const msgKey = send.getAttribute("data-msg");
      const msg = (msgKey === "time")
        ? "Здравствуйте! Подскажите, пожалуйста, по срокам ремонта. Устройство: ____. Проблема: ____."
        : "Здравствуйте!";
      if (type === "tg") openTelegramWithText(msg);
      if (type === "vk") await openVKWithText(msg);
      if (type === "max") await openMaxWithText(msg);
      return;
    }

    // Courier modal send
    const cs = e.target.closest("[data-courier-send]");
    if (cs){
      const form = $("#courierForm");
      if (!form) return;
      const fd = new FormData(form);
      const addr = String(fd.get("addr")||"").trim();
      const when = String(fd.get("when")||"").trim();
      const dev = String(fd.get("dev")||"").trim();
      const issue = String(fd.get("issue")||"").trim();
      const comment = String(fd.get("comment")||"").trim();

      if (!addr || !when || !dev || !issue){
        alert("Заполни обязательные поля.");
        return;
      }

      const msg = [
        "Здравствуйте! Нужен курьер / доставка.",
        `Адрес: ${addr}`,
        `Когда удобно: ${when}`,
        `Устройство: ${dev}`,
        `Проблема: ${issue}`,
        comment ? `Комментарий: ${comment}` : null,
        "",
        "Отправлено с сайта vremonte61.online"
      ].filter(Boolean).join("\n");

      const type = cs.getAttribute("data-courier-send");
      if (type === "tg") openTelegramWithText(msg);
      if (type === "vk") await openVKWithText(msg);
      if (type === "max") await openMaxWithText(msg);
      return;
    }

    // Models tab switch
    const tabBtn = e.target.closest("[data-tab]");
    if (tabBtn){
      const key = tabBtn.getAttribute("data-tab");
      const title = $("#uiModalContent h3")?.textContent || "";
      // find dataset by title match (simple)
      let data = null;
      for (const k in MODEL_DATA){
        if (MODEL_DATA[k].title === title){ data = MODEL_DATA[k]; break; }
      }
      if (!data) return;
      const tab = data.tabs.find(t=>t.key===key) || data.tabs[0];
      const list = $("#modelsList");
      if (!list) return;
      list.innerHTML = `<div class="modelgrid">
        ${(tab.items||[]).map(it=>`<button type="button" class="modelitem" data-pick="${escHtml(it)}">${escHtml(it)}</button>`).join("")}
      </div>`;
      // UI toggle active-ish
      $$(".chips [data-tab]").forEach(b=>b.classList.remove("active"));
      tabBtn.classList.add("active");
      return;
    }

    
    // Phone modal: switch Apple/Android tabs
    const ptab = e.target.closest("[data-phone-tab]");
    if (ptab){
      const tab = ptab.getAttribute("data-phone-tab") || "apple";
      const body = $("#phoneTabBody");
      if (!body) return;
      // toggle chip styles
      $$(".chips [data-phone-tab]").forEach(b=>b.classList.remove("active"));
      ptab.classList.add("active");

      // Re-render using lightweight templates stored in renderPhoneModal scope by regenerating via openByKey route
      // (We simply swap inner HTML based on tab, using inline helpers defined in renderPhoneModal via dataset flags)
      // Here we rebuild minimal content to avoid modal resize jumps.
      if (tab === "android"){
        body.innerHTML = `<div class="modelswrap" id="phoneList">
          <div class="modelgrid">
            ${Object.keys(MODEL_DATA.phone.androidBrands).map(b => `<button type="button" class="modelitem" data-android-brand="${escHtml(b)}">${escHtml(b)}</button>`).join("")}
          </div>
          <div id="androidModels" style="margin-top:12px"></div>
        </div>`;
      } else {
        body.innerHTML = `<div class="modelswrap" id="phoneList">
          ${MODEL_DATA.phone.iPhoneGroups.map(g => `
            <div class="card" style="padding:12px; margin-top:10px">
              <b style="display:block; margin-bottom:8px">${escHtml(g.name)}</b>
              <div class="modelgrid">
                ${g.items.map(m => `<button type="button" class="modelitem" data-pick="${escHtml("Apple (iPhone) — " + m)}">${escHtml(m)}</button>`).join("")}
              </div>
            </div>
          `).join("")}
        </div>`;
      }
      return;
    }

    // Android brand click -> show models below (without modal jumping)
    const ab = e.target.closest("[data-android-brand]");
    if (ab){
      const brand = ab.getAttribute("data-android-brand") || "";
      const wrap = $("#androidModels");
      if (!wrap) return;
      const models = (MODEL_DATA.phone.androidBrands && MODEL_DATA.phone.androidBrands[brand]) ? MODEL_DATA.phone.androidBrands[brand] : [];
      wrap.innerHTML = `
        <div class="card" style="padding:12px">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap">
            <b>${escHtml(brand)}</b>
            <button type="button" class="btn btn--small btn--soft" data-android-back="1">Назад к брендам</button>
          </div>
          <div class="modelgrid" style="margin-top:10px">
            ${models.map(m => `<button type="button" class="modelitem" data-pick="${escHtml("Android — " + brand + " — " + m)}">${escHtml(m)}</button>`).join("")}
          </div>
        </div>
      `;
      // gentle scroll to the revealed area
      wrap.scrollIntoView({ behavior:"smooth", block:"nearest" });
      return;
    }

    const aback = e.target.closest("[data-android-back]");
    if (aback){
      const wrap = $("#androidModels");
      if (wrap) wrap.innerHTML = "";
      return;
    }

// Pick model item
    const pick = e.target.closest("[data-pick]");
    if (pick){
      const v = pick.getAttribute("data-pick") || "";
      const inp = $("#mPicked");
      if (inp) inp.value = v;
      return;
    }

    // Send model request
    const ms = e.target.closest("[data-model-send]");
    if (ms){
      const picked = $("#mPicked")?.value?.trim() || "";
      const issue = $("#mIssue")?.value?.trim() || "";
      const urgency = $("#mUrgency")?.value || "";
      const contact = $("#mContact")?.value?.trim() || "";
      if (!picked || !issue){
        alert("Выбери модель/пункт и опиши проблему.");
        return;
      }
      const cat = ms.getAttribute("data-cat") || "water";
      const msg = [
        "Здравствуйте! Хочу узнать стоимость ремонта.",
        `Категория: ${MODEL_DATA[cat]?.title || "Техника"}`,
        `Модель/пункт: ${picked}`,
        `Проблема: ${issue}`,
        urgency ? `Срочность: ${urgency}` : null,
        contact ? `Контакт: ${contact}` : null,
        "",
        "Отправлено с сайта vremonte61.online"
      ].filter(Boolean).join("\n");

      const type = ms.getAttribute("data-model-send");
      if (type === "tg") openTelegramWithText(msg);
      if (type === "vk") await openVKWithText(msg);
      if (type === "max") await openMaxWithText(msg);
      return;
    }
  });

  // ====== Chips & buttons mapping ======
  function openByKey(key){
    // chips on hero
    if (key === "time") return openTimeModal();
    if (key === "pickup") return openCourierModal();
    if (key === "water") return renderModelsModal("water");
    if (key === "tv") return renderModelsModal("tv");
    if (key === "coffee") return renderModelsModal("coffee");
    if (key === "print") return renderModelsModal("print");

    if (key === "price"){
      return openTemplateToTG("Здравствуйте! Хочу узнать ориентировочную стоимость ремонта.\nКатегория: ____\nМарка/модель: ____\nПроблема: ____\n\nОтправлено с сайта vremonte61.online");
    }
  }

  // delegate click for [data-template]
  document.addEventListener("click", (e)=>{
    const b = e.target.closest("[data-template]");
    if (!b) return;
    const key = b.getAttribute("data-template");
    if (!key) return;
    e.preventDefault();
    openByKey(key);
  });

  // 'Узнать цену' buttons in services (data-service)
  document.addEventListener("click", (e)=>{
    const b = e.target.closest("[data-service]");
    if (!b) return;
    const key = b.getAttribute("data-service");
    // Instead of opening TG immediately, open models modal (as requested)
    // Map service -> category
    const map = { phone:"phone", pc:"pc", tv:"tv", ps:"ps", coffee:"coffee", dyson:"dyson" };
    const cat = map[key] || "water";
    e.preventDefault();
    if (cat === "phone") renderPhoneModal(); else renderModelsModal(cat);
  });

  // ToTop (if exists)
  const toTop = $("#toTop");
  if (toTop){
    const onScroll = () => { if (window.scrollY > 600) toTop.classList.add("show"); else toTop.classList.remove("show"); };
    window.addEventListener("scroll", onScroll);
    onScroll();
    toTop.addEventListener("click", ()=> window.scrollTo({ top:0, behavior:"smooth" }));
  }
  // Copy helpers
  const copyBtns = document.querySelectorAll("[data-copy]");
  if (copyBtns && copyBtns.length) {
    const templates = {
      courier: "Здравствуйте! Нужен курьер.\nУстройство: ____\nМодель: ____\nПроблема: ____\nАдрес забора: ____\nУдобное время: ____\nКонтактный телефон: ____"
    };
    copyBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const key = btn.getAttribute("data-copy");
        const text = templates[key] || "";
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = "Скопировано ✓";
          setTimeout(() => (btn.textContent = "Скопировать текст"), 1500);
        } catch (e) {
          // Fallback
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
          btn.textContent = "Скопировано ✓";
          setTimeout(() => (btn.textContent = "Скопировать текст"), 1500);
        }
      });
    });
  }


})();

  // ====== Lightbox (works gallery) ======
  const workImgs = Array.from(document.querySelectorAll(".workcard img"));
  if (workImgs.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `
      <div class="lightbox__panel" role="dialog" aria-modal="true" aria-label="Просмотр фото">
        <div class="lightbox__top">
          <div class="lightbox__title">Фото процесса</div>
          <button class="lightbox__close" type="button" aria-label="Закрыть">✕</button>
        </div>
        <div class="lightbox__imgwrap">
          <img class="lightbox__img" alt="" src="" />
        </div>
      </div>
    `;
    document.body.appendChild(lb);
    const imgEl = lb.querySelector(".lightbox__img");
    const closeBtn = lb.querySelector(".lightbox__close");
    const close = () => lb.classList.remove("is-open");
    closeBtn.addEventListener("click", close);
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    workImgs.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        imgEl.src = img.currentSrc || img.src;
        imgEl.alt = img.alt || "Фото процесса";
        lb.classList.add("is-open");
      });
    });
  }

// Hotfix: bottom lead form handlers

(function(){
  const form = document.querySelector('.lead-bottom, #bottomLeadForm, .footer .lead-form');
  if(!form) return;
  const getVal = sel => (form.querySelector(sel)?.value || '').trim();
  const buildMsg = () => {
    const d=getVal('input[name="device"], #leadDevice2, #leadDevice');
    const p=getVal('textarea[name="problem"], #leadProblem2, #leadProblem');
    const c=getVal('input[name="contact"], #leadContact2, #leadContact');
    if(!d || !p){ alert('Укажите устройство и проблему'); return null; }
    return `Заявка с сайта\nУстройство: ${d}\nПроблема: ${p}${c?`\nКонтакт: ${c}`:''}`;
  };
  const bind = (cls, fn) => { const b=form.querySelector(cls); if(b) b.addEventListener('click', fn); };
  bind('.btn-tg', ()=>{ const m=buildMsg(); if(m) window.open('https://t.me/share/url?text='+encodeURIComponent(m),'_blank'); });
  bind('.btn-vk', ()=>{ const m=buildMsg(); if(m) window.open('https://vk.com/share.php?comment='+encodeURIComponent(m),'_blank'); });
  bind('.btn-max', ()=>{ const m=buildMsg(); if(m) window.open('https://max.ru','_blank'); });

  // ===== Step 5: Quick estimate + Problems modal =====
  const encode = (s) => encodeURIComponent(String(s || ""));
  const buildEstimateText = () => {
    const form = document.getElementById("quickEstimate");
    if (!form) return "";
    const cat = form.getAttribute("data-cat") || "Телефон";
    const model = (form.querySelector('[name="model"]')?.value || "").trim();
    const issue = (form.querySelector('[name="issue"]')?.value || "").trim();
    const parts = [];
    parts.push(`Заявка с сайта: ${cat}`);
    if (model) parts.push(`Модель: ${model}`);
    if (issue) parts.push(`Проблема: ${issue}`);
    parts.push("Адрес: Ткачева 22");
    return parts.join("\n");
  };

  // Tabs for quick estimate
  (() => {
    const tabs = Array.from(document.querySelectorAll(".estTab"));
    const form = document.getElementById("quickEstimate");
    if (!tabs.length || !form) return;

    const CAT = {
      phone: { label: "Телефон", modelPH: "Например: iPhone 13 / Redmi Note", issuePH: "Разбит экран, не включается, не работает звук…" },
      pc: { label: "ПК/Ноутбук", modelPH: "Например: ASUS / HP / Lenovo", issuePH: "Не включается, шумит, перегревается, Windows…" },
      tv: { label: "ТВ", modelPH: "Например: LG 55 / Samsung / Konka", issuePH: "Нет изображения, полосы, нет подсветки…" },
      coffee: { label: "Кофемашина", modelPH: "Например: DeLonghi / Philips / Saeco", issuePH: "Не подаёт воду, протекает, ошибка…" },
      printer: { label: "Принтер", modelPH: "Например: HP / Canon / Epson", issuePH: "Не печатает, полосит, зажёвывает бумагу…" },
      dyson: { label: "Dyson", modelPH: "Например: V10 / V11 / Airwrap", issuePH: "Не включается, теряет мощность, выключается…" },
    };

    const setCat = (key) => {
      const cfg = CAT[key] || CAT.phone;
      form.setAttribute("data-cat", cfg.label);
      const model = form.querySelector('[name="model"]');
      const issue = form.querySelector('[name="issue"]');
      if (model) model.setAttribute("placeholder", cfg.modelPH);
      if (issue) issue.setAttribute("placeholder", cfg.issuePH);
      tabs.forEach((t) => {
        const isActive = t.dataset.cat === key;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    };

    tabs.forEach((t) => t.addEventListener("click", () => setCat(t.dataset.cat)));
    setCat("phone");

    // Prefill share to Telegram from quick estimate
    const qeTg = document.getElementById("qeTg");
    if (qeTg) {
      qeTg.addEventListener("click", (e) => {
        const text = buildEstimateText();
        if (!text) return;
        e.preventDefault();
        const url = `https://t.me/share/url?text=${encode(text)}`;
        window.open(url, "_blank");
      });
    }
  })();

  // Problems modal
  (() => {
    const modal = document.getElementById("problemsModal");
    const list = document.getElementById("pmList");
    const input = document.getElementById("pmSearchInput");
    const openers = Array.from(document.querySelectorAll('[data-open-problems="1"]'));
    const tabs = Array.from(document.querySelectorAll(".pmTab"));

    if (!modal || !list || !openers.length) return;

    const PROBLEMS = {
      phone: [
        { t: "Разбит экран", s: "замена дисплея/стекла", href: "razbit-ekran.html" },
        { t: "Не работает сенсор", s: "тачскрин/контакты", href: "ne-rabotaet-sensor.html" },
        { t: "Не работает камера", s: "модуль/шлейф", href: "ne-rabotaet-kamera.html" },
        { t: "Не работает динамик", s: "хрип/тишина", href: "ne-rabotaet-dinamik.html" },
        { t: "Не работает микрофон", s: "связь/запись", href: "ne-rabotaet-mikrofon.html" },
      ],
      tv: [
        { t: "Нет изображения", s: "есть звук / нет картинки", href: "net-izobrazheniya-est-zvuk.html" },
        { t: "Есть звук, нет изображения", s: "подсветка/плата", href: "est-zvuk-net-izobrazheniya.html" },
        { t: "Нет подсветки", s: "замена подсветки", href: "net-podsvetki.html" },
        { t: "Полосы на экране", s: "матрица/шлейфы", href: "polosy-na-ekrane.html" },
        { t: "Мигает экран", s: "питание/подсветка", href: "migaet-ekran-televizora.html" },
        { t: "Не работает HDMI", s: "разъём/плата", href: "ne-rabotaet-hdmi.html" },
        { t: "Не работает пульт", s: "ИК/плата", href: "ne-rabotaet-pult.html" },
      ],
      coffee: [
        { t: "Не включается", s: "питание/плата", href: "kofemashina-ne-vklyuchaetsya.html" },
        { t: "Не подаёт воду", s: "помпа/засор", href: "kofemashina-ne-podayet-vodu.html" },
        { t: "Протекает", s: "уплотнения/патрубки", href: "kofemashina-protekaet.html" },
        { t: "Ошибка на дисплее", s: "диагностика/сброс", href: "kofemashina-oshibka.html" },
        { t: "Слабый напор", s: "декальцинация/засор", href: "kofemashina-slabyy-napor.html" },
        { t: "Не греет", s: "термоблок/датчики", href: "kofemashina-ne-greet.html" },
      ],
      printer: [
        { t: "Не печатает", s: "драйвер/узлы", href: "printer-ne-pechataet.html" },
        { t: "Печатает пустые листы", s: "чернила/головка", href: "printer-pechataet-pustye-listy.html" },
        { t: "Полосит", s: "прочистка/головка", href: "printer-polosit.html" },
        { t: "Зажёвывает бумагу", s: "ролики/датчики", href: "printer-zazhevyvaet-bumagu.html" },
        { t: "Не включается", s: "питание", href: "printer-ne-vklyuchaetsya.html" },
        { t: "Компьютер не видит", s: "USB/сеть", href: "printer-ne-viden-kompyuteru.html" },
      ],
      dyson: [
        { t: "Не включается", s: "аккумулятор/плата", href: "dyson-ne-vklyuchaetsya.html" },
        { t: "Теряет мощность", s: "фильтры/двигатель", href: "dyson-teryaet-moshchnost.html" },
        { t: "Выключается", s: "перегрев/контакты", href: "dyson-vyklyuchaetsya.html" },
      ],
    };

    let activeCat = "phone";

    const render = () => {
      const q = (input?.value || "").trim().toLowerCase();
      const all = Object.entries(PROBLEMS).flatMap(([cat, items]) =>
        items.map((it) => ({ ...it, cat }))
      );

      const source = q
        ? all.filter((it) => (it.t + " " + it.s).toLowerCase().includes(q))
        : (PROBLEMS[activeCat] || []);

      list.innerHTML = source
        .map(
          (it) => `
          <a class="pmItem" href="${it.href}">
            <div>
              <div class="pmItem__t">${it.t}</div>
              <div class="pmItem__s">${it.s}</div>
            </div>
            <div class="pmItem__s">→</div>
          </a>`
        )
        .join("");
    };

    const setOpen = (open) => {
      modal.classList.toggle("is-open", !!open);
      modal.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("menu-open", !!open);
      if (open) {
        setTimeout(() => input?.focus(), 20);
        render();
      }
    };

    openers.forEach((b) => b.addEventListener("click", () => setOpen(true)));
    modal.addEventListener("click", (e) => {
      if (e.target && e.target.closest && e.target.closest('[data-close-problems="1"]')) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) setOpen(false);
    });

    tabs.forEach((t) =>
      t.addEventListener("click", () => {
        activeCat = t.dataset.pmCat || "phone";
        tabs.forEach((x) => {
          const on = x === t;
          x.classList.toggle("is-active", on);
          x.setAttribute("aria-selected", on ? "true" : "false");
        });
        if (input) input.value = "";
        render();
      })
    );

    input?.addEventListener("input", render);
  })();

})();
