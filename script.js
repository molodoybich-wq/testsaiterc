(() => {
  "use strict";

  const LINKS = {
    phone: "tel:+79255156161",
    tg: "https://t.me/vremonte161",
    wa: "https://wa.me/79255156161",
    max: "https://max.ru/u/f9LHodD0cOIcyLKszOi0I1wOwGuyOltplh3obPyqkL7_jwUK6DRgug2lKI8",
  };

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Year
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Mobile menu
  const burger = $("#burger");
  const mnav = $("#mnav");
  function setMenu(open){
    if (!burger || !mnav) return;
    burger.setAttribute("aria-expanded", String(open));
    mnav.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  }
  burger?.addEventListener("click", () => setMenu(mnav?.hidden));
  mnav?.addEventListener("click", (e) => {
    if (e.target.closest(".mnav__a")) setMenu(false);
  });

  // Dropdowns (desktop)
  const dropBtns = $$('[data-dropdown]');
  function closeAllDrops(){
    dropBtns.forEach(b=>{
      const id = b.getAttribute('data-dropdown');
      const p = id ? document.querySelector(`[data-drop="${id}"]`) : null;
      b.setAttribute('aria-expanded','false');
      p?.classList.remove('open');
    });
  }
  dropBtns.forEach(btn=>{
    btn.setAttribute('aria-expanded','false');
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const id = btn.getAttribute('data-dropdown');
      const panel = id ? document.querySelector(`[data-drop="${id}"]`) : null;
      if (!panel) return;
      const open = !panel.classList.contains('open');
      closeAllDrops();
      panel.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if (t.closest('.nav__drop')) return;
    closeAllDrops();
  });

  // Smooth anchors
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    closeAllDrops();
    setMenu(false);
    el.scrollIntoView({behavior:'smooth', block:'start'});
  });

  // Reveal
  const reveal = $$('.reveal');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      for (const en of entries){
        if (en.isIntersecting) en.target.classList.add('in');
      }
    }, {threshold: 0.12});
    reveal.forEach(el=>io.observe(el));
  } else {
    reveal.forEach(el=>el.classList.add('in'));
  }

  // UI modal
  const uiModal = $('#uiModal');
  const uiModalContent = $('#uiModalContent');
  function openModal(html){
    if (!uiModal || !uiModalContent) return;
    uiModalContent.innerHTML = html;
    uiModal.classList.add('open');
    uiModal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  }
  function closeModal(){
    if (!uiModal) return;
    uiModal.classList.remove('open');
    uiModal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  }
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if (t?.dataset?.close === '1') closeModal();
  });
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape'){ closeModal(); closeAllDrops(); setMenu(false);} 
  });

  // Device picker with search
  const deviceData = [
    {cat:'Телефоны', items:[
      'iPhone (все модели)','Samsung Galaxy','Xiaomi / Redmi','Realme','Honor / Huawei','OnePlus','Google Pixel','Другой телефон'
    ]},
    {cat:'Компьютеры', items:[
      'Ноутбук','ПК / системный блок','Моноблок','MacBook / iMac','Игровая приставка','Другая техника'
    ]},
    {cat:'Техника', items:[
      'Телевизор','Кофемашина','Принтер / МФУ','Пылесос Dyson','Роутер / Wi‑Fi','Другая электроника'
    ]},
  ];

  function renderDeviceModal(targetInputId){
    const flat = deviceData.flatMap(g => g.items.map(it => ({cat:g.cat, name:it})));
    const html = `
      <div class="modalTitle">Выберите устройство</div>
      <div class="modalSub">Начните вводить — список будет фильтроваться</div>
      <input class="modalSearch" id="deviceSearch" placeholder="Например: iPhone, ноутбук, телевизор…" autocomplete="off" />
      <div class="modalList" id="deviceList">
        ${flat.map(x => `<button class="pick" type="button" data-pick="${escapeHtml(x.name)}">${escapeHtml(x.name)} <span class="muted">· ${escapeHtml(x.cat)}</span></button>`).join('')}
      </div>
      <div class="modalHint">Нужного пункта нет? Выберите «Другая…» и напишите модель в поле проблемы.</div>
    `;
    openModal(html);

    const search = $('#deviceSearch');
    const list = $('#deviceList');
    const target = document.getElementById(targetInputId);

    function applyFilter(){
      const q = (search?.value || '').trim().toLowerCase();
      $$('button.pick', list).forEach(b => {
        const name = (b.getAttribute('data-pick') || '').toLowerCase();
        b.style.display = (!q || name.includes(q)) ? '' : 'none';
      });
    }

    search?.addEventListener('input', applyFilter);
    list?.addEventListener('click', (e)=>{
      const btn = e.target.closest('button.pick');
      if (!btn) return;
      const val = btn.getAttribute('data-pick') || '';
      if (target) target.value = val;
      closeModal();
      target?.focus();
    });
    search?.focus();
  }

  // Support both buttons: [data-open-device] sets data-target input id
  $$('[data-open-device]').forEach(btn => {
    btn.addEventListener('click', ()=>{
      const target = btn.getAttribute('data-target') || 'leadDevice';
      renderDeviceModal(target);
    });
  });

  // Price accordion
  const price = $('#priceList');
  price?.addEventListener('click', (e)=>{
    const q = e.target.closest('.qa__q');
    if (!q) return;
    q.closest('.qa')?.classList.toggle('open');
  });

  // FAQ accordion
  const faq = $('#faqList');
  faq?.addEventListener('click', (e)=>{
    const q = e.target.closest('.qa__q');
    if (!q) return;
    q.closest('.qa')?.classList.toggle('open');
  });

  // Copy helper
  async function copy(text){
    try{ await navigator.clipboard.writeText(text); return true; }
    catch(_){
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position='fixed';
      ta.style.opacity='0';
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand('copy'); }catch(_2){}
      ta.remove();
      return true;
    }
  }

  function escapeHtml(s){
    return String(s||'')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function buildLeadMessage(){
    const device = ($('#leadDevice')?.value || '').trim();
    const problem = ($('#leadProblem')?.value || '').trim();
    const urgency = $('#leadUrgency')?.value || '';
    const contact = ($('#leadContact')?.value || '').trim();

    const parts = [];
    parts.push('Здравствуйте! Заявка с сайта «В ремонте».');
    if (device) parts.push(`Устройство: ${device}`);
    if (problem) parts.push(`Проблема: ${problem}`);
    if (urgency) parts.push(`Срочность: ${urgency}`);
    if (contact) parts.push(`Контакт: ${contact}`);
    parts.push('');
    parts.push('Отправлено с сайта vremonte61.online');
    return parts.join('\n');
  }

  function openWithText(url, text){
    // WhatsApp/MAX часто удобнее: сначала копируем текст, потом открываем чат
    copy(text).finally(()=> window.open(url, '_blank', 'noopener,noreferrer'));
  }

  // Form submit
  const form = $('#leadForm');
  const channel = $('#leadChannel');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const text = buildLeadMessage();
    const ch = channel?.value || 'tg';

    if (ch === 'tg'){
      const url = `${LINKS.tg}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (ch === 'wa'){
      // open wa chat; message in clipboard
      openWithText(LINKS.wa, text);
    } else {
      // max
      openWithText(LINKS.max, text);
    }
  });

  // Quick buttons (footer/mobile)
  $$('[data-open="tg"]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault(); window.open(LINKS.tg,'_blank','noopener,noreferrer');}));
  $$('[data-open="wa"]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault(); window.open(LINKS.wa,'_blank','noopener,noreferrer');}));
  $$('[data-open="max"]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault(); window.open(LINKS.max,'_blank','noopener,noreferrer');}));

  // Cookie banner
  const cookieBanner = $('#cookieBanner');
  const cookieAccept = $('#cookieAccept');
  const cookieClose = $('#cookieClose');
  function setCookieVisible(show){
    if (!cookieBanner) return;
    cookieBanner.classList.toggle('is-hidden', !show);
    document.body.classList.toggle('cookie-visible', show);
  }
  try{
    const accepted = localStorage.getItem('cookieAccepted') === '1';
    setCookieVisible(!accepted);
  }catch(_){ setCookieVisible(true); }

  cookieAccept?.addEventListener('click', ()=>{
    try{ localStorage.setItem('cookieAccepted','1'); }catch(_){ }
    setCookieVisible(false);
  });
  cookieClose?.addEventListener('click', ()=> setCookieVisible(false));

})();
