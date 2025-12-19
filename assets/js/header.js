// /assets/js/header.js

(async function initHeader() {
  // If you're injecting the header partial elsewhere, keep this safe.
  // If header is already present, no need to fetch.
  if (!document.getElementById("siteTopbar") && document.getElementById("header-mount")) {
    try {
      const res = await fetch("/partials/header.html", { cache: "no-store" });
      const html = await res.text();
      document.getElementById("header-mount").innerHTML = html;
    } catch (e) {
      // If fetch fails, we don't brick the page.
    }
  }

  const topbar = document.getElementById("siteTopbar");
  if (!topbar) return;

  const buttons = topbar.querySelectorAll("[data-menu-btn]");
  const panels = topbar.querySelectorAll("[data-menu-panel]");

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

    const isOpen = !panel.hidden;
    closeAll(isOpen ? null : key);

    panel.hidden = isOpen;
    btn.setAttribute("aria-expanded", String(!isOpen));
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle(btn.getAttribute("data-menu-btn"));
    });
  });

  // close when clicking outside (same feel as globe)
  document.addEventListener("click", (e) => {
    const clickedInside = topbar.contains(e.target);
    if (!clickedInside) closeAll();
  });

  // Esc closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  // Clicking a nav link closes nav menu
  topbar.querySelectorAll('[data-menu-panel="nav"] a').forEach((a) => {
    a.addEventListener("click", () => closeAll());
  });
})();
