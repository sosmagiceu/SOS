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

    // Toggle fallback based on real playback state
    video.addEventListener("play", () => document.body.classList.add("bg-video-ready"));
    video.addEventListener("pause", () => document.body.classList.remove("bg-video-ready"));
    video.addEventListener("ended", () => document.body.classList.remove("bg-video-ready"));


    // iOS fallback: force play
    video.addEventListener("loadeddata", () => {
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          document.body.classList.add("bg-video-ready");
        }).catch(() => {
          // keep PNG fallback visible
          document.body.classList.remove("bg-video-ready");
        });
      } else {
        // Older browsers: best effort
        document.body.classList.add("bg-video-ready");
      }
    });
}

  ensureMobileBgVideo();

  window.addEventListener("resize", ensureMobileBgVideo, { passive: true });
  window.addEventListener("orientationchange", ensureMobileBgVideo, { passive: true });

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

  /* ---------- CLEANUP: STRAY TOP-LEFT FILENAME LABEL ---------- */
  function cleanupStrayFilenameLabel() {
    try {
      const file = (window.location && window.location.pathname)
        ? window.location.pathname.split("/").pop()
        : "";
      if (!file || !/\.html$/i.test(file)) return;

      // Remove any elements whose ONLY visible text equals the filename
      document.querySelectorAll("body *").forEach(el => {
        if (el.children && el.children.length) return;
        const txt = (el.textContent || "").trim();
        if (txt === file) el.remove();
      });

      // Remove any direct text nodes under body that match the filename
      Array.from(document.body.childNodes).forEach(n => {
        if (n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim() === file) {
          n.textContent = "";
        }
      });
    } catch (e) {
      // do nothing
    }
  }

  // Run after header injection and after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cleanupStrayFilenameLabel);
  } else {
    cleanupStrayFilenameLabel();
  }

})();
