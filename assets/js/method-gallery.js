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

  // Make sure any CSS 'scroll-behavior: smooth' doesn't make the loop correction visible.
  viewport.style.scrollBehavior = "auto";

  // ---- clones for infinite loop: [last N] + [real N] + [first N]
  const cloneItem = (node) => {
    const c = node.cloneNode(true);
    c.classList.add("is-clone");
    c.setAttribute("aria-hidden", "true");
    c.setAttribute("tabindex", "-1");
    return c;
  };

  // Prepend clones of last N (in order)
  for (let i = n - 1; i >= 0; i--) {
    viewport.insertBefore(cloneItem(originals[i]), viewport.firstChild);
  }
  // Append clones of first N
  for (let i = 0; i < n; i++) {
    viewport.appendChild(cloneItem(originals[i]));
  }

  let items = getItems();

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
    // distance between first real and its copy in the appended clone block
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

  // Seamless normalization:
  // If the active item is inside the left clone block (idx < n), jump forward one cycle.
  // If inside the right clone block (idx >= 2n), jump backward one cycle.
  // Because clones are identical, this should be visually seamless.
  const normalize = () => {
    if (!cycleWidth) return;

    const idx = getActiveIndex();

    // NOTE: Do NOT do this with smooth scrolling. It must be instant.
    if (idx < n) {
      viewport.scrollLeft += cycleWidth;
    } else if (idx >= 2 * n) {
      viewport.scrollLeft -= cycleWidth;
    }
  };

  // -----------------------------
  // Wheel / trackpad: 1 gesture = 1 slide
  // -----------------------------
  // Browsers fire a storm of wheel events on touchpads.
  // We accumulate until a threshold and then move exactly one item.
  let wheelAcc = 0;
  let wheelLock = false;
  const WHEEL_THRESHOLD = 40; // px-ish
  const WHEEL_LOCK_MS = 420;

  const onWheel = (e) => {
    // Only handle horizontal intent:
    // - deltaX clearly bigger than deltaY
    // - OR user is doing shift+wheel (often horizontal)
    const dx = e.deltaX;
    const dy = e.deltaY;
    const wantsHorizontal = Math.abs(dx) > Math.abs(dy) || e.shiftKey;

    if (!wantsHorizontal) return;

    // Stop native scroll, we'll do controlled steps
    e.preventDefault();

    if (wheelLock) return;

    wheelAcc += (Math.abs(dx) > 0 ? dx : dy);

    if (Math.abs(wheelAcc) < WHEEL_THRESHOLD) return;

    const dir = wheelAcc > 0 ? 1 : -1;
    wheelAcc = 0;
    wheelLock = true;

    const idx = getActiveIndex();
    centerOnIndex(idx + dir, "smooth");

    // allow the scroll-snap to settle, then normalize
    setTimeout(() => {
      normalize();
      wheelLock = false;
    }, WHEEL_LOCK_MS);
  };

  viewport.addEventListener("wheel", onWheel, { passive: false });

  // Buttons
  prevBtn?.addEventListener("click", () => {
    const idx = getActiveIndex();
    centerOnIndex(idx - 1, "smooth");
    setTimeout(normalize, 420);
  });

  nextBtn?.addEventListener("click", () => {
    const idx = getActiveIndex();
    centerOnIndex(idx + 1, "smooth");
    setTimeout(normalize, 420);
  });

  // Keyboard
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const idx = getActiveIndex();
      centerOnIndex(idx - 1, "smooth");
      setTimeout(normalize, 420);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const idx = getActiveIndex();
      centerOnIndex(idx + 1, "smooth");
      setTimeout(normalize, 420);
    }
  });

  // Normalize while user drags/swipes
  let raf = 0;
  viewport.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(normalize);
    },
    { passive: true }
  );

  // Resize: keep current item centered
  window.addEventListener(
    "resize",
    () => {
      measure();
      const idx = getActiveIndex();
      centerOnIndex(idx, "auto");
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
