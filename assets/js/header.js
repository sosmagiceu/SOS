// /assets/js/header.js
// Injects /partials/header.html and wires up hamburger + language dropdown.
// Based on ABC Island Escapes header behavior (minus auto-translate).
(function () {
  const PARTIAL_URL = '/partials/header.html';

  function inject(html) {
    if (document.querySelector('#site-header')) return;
    document.body.insertAdjacentHTML('afterbegin', html);
  }

  async function loadPartial() {
    const res = await fetch(PARTIAL_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('header partial not found');
    return await res.text();
  }

  function closeAll(header) {
    header.classList.remove('menu-open');
    header.classList.remove('lang-open');
    const menu = header.querySelector('#dropdown-menu');
    const lang = header.querySelector('#lang-dropdown');
    if (menu) { menu.setAttribute('aria-hidden', 'true'); menu.classList.remove('open'); }
    if (lang) { lang.style.display = 'none'; lang.classList.remove('open'); }
    const menuToggle = header.querySelector('#menu-toggle');
    const langToggle = header.querySelector('#lang-toggle');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    if (langToggle) langToggle.setAttribute('aria-expanded', 'false');
  }

  function wire(header) {
    const menuToggle = header.querySelector('#menu-toggle');
    const menu = header.querySelector('#dropdown-menu');
    const langToggle = header.querySelector('#lang-toggle');
    const lang = header.querySelector('#lang-dropdown');

    // Init hidden
    if (menu) { menu.setAttribute('aria-hidden', 'true'); menu.classList.remove('open'); }
    if (lang) { lang.style.display = 'none'; lang.classList.remove('open'); }

    menuToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      const open = header.classList.toggle('menu-open');
      header.classList.remove('lang-open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (menu) { menu.setAttribute('aria-hidden', open ? 'false' : 'true'); menu.classList.toggle('open', open); }
      if (langToggle) langToggle.setAttribute('aria-expanded', 'false');
      if (lang) lang.style.display = 'none';
    });

    langToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      const open = header.classList.toggle('lang-open');
      header.classList.remove('menu-open');
      if (langToggle) langToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (lang) { lang.style.display = open ? 'flex' : 'none'; lang.classList.toggle('open', open); }
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      if (menu) { menu.setAttribute('aria-hidden', 'true'); menu.classList.remove('open'); }
    });

    // choose language (EN only for now)
    header.querySelectorAll('#lang-dropdown .lang-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        header.querySelectorAll('#lang-dropdown .lang-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        closeAll(header);
      });
    });

    // Click outside closes
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) closeAll(header);
    });

    // ESC closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll(header);
    });

    // Prevent header from blocking clicks behind when menus closed
    header.addEventListener('click', (e) => e.stopPropagation());
  }

  async function init() {
    try {
      const html = await loadPartial();
      inject(html);
      const header = document.querySelector('#site-header');
      if (header) wire(header);
    } catch (err) {
      console.warn('[header] not loaded:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
