// /assets/js/header.js

(async function initHeader() {
  const mount = document.getElementById("header-mount");

  // Inject mobile/tablet background video (once)
  function ensureMobileBgVideo() {
    // Mobile/tablet only
    if (!window.matchMedia("(max-width: 1024px)").matches) return;

    // If already exists, do nothing
    if (document.querySelector(".bg-video-layer")) return;

    const layer = document.createElement("div");
    layer.className = "bg-video-layer";
    layer.innerHTML = `
      <video autoplay muted loop playsinline preload="auto">
        <source src="https://sosmagic.b-cdn.net/Achterground%20enzo/Bubbels_.webm" type="video/webm">
      </video>
    `;

    // Put it as early as possible inside <body> so it sits behind everything
    document.body.prepend(layer);

    // iOS/Safari sometimes needs an explicit play() call even when muted
    const vid = layer.querySelector("video");
    if (vid) {
      const tryPlay = () => {
        const p = vid.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };
      tryPlay();
      document.addEventListener("touchstart", tryPlay, { once: true, passive: true });
    }
  }

  ensureMobileBgVideo();

  // Helper: inject a minimal header so the brand/logo always shows.
  function injectFallbackHeader() {
    if (!mount || document.getElementById("siteTopbar")) return;
    mount.innerHTML = `
      <div class="site-topbar" id="siteTopbar">
        <div class="inner">
          <a class="brand" href="/Home.html" aria-label="SOS Magic Home">
            <img class="brand-logo" src="https://sosmagic.b-cdn.net/Achterground%20enzo/Logo%20.png" alt="" loading="eager" decoding="async">
          </a>
        </div>
      </div>
    `;
  }

  // If header is injected via mount, fetch it. If already present, do nothing.
  if (!document.getElementById("siteTopbar") && mount) {
    try {
      const res = await fetch("/partials/header.html", { cache: "no-store" });
      const html = await res.text();

      // If fetch returns nothing (or not the expected header), fallback.
      if (html && html.includes("siteTopbar")) {
        mount.innerHTML = html;
      } else {
        injectFallbackHeader();
      }
    } catch (e) {
      injectFallbackHeader();
    }
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
      p.setAttribute("aria-hidden", "true");
    });
    buttons.forEach((b) => {
      const key = b.getAttribute("data-menu-btn");
      if (exceptKey && key === exceptKey) return;
      b.setAttribute("aria-expanded", "false");
    });
  }

  function openMenu(key) {
    closeAll(key);
    const btn = topbar.querySelector(`[data-menu-btn="${key}"]`);
    const panel = topbar.querySelector(`[data-menu-panel="${key}"]`);
    if (!btn || !panel) return;

    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
  }

  function scheduleClose(wrap) {
    clearTimeout(closeTimers.get(wrap));
    const t = setTimeout(() => {
      closeAll();
    }, 250);
    closeTimers.set(wrap, t);
  }

  // Click toggles
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const key = btn.getAttribute("data-menu-btn");
      const expanded = btn.getAttribute("aria-expanded") === "true";
      if (expanded) closeAll();
      else openMenu(key);
    });
  });

  // Hover intent (desktop)
  wraps.forEach((wrap) => {
    const btn = wrap.querySelector("[data-menu-btn]");
    if (!btn) return;
    const key = btn.getAttribute("data-menu-btn");

    wrap.addEventListener("mouseenter", () => openMenu(key));
    wrap.addEventListener("mouseleave", () => scheduleClose(wrap));
  });

  // Click outside closes
  document.addEventListener("click", () => closeAll());

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
})();
