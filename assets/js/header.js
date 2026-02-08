// /assets/js/header.js

(async function initHeader() {
  const mount = document.getElementById("header-mount");

  /* ---------- MOBILE/TABLET BACKGROUND VIDEO ---------- */
  function ensureMobileBgVideo() {
    // Alleen echte touch devices (mobile + tablet)
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    // Niet dubbel injecteren
    if (document.querySelector(".bg-video-layer")) return;

    const layer = document.createElement("div");
    layer.className = "bg-video-layer";

    const video = document.createElement("video");
    video.className = "bg-video";
    video.autoplay = true;
    video.muted = true;        // verplicht voor autoplay op iOS
    video.loop = true;
    video.playsInline = true; // essentieel voor iOS
    video.setAttribute("webkit-playsinline", "");

    const source = document.createElement("source");
    source.src = "https://sosmagic.b-cdn.net/Achterground%20enzo/Bubbels_.mp4";
    source.type = "video/mp4";

    video.appendChild(source);
    layer.appendChild(video);

    document.body.prepend(layer);

    // iOS fallback: force play
    video.addEventListener("loadeddata", () => {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    });
  }

  ensureMobileBgVideo();

  /* ---------- INJECT HEADER ---------- */
  function injectFallbackHeader() {
    mount.innerHTML = `
      <header id="siteTopbar" class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="/Home.html" aria-label="Home">
            <span class="brand-text">SOS MAGIC</span>
          </a>
        </div>
      </header>
    `;
  }

  if (!document.getElementById("siteTopbar") && mount) {
    try {
      const res = await fetch("/partials/header.html", { cache: "no-store" });
      const html = await res.text();

      if (html && html.includes("siteTopbar")) {
        mount.innerHTML = html;
      } else {
        injectFallbackHeader();
      }
    } catch {
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
    panels.forEach(p => {
      const key = p.getAttribute("data-menu-panel");
      if (exceptKey && key === exceptKey) return;
      p.hidden = true;
      p.setAttribute("aria-hidden", "true");
    });
    buttons.forEach(b => {
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
    const t = setTimeout(() => closeAll(), 250);
    closeTimers.set(wrap, t);
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const key = btn.getAttribute("data-menu-btn");
      const expanded = btn.getAttribute("aria-expanded") === "true";
      expanded ? closeAll() : openMenu(key);
    });
  });

  wraps.forEach(wrap => {
    const btn = wrap.querySelector("[data-menu-btn]");
    if (!btn) return;
    const key = btn.getAttribute("data-menu-btn");
    const panel = topbar.querySelector(`[data-menu-panel="${key}"]`);

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (canHover) {
      wrap.addEventListener("mouseenter", () => {
        clearTimeout(closeTimers.get(wrap));
        openMenu(key);
      });
      wrap.addEventListener("mouseleave", () => scheduleClose(wrap));

      if (panel) {
        panel.addEventListener("mouseenter", () => {
          clearTimeout(closeTimers.get(wrap));
          openMenu(key);
        });
        panel.addEventListener("mouseleave", () => scheduleClose(wrap));
      }
    }
  });

  document.addEventListener("click", () => closeAll());
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAll();
  });
})();
