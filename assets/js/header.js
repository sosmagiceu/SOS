// /assets/js/header.js

(async function initHeader() {
  const mount = document.getElementById("header-mount");

  /* ---------- MOBILE/TABLET BACKGROUND VIDEO ---------- */
  function ensureMobileBgVideo() {
    if (!window.matchMedia("(max-width: 1024px)").matches) return;
    if (document.querySelector(".bg-video-layer")) return;

    const layer = document.createElement("div");
    layer.className = "bg-video-layer";

    const video = document.createElement("video");
    video.className = "bg-video";
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const source = document.createElement("source");
    source.src = "https://sosmagic.b-cdn.net/videos/homebg.mp4";
    source.type = "video/mp4";

    video.appendChild(source);
    layer.appendChild(video);

    document.body.prepend(layer);
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

    // Desktop hover: keep menu open while hovering button OR panel.
    // Panels are often absolutely positioned outside the wrap's box, so
    // relying on wrap mouseleave will close the menu the moment you move into the panel.
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

  // Close if you click outside (desktop) / tap outside (mobile)
  document.addEventListener("click", () => closeAll());
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAll();
  });
})();
