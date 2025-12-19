// /assets/js/abc-header.js
(function () {
  // -------- helpers to load the partial (unchanged) --------
  function getPartialURL() {
    const link = document.querySelector('link#header-partial');
    if (link && link.getAttribute('href')) {
      try { return new URL(link.getAttribute('href'), document.baseURI).toString(); } catch {}
    }
    try { return new URL('/partials/header.html', document.baseURI).toString(); } catch {}
    return (location.pathname.replace(/\/[^\/]*$/, '/') + 'partials/header.html').replace(/\/\/+/g, '/');
  }

  function ensureBaseStyles() {
    let style = document.getElementById('header-floating-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'header-floating-style';
      document.head.appendChild(style);
    }
    style.textContent = `
      header#site-header { position: static !important; z-index: 10000; width: 100%; max-width: 100%; box-sizing: border-box; }
      #header-floater { position: fixed; top: calc(env(safe-area-inset-top, 0px) + 8px); right: 12px; z-index: 20050; display: flex; align-items: flex-start; gap: 8px; pointer-events: none; }
      #header-floater > * { pointer-events: auto; }
      .hf-wrap { position: relative; display: inline-flex; align-items: center; justify-content: flex-end; }
      .hf-dropdown { position: absolute !important; top: calc(100% + 8px); right: 0; left: auto; z-index: 20060; opacity: 1 !important; }
      html { scroll-padding-top: 0 !important; } body { padding-top: 0 !important; }
    `;
  }

  function ensureHeaderInjected() {
    const existingHeader = document.querySelector('header#site-header');
    if (existingHeader) { ensureBaseStyles(); return Promise.resolve('present'); }
    const url = getPartialURL();
    const mount = document.querySelector('#header-mount') || document.body;
    function injectInto(container, html) {
      if (container === document.body) container.insertAdjacentHTML('afterbegin', html);
      else container.innerHTML = html;
      ensureBaseStyles();
    }
    return fetch(url, { cache: 'no-store' })
      .then(r => r.text())
      .then(html => { injectInto(mount, html); return 'injected'; })
      .catch(() => 'failed');
  }

  // -------- dropdown controller --------
  function createDropdownController(toggleBtn, panelEl) {
    if (!toggleBtn || !panelEl) return null;

    panelEl.classList.remove('open');
    panelEl.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');

    function open(e) {
      if (e) { e.preventDefault?.(); e.stopPropagation?.(); }
      // Broadcast that a dropdown is opening so others close
      document.dispatchEvent(new CustomEvent('hf:dropdown:opening', { detail: { controller: api } }));
      panelEl.classList.add('open');
      panelEl.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    function close(e) {
      if (e) { e.preventDefault?.(); e.stopPropagation?.(); }
      panelEl.classList.remove('open');
      panelEl.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    function toggle(e) {
      if (e) { e.preventDefault?.(); e.stopPropagation?.(); }
      if (panelEl.classList.contains('open')) close();
      else open();
    }

    toggleBtn.addEventListener('click', toggle, { passive: false });

    const api = { open, close, toggle, toggleBtn, panelEl };
    return api;
  }

  // -------- setup behavior --------
  function setupBehavior() {
    const header = document.querySelector('header#site-header');
    if (!header) return;

    const langToggle = header.querySelector('#lang-toggle');
    const menuToggle = header.querySelector('#menu-toggle');
    const langMenu   = header.querySelector('#lang-dropdown');
    // Drawer is outside the header
    const drawer     = document.querySelector('#dropdown-menu');

    // Sticky toolbar container
    let floater = document.getElementById('header-floater');
    if (!floater) { floater = document.createElement('div'); floater.id = 'header-floater'; document.body.appendChild(floater); }

    // Wrap globe + dropdown
    const langWrap = document.createElement('div');
    langWrap.className = 'hf-wrap';
    if (langToggle) langWrap.appendChild(langToggle);
    if (langMenu) { langMenu.classList.add('hf-dropdown'); langWrap.appendChild(langMenu); }

    // Wrap hamburger (drawer stays global)
    const menuWrap = document.createElement('div');
    menuWrap.className = 'hf-wrap';
    if (menuToggle) menuWrap.appendChild(menuToggle);

    floater.appendChild(langWrap);
    floater.appendChild(menuWrap);

    // Controllers
    const langDD = (langToggle && langMenu) ? createDropdownController(langToggle, langMenu) : null;
    const menuDD = (menuToggle && drawer)   ? createDropdownController(menuToggle, drawer)   : null;

    // Hard mutual exclusivity: when one opens, close the other
    document.addEventListener('hf:dropdown:opening', (e) => {
      const sender = e.detail?.controller;
      if (sender && langDD && sender !== langDD) langDD.close();
      if (sender && menuDD && sender !== menuDD) menuDD.close();
    });

    // Outside click closes both
    document.addEventListener('click', (e) => {
      const t = e.target;
      const insideLang = t.closest('.hf-wrap') && t.closest('.hf-wrap').contains(langWrap);
      const insideMenu = t.closest('.hf-wrap') && t.closest('.hf-wrap').contains(menuWrap);
      // Also allow clicks inside the drawer content itself
      const inDrawer = !!t.closest('#dropdown-menu');
      if (!insideLang && !inDrawer && langDD) langDD.close();
      if (!insideMenu && !inDrawer && menuDD) menuDD.close();
    }, { passive: true });

    // ESC closes both
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { if (langDD) langDD.close(); if (menuDD) menuDD.close(); }
    }, { passive: true });

// Language label update + broadcast
const MENU_TEXT = {
  EN:{home:'Home',   games:'Tours',     pass:'Passcode',        pricing:'Pricing & Purchase', faq:'FAQ',                   terms:'Terms & Contact'},
  NL:{home:'Home',   games:'Tours',   pass:'Toegangscode',    pricing:'Prijzen & Aankoop',  faq:'FAQ',                   terms:'Voorwaarden & Contact'},
  PAP:{home:'Kasa',  games:'Hunganan',  pass:'Kódigo',          pricing:'Presio & Kompra',    faq:'Preguntanan Frekuente', terms:'Términonan & Kontakto'},
  ES:{home:'Inicio', games:'Tours',    pass:'Código',          pricing:'Precios y Compra',   faq:'Preguntas frecuentes',  terms:'Términos y Contacto'},
  RU:{home:'Главная',games:'Игры',      pass:'Код',             pricing:'Цены и покупка',     faq:'Вопросы и ответы',      terms:'Условия и контакты'}
};

function updateMenuLabels(code){
  const lang = MENU_TEXT[code] ? code : 'EN';
  const dict = MENU_TEXT[lang];
  if (!drawer) return;
  const links = drawer.querySelectorAll('a');
  if (links[0]) links[0].textContent = dict.home;
  if (links[1]) links[1].textContent = dict.games;
  if (links[2]) links[2].textContent = dict.pass;
  if (links[3]) links[3].textContent = dict.pricing;
  if (links[4]) links[4].textContent = dict.faq;
  if (links[5]) links[5].textContent = dict.terms;
}

    function broadcastLang(code){
      const c = (code || 'EN').toUpperCase();
      try { document.documentElement.lang = c.toLowerCase(); } catch {}
      try { localStorage.setItem('language', c); } catch {}
      try { if (typeof window.setLanguage === 'function') window.setLanguage(c); } catch {}
      try { if (typeof window.applyLanguage === 'function') window.applyLanguage(c); } catch {}
      try { if (window.Header && typeof Header.setLang === 'function') Header.setLang(c); } catch {}
      updateMenuLabels(c);
      try {
        const ev = new CustomEvent('languagechange', { detail: { code: c } });
        window.dispatchEvent(ev); document.dispatchEvent(ev);
      } catch {}
    }

    function bindLangOptions(){
      if (!langMenu) return;
      const opts = langMenu.querySelectorAll('.lang-option, [data-lang]');
      opts.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          const code = (btn.dataset.lang || btn.getAttribute('data-lang') || btn.textContent || 'EN').trim().toUpperCase();
          broadcastLang(code);
          if (langDD) langDD.close();
        }, { passive: true });
      });
    }
    bindLangOptions();

    try {
      const initial = (localStorage.getItem('language') || 'EN').toUpperCase();
      broadcastLang(initial);
    } catch {}
  }

  // -------- init --------
  function init(){ ensureHeaderInjected().then(()=>{ ensureBaseStyles(); setupBehavior(); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
