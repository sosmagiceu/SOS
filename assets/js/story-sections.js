// assets/js/story-sections.js
(() => {
  const sections = Array.from(document.querySelectorAll(".story-section"));
  const dotsNav = document.querySelector(".story-dots");
  const dots = dotsNav ? Array.from(dotsNav.querySelectorAll(".dot")) : [];

  if (!sections.length || !dots.length) return;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const getIndexById = (id) => sections.findIndex((s) => s.id === id);

  const setActiveDot = (idx) => {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  };

  const scrollToIndex = (idx) => {
    const i = clamp(idx, 0, sections.length - 1);
    sections[i].scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveDot(i);
  };

  // Dot clicks
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetId = dot.getAttribute("data-target");
      const idx = getIndexById(targetId);
      if (idx >= 0) scrollToIndex(idx);
    });
  });

  // Active section detection
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const idx = sections.indexOf(visible.target);
      if (idx >= 0) setActiveDot(idx);
    },
    {
      root: null,
      threshold: [0.25, 0.4, 0.55, 0.7],
      // Slightly tighter than Method to behave better on big desktop viewports.
      rootMargin: "-25% 0px -55% 0px",
    }
  );

  sections.forEach((s) => io.observe(s));
})();
