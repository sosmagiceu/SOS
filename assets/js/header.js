// /assets/js/header.js
// Loads /partials/header.html into #header-mount on every page,
// then wires: globe dropdown + hamburger drawer. One header. One braincell.

(function () {
  const PARTIAL_URL = "/partials/header.html";

  function qs(sel, root = document) { return root.querySelector(sel); }

  function ensureMount() {
    let mount = qs("#header-mount");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "header-mount";
      document.body.insertAdjacentElement("afterbegin", mount);
    }
    return mount;
  }

  async function injectHeader() {
    const mount = ensureMount();
    // If header already injected, don't do it twice.
    if (mount.dataset.loaded === "true") return mount;

    const res = await fetch(PARTIAL_URL, { cache: "no-store" });
    const html = await res.text();
    mount.innerHTML = html;
    mount.dataset.loaded = "true";
    return mount;
  }

  function setExpanded(btn, expanded) {
    if (!btn) return;
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  function initHeaderUI(root = document) {
    const drawer = qs("#topbarDrawer", root);
    const overlay = qs("[data-drawer-overlay]", root);
    const hamBtn = qs(".hamburger-btn", root);
    const closeBtn = qs(".drawer-close", root);

    const langBtn = qs(".lang-btn", root);
    const langMenu = qs("#langMenu", root);

    // Hard reset states (prevents "always open" caused by random CSS)
    if (drawer) drawer.hidden = true;
    if (overlay) overlay.hidden = true;
    if (langMenu) langMenu.hidden = true;
    setExpanded(hamBtn, false);
    setExpanded(langBtn, false);

    function openDrawer() {
      if (!drawer || !overlay) return;
      drawer.hidden = false;
      overlay.hidden = false;
      setExpanded(hamBtn, true);
      document.body.classList.add("drawer-open");
    }
    function closeDrawer() {
      if (!drawer || !overlay) return;
      drawer.hidden = true;
      overlay.hidden = true;
      setExpanded(hamBtn, false);
      document.body.classList.remove("drawer-open");
    }
    function toggleDrawer() { (drawer && drawer.hidden) ? openDrawer() : closeDrawer(); }

    function openLang() {
      if (!langMenu) return;
      langMenu.hidden = false;
      setExpanded(langBtn, true);
    }
    function closeLang() {
      if (!langMenu) return;
      langMenu.hidden = true;
      setExpanded(langBtn, false);
    }
    function toggleLang() { (langMenu && langMenu.hidden) ? openLang() : closeLang(); }

    hamBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      closeLang();
      toggleDrawer();
    });

    closeBtn?.addEventListener("click", (e) => { e.preventDefault(); closeDrawer(); });
    overlay?.addEventListener("click", () => { closeDrawer(); closeLang(); });

    langBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
      toggleLang();
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeDrawer(); closeLang(); }
    });

    // Close language menu on outside click
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (langBtn && langMenu) {
        const inLang = langBtn.contains(t) || langMenu.contains(t);
        if (!inLang) closeLang();
      }
    }, { passive: true });

    // Language selection hook (doesn't translate content magically, because reality)
    langMenu?.addEventListener("click", (e) => {
      const btn = e.target.closest(".lang-option");
      if (!btn) return;
      const code = (btn.dataset.lang || "en").toLowerCase();
      try { localStorage.setItem("lang", code); } catch {}
      // visual active state
      langMenu.querySelectorAll(".lang-option").forEach(b => b.classList.toggle("is-active", b === btn));
      closeLang();
      // broadcast for any page-specific scripts
      try { window.dispatchEvent(new CustomEvent("sos:lang", { detail: { code } })); } catch {}
    });

    // Restore active language button state
    try {
      const saved = (localStorage.getItem("lang") || "en").toLowerCase();
      const active = langMenu?.querySelector(`.lang-option[data-lang="${saved}"]`);
      if (active) active.classList.add("is-active");
    } catch {}
  }

  async function boot() {
    try {
      const mount = await injectHeader();
      initHeaderUI(mount);
    } catch (err) {
      // If header can't load, site still renders. Humans love broken nav.
      console.warn("Header inject failed:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
