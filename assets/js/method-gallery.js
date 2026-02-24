document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("methodGallery");
  if (!viewport) return;

  const root = viewport.closest(".method-gallery");
  const prevBtn = root?.querySelector(".gallery-controls .gallery-nav.prev");
  const nextBtn = root?.querySelector(".gallery-controls .gallery-nav.next");

  const getItems = () => Array.from(viewport.querySelectorAll(".gallery-item"));
  const originalItems = getItems();
  const n = originalItems.length;
  if (n < 2) return;

  // ------------------------------------------------------------
  // Infinite loop strategy:
  // - prepend clones of the last N items
  // - append clones of the first N items
  // - start centered on the first "real" item (index N)
  // - when user scrolls into clone zones, jump scrollLeft by one cycle width
  // ------------------------------------------------------------

  const cloneItem = (node) => {
    const c = node.cloneNode(true);
    c.classList.add("is-clone");
    // Keep clones from stealing focus in weird ways
    c.setAttribute("tabindex", "-1");
    return c;
  };

  // Prepend last N (in order)
  for (let i = n - 1; i >= 0; i--) {
    viewport.insertBefore(cloneItem(originalItems[i]), viewport.firstChild);
  }
  // Append first N (in order)
  for (let i = 0; i < n; i++) {
    viewport.appendChild(cloneItem(originalItems[i]));
  }

  // Refresh list after cloning
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

    items.forEach((item, idx) => {
      const center = item.offsetLeft + item.offsetWidth / 2;
      const dist = Math.abs(center - viewCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    return bestIdx;
  };

  // Cycle width = distance between the first real item and the first appended clone (same image)
  const getCycleWidth = () => {
    const firstReal = items[n];
    const firstAppendedClone = items[n * 2];
    if (!firstReal || !firstAppendedClone) return 0;
    return firstAppendedClone.offsetLeft - firstReal.offsetLeft;
  };

  let cycleWidth = 0;
  const measure = () => {
    // re-cache in case layout changed
    items = getItems();
    cycleWidth = getCycleWidth();
  };

  const normalizeIfNeeded = () => {
    if (!cycleWidth) return;

    const firstReal = items[n];
    const firstAppendedClone = items[n * 2];
    const lastReal = items[n * 2 - 1];

    // If we drift into the left clone zone, jump forward one cycle.
    if (viewport.scrollLeft < firstReal.offsetLeft - 10) {
      viewport.scrollLeft += cycleWidth;
      return;
    }

    // If we drift into the right clone zone, jump back one cycle.
    if (viewport.scrollLeft > firstAppendedClone.offsetLeft - 10) {
      viewport.scrollLeft -= cycleWidth;
      return;
    }

    // Safety: if something gets weird and we go past the last real, normalize.
    if (viewport.scrollLeft > lastReal.offsetLeft + lastReal.offsetWidth) {
      viewport.scrollLeft -= cycleWidth;
    }
  };

  // Buttons
  prevBtn?.addEventListener("click", () => {
    const idx = getActiveIndex();
    centerOnIndex(idx - 1);
  });

  nextBtn?.addEventListener("click", () => {
    const idx = getActiveIndex();
    centerOnIndex(idx + 1);
  });

  // Keyboard support
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      centerOnIndex(getActiveIndex() - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      centerOnIndex(getActiveIndex() + 1);
    }
  });

  // Normalize during manual scrolling
  let rafId = 0;
  viewport.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(normalizeIfNeeded);
    },
    { passive: true }
  );

  // Handle resize
  window.addEventListener(
    "resize",
    () => {
      measure();
      // Keep a sane centered position on resize
      centerOnIndex(getActiveIndex(), "auto");
    },
    { passive: true }
  );

  // Initial measure + start at first real item
  requestAnimationFrame(() => {
    measure();
    centerOnIndex(n, "auto");
  });
});
