// /assets/js/header.js
// Loads /partials/header.html into #header-mount (if present) and wires dropdown menus.

(async function initHeader() {
  // Inject partial if the mount exists and the header isn't already present
  const mount = document.getElementById("header-mount");
  if (mount && !document.getElementById("siteTopbar")) {
    try {
      const res = await fetch("/partials/header.html", { cache: "no-store" });
      if (res.ok) mount.innerHTML = await res.text();
    } catch (_) {}
  }

  const topbar = document.getElementById("siteTopbar");
  if (!topbar) return;

  const buttons = Array.from(topbar.querySelectorAll("[data-menu-btn]"));
  const panels  = Array.from(topbar.querySelectorAll("[data-menu-panel]"));

  function closeAll(exceptKey = null) {
    panels.forEach((p) => {
      const key = p.getAttribute("data-menu-panel");
      if (exceptKey && key === exceptKey) return;
      p.hidden = true;
    });
    buttons.forEach((b) => {
      const key = b.getAttribute("data-menu-btn");
      if (exceptKey && key === exceptKey) return;
      b.setAttribute("aria-expanded", "false");
    });
  }

  function toggle(key) {
    const btn = topbar.querySelector(`[data-menu-btn="${key}"]`);
    const panel = topbar.querySelector(`[data-menu-panel="${key}"]`);
    if (!btn || !panel) return;

    const willOpen = panel.hidden; // current state
    closeAll(willOpen ? key : null);

    panel.hidden = !willOpen;
    btn.setAttribute("aria-expanded", String(willOpen));
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle(btn.getAttribute("data-menu-btn"));
    });
  });

  // Close when clicking outside the topbar
  document.addEventListener("click", (e) => {
    if (!topbar.contains(e.target)) closeAll();
  });

  // Esc closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  // Clicking nav link closes nav panel
  topbar.querySelectorAll('[data-menu-panel="nav"] a').forEach((a) => {
    a.addEventListener("click", () => closeAll());
  });
})();
