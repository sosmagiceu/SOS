document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("methodGallery");
  if (!viewport) return;

  const root = viewport.closest(".method-gallery");
  const prevBtn = root?.querySelector(".gallery-nav.prev");
  const nextBtn = root?.querySelector(".gallery-nav.next");

  const getStep = () => {
    const first = viewport.querySelector(".gallery-item");
    if (!first) return 320;

    const style = window.getComputedStyle(viewport);
    const gap = parseFloat(style.gap || style.columnGap || "0") || 0;
    return first.getBoundingClientRect().width + gap;
  };

  prevBtn?.addEventListener("click", () => {
    viewport.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  nextBtn?.addEventListener("click", () => {
    viewport.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  // Keyboard support
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") viewport.scrollBy({ left: -getStep(), behavior: "smooth" });
    if (e.key === "ArrowRight") viewport.scrollBy({ left: getStep(), behavior: "smooth" });
  });
});
