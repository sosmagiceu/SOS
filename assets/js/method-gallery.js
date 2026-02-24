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

  // -----------------------------
  // Infinite loop (seamless-ish)
  // -----------------------------
  // We clone:
  //   [last N] + [real N] + [first N]
  // Then we start on the first real item (index N).
  // While scrolling, if we drift into clone zones we shift scrollLeft by exactly one cycle width.
  // Important: we keep CSS scroll-behavior as AUTO so the normalization is invisible.

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

    // Center item
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
    // Distance between first real item and the equivalent item in the appended clone block
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

  const normalize = () => {
    if (!cycleWidth) return;

    const sidePad = getSidePad();
    const firstReal = items[n];
    const firstAppendedClone = items[n * 2];

    if (!firstReal || !firstAppendedClone) return;

    // Boundaries where "empty padding space" tends to appear.
    // If we ever end up there, yank back into the real zone immediately.
    const leftEdge = firstReal.offsetLeft - sidePad;
    const rightEdge = firstAppendedClone.offsetLeft - sidePad;

    // If we're in the left clone zone, jump forward one cycle.
    if (viewport.scrollLeft <= leftEdge + 1) {
      viewport.scrollLeft += cycleWidth;
      return;
    }

    // If we're in the right clone zone, jump backward one cycle.
    if (viewport.scrollLeft >= rightEdge - 1) {
      viewport.scrollLeft -= cycleWidth;
      return;
    }
  };

  // Buttons
  prevBtn?.addEventListener("click", () => {
    centerOnIndex(getActiveIndex() - 1, "smooth");
  });

  nextBtn?.addEventListener("click", () => {
    centerOnIndex(getActiveIndex() + 1, "smooth");
  });

  // Keyboard support
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      centerOnIndex(getActiveIndex() - 1, "smooth");
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      centerOnIndex(getActiveIndex() + 1, "smooth");
    }
  });

  // Normalize during manual scrolling (rAF for performance)
  let rafId = 0;
  viewport.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(normalize);
    },
    { passive: true }
  );

  // Resize
  window.addEventListener(
    "resize",
    () => {
      measure();
      // Keep the currently active item centered after resize
      const idx = getActiveIndex();
      centerOnIndex(idx, "auto");
      normalize();
    },
    { passive: true }
  );

  // INIT:
  // The "starts on empty frame" issue is usually because offsets are 0 before images/fonts settle.
  // So we init on window load AND also retry a few frames until we have a usable cycleWidth.
  const init = () => {
    viewport.style.scrollBehavior = "auto"; // kills visible jumps during normalization
    measure();

    let tries = 0;
    const tick = () => {
      measure();
      if (cycleWidth > 0 || tries > 20) {
        // Start centered on first REAL item
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
  // fallback in case load already fired
  if (document.readyState === "complete") init();
});
