// assets/js/story-slides.js
// Lightweight slide carousel: snap scrolling + arrows + dots.

document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.getElementById("storySlides");
  if (!viewport) return;

  const root = viewport.closest(".story-slides");
  const prevBtn = root?.querySelector(".slides-controls .slides-nav.prev");
  const nextBtn = root?.querySelector(".slides-controls .slides-nav.next");
  const dotsMount = document.getElementById("storySlidesDots");

  const slides = Array.from(viewport.querySelectorAll(".story-slide"));
  if (slides.length < 2) return;

  const centerOnIndex = (idx, behavior = "smooth") => {
    const i = Math.max(0, Math.min(slides.length - 1, idx));
    const el = slides[i];
    const target = el.offsetLeft + el.offsetWidth / 2 - viewport.clientWidth / 2;
    viewport.scrollTo({ left: target, behavior });
  };

  const getActiveIndex = () => {
    const viewCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      const c = s.offsetLeft + s.offsetWidth / 2;
      const d = Math.abs(c - viewCenter);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  // Build dots
  const dots = [];
  if (dotsMount) {
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sdot";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => centerOnIndex(i));
      dotsMount.appendChild(b);
      dots.push(b);
    });
  }

  const setActiveDot = (idx) => {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  };

  // Buttons
  prevBtn?.addEventListener("click", () => centerOnIndex(getActiveIndex() - 1));
  nextBtn?.addEventListener("click", () => centerOnIndex(getActiveIndex() + 1));

  // Keyboard
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

  // Keep dots synced
  let rafId = 0;
  viewport.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setActiveDot(getActiveIndex()));
    },
    { passive: true }
  );

  // Tame wheel/trackpad: one gesture = one slide (prevents hyperspeed on desktop)
  let wheelLock = false;
  viewport.addEventListener(
    "wheel",
    (e) => {
      // Only intercept vertical intent
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (wheelLock) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      wheelLock = true;
      const dir = e.deltaY > 0 ? 1 : -1;
      centerOnIndex(getActiveIndex() + dir);
      setTimeout(() => (wheelLock = false), 420);
    },
    { passive: false }
  );

  // Init
  const init = () => {
    setActiveDot(0);
    centerOnIndex(0, "auto");
  };
  window.addEventListener("load", init, { once: true });
  if (document.readyState === "complete") init();
});
