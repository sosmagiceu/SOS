document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("methodGallery");
  if (!viewport) return;

  const root = viewport.closest(".method-gallery");
  const prevBtn = root?.querySelector(".gallery-controls .gallery-nav.prev");
  const nextBtn = root?.querySelector(".gallery-controls .gallery-nav.next");

  const getItems = () => Array.from(viewport.querySelectorAll(".gallery-item"));
  const originals = getItems();
  const n = originals.length;
  if (n < 2) return;

  // ------------------------------------------------------------
  // Infinite loop (both directions) with clones:
  //   [last N clones] + [real N] + [first N clones]
  // We keep scroll-behavior AUTO for normalization so it's invisible.
  // ------------------------------------------------------------

  const cloneItem = (node) => {
    const c = node.cloneNode(true);
    c.classList.add("is-clone");
    c.setAttribute("aria-hidden", "true");
    c.setAttribute("tabindex", "-1");
    return c;
  };

  // Prepend clones of last N (keep order)
  for (let i = n - 1; i >= 0; i--) {
    viewport.insertBefore(cloneItem(originals[i]), viewport.firstChild);
  }
  // Append clones of first N
  for (let i = 0; i < n; i++) {
    viewport.appendChild(cloneItem(originals[i]));
  }

  let items = getItems();

  const getSidePad = () => {
    const cs = getComputedStyle(viewport);
    const pl = parseFloat(cs.paddingLeft || "0");
    return Number.isFinite(pl) ? pl : 0;
  };

  const centerOnIndex = (idx, behavior = "smooth") => {
    const el = items[idx];
    if (!el) return;

    const target = el.offsetLeft + el.offsetWidth / 2 - viewport.clientWidth / 2;
    viewport.scrollTo({ left: target, behavior });
  };

  const getActiveIndex = () => {
    const viewCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const c = it.offsetLeft + it.offsetWidth / 2;
      const d = Math.abs(c - viewCenter);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  const getCycleWidth = () => {
    const firstReal = items[n];
    const firstAppendedClone = items[n * 2];
    if (!firstReal || !firstAppendedClone) return 0;
    return firstAppendedClone.offsetLeft - firstReal.offsetLeft;
  };

  let cycleWidth = 0;

  const measure = () => {
    items = getItems();
    cycleWidth = getCycleWidth();
  };

  // Snap-safe normalization: if you drift into clone zones, jump by one cycle width.
  // We normalize based on scrollLeft boundaries, not active index, so it works for drag + wheel + buttons.
  const normalize = () => {
    if (!cycleWidth) return;

    const sidePad = getSidePad();
    const firstReal = items[n];
    const firstAppendedClone = items[n * 2];
    if (!firstReal || !firstAppendedClone) return;

    const leftEdge = firstReal.offsetLeft - sidePad;
    const rightEdge = firstAppendedClone.offsetLeft - sidePad;

    // Left clone zone -> jump forward one cycle
    if (viewport.scrollLeft <= leftEdge + 1) {
      viewport.scrollLeft += cycleWidth;
      return;
    }

    // Right clone zone -> jump backward one cycle
    if (viewport.scrollLeft >= rightEdge - 1) {
      viewport.scrollLeft -= cycleWidth;
      return;
    }
  };

  // ------------------------------------------------------------
  // Scroll end detection: normalize only AFTER scrolling settles,
  // so we don't fight scroll-snap / smooth scrolling (aka: visible jumping).
  // ------------------------------------------------------------
  let scrollEndTimer = 0;
  const scheduleNormalize = () => {
    clearTimeout(scrollEndTimer);
    scrollEndTimer = window.setTimeout(() => {
      // Force instant correction
      viewport.style.scrollBehavior = "auto";
      normalize();
    }, 110);
  };

  viewport.addEventListener(
    "scroll",
    () => {
      scheduleNormalize();
    },
    { passive: true }
  );

  // ------------------------------------------------------------
  // Wheel / trackpad control: one gesture = one slide
  // ------------------------------------------------------------
  // Many touchpads emit a flood of wheel events. We:
  // - prevent default scrolling on this container
  // - accumulate delta until threshold
  // - then advance exactly one item (dir = sign)
  let wheelAcc = 0;
  let wheelLock = false;
  const WHEEL_THRESHOLD = 60;
  const WHEEL_LOCK_MS = 380;

  const onWheel = (e) => {
    // Let ctrl+wheel zoom do its thing.
    if (e.ctrlKey) return;

    // Only take over if this element can scroll horizontally (it can).
    e.preventDefault();

    if (wheelLock) return;

    const dx = e.deltaX || 0;
    const dy = e.deltaY || 0;

    // Use the dominant axis (so vertical wheel also moves the carousel)
    const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;

    wheelAcc += delta;

    if (Math.abs(wheelAcc) < WHEEL_THRESHOLD) return;

    const dir = wheelAcc > 0 ? 1 : -1;
    wheelAcc = 0;
    wheelLock = true;

    const idx = getActiveIndex();
    centerOnIndex(idx + dir, "smooth");

    // When the smooth snap settles, normalize invisibly.
    window.setTimeout(() => {
      viewport.style.scrollBehavior = "auto";
      normalize();
      wheelLock = false;
    }, WHEEL_LOCK_MS);
  };

  viewport.addEventListener("wheel", onWheel, { passive: false });

  // Buttons: move 1 slide per click
  prevBtn?.addEventListener("click", () => {
    const idx = getActiveIndex();
    centerOnIndex(idx - 1, "smooth");
    scheduleNormalize();
  });

  nextBtn?.addEventListener("click", () => {
    const idx = getActiveIndex();
    centerOnIndex(idx + 1, "smooth");
    scheduleNormalize();
  });

  // Keyboard
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      centerOnIndex(getActiveIndex() - 1, "smooth");
      scheduleNormalize();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      centerOnIndex(getActiveIndex() + 1, "smooth");
      scheduleNormalize();
    }
  });

  // Resize: keep current item centered
  window.addEventListener(
    "resize",
    () => {
      measure();
      const idx = getActiveIndex();
      centerOnIndex(idx, "auto");
      viewport.style.scrollBehavior = "auto";
      normalize();
    },
    { passive: true }
  );

  // Init after layout is stable (images/fonts)
  const init = () => {
    viewport.style.scrollBehavior = "auto";
    measure();

    let tries = 0;
    const tick = () => {
      measure();
      if (cycleWidth > 0 || tries > 24) {
        // Start on first REAL item (picture 1)
        centerOnIndex(n, "auto");
        normalize();
        return;
      }
      tries++;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  window.addEventListener("load", init, { once: true });
  if (document.readyState === "complete") init();
});
