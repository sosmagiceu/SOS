document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("methodGallery");
  if (!viewport) return;

  const root = viewport.closest(".method-gallery");
  const prevBtn = root?.querySelector(".gallery-controls .gallery-nav.prev");
  const nextBtn = root?.querySelector(".gallery-controls .gallery-nav.next");
  const items = Array.from(viewport.querySelectorAll(".gallery-item"));
  if (!items.length) return;

  const getActiveIndex = () => {
    const viewRect = viewport.getBoundingClientRect();
    const viewCenter = viewRect.left + viewRect.width / 2;

    let bestIdx = 0;
    let bestDist = Infinity;

    items.forEach((item, idx) => {
      const r = item.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(center - viewCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    return bestIdx;
  };

  const scrollToIndex = (idx) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    items[clamped].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  prevBtn?.addEventListener("click", () => {
    const idx = getActiveIndex();
    scrollToIndex(idx - 1);
  });

  nextBtn?.addEventListener("click", () => {
    const idx = getActiveIndex();
    scrollToIndex(idx + 1);
  });

  // Keyboard support
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(getActiveIndex() - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(getActiveIndex() + 1);
    }
  });

  // On load, snap to first item cleanly (prevents half offsets)
  requestAnimationFrame(() => scrollToIndex(0));
});
