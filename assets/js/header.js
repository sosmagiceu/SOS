// /assets/js/header.js

(async function initHeader() {
  // If header is injected via mount, fetch it. If already present, do nothing.
  if (!document.getElementById("siteTopbar") && document.getElementById("header-mount")) {
    try {
      const res = await fetch("/partials/header.html", { cache: "no-store" });
      const html = await res.text();
      document.getElementById("header-mount").innerHTML = html;
    } catch (e) {}
  }

  const topbar = document.getElementById("siteTopbar");
  if (!topbar) return;

  const buttons = topbar.querySelectorAll("[data-menu-btn]");
  const panels = topbar.querySelectorAll("[data-menu-panel]");
  const wraps = topbar.querySelectorAll("[data-menu-wrap]");

  const closeTimers = new WeakMap();

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

  // Button click toggles
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle(btn.getAttribute("data-menu-btn"));
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!topbar.contains(e.target)) closeAll();
  });

  // Esc closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  // Auto-close when no longer hovered (per wrap)
  wraps.forEach((wrap) => {
    const clear = () => {
      const t = closeTimers.get(wrap);
      if (t) {
        clearTimeout(t);
        closeTimers.delete(wrap);
      }
    };

    wrap.addEventListener("pointerenter", clear);

    wrap.addEventListener("pointerleave", () => {
      clear();

      // Small delay prevents flicker when moving between button and panel edges
      const timer = setTimeout(() => {
        // Close only if neither the wrap is hovered nor a button inside is focused
        const active = document.activeElement;
        const focusedInside = active && wrap.contains(active);
        if (!wrap.matches(":hover") && !focusedInside) closeAll();
      }, 140);

      closeTimers.set(wrap, timer);
    });
  });

  // Clicking a nav link closes nav menu
  topbar.querySelectorAll('[data-menu-panel="nav"] a').forEach((a) => {
    a.addEventListener("click", () => closeAll());
  });
})();
