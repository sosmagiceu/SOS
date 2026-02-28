// assets/js/story-sections.js
(() => {
  const sections = Array.from(document.querySelectorAll(".story-section"));
  const dotsNav = document.querySelector(".story-dots");
  const dots = dotsNav ? Array.from(dotsNav.querySelectorAll(".dot")) : [];

  if (!sections.length || !dots.length) return;

  const setActiveDotById = (sectionId) => {
    dots.forEach((d) => d.classList.toggle("is-active", d.getAttribute("data-target") === sectionId));
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveDotById(id);
  };

  // Dot clicks
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetId = dot.getAttribute("data-target");
      if (targetId) scrollToId(targetId);
    });
  });

  // Active section detection
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      if (visible.target && visible.target.id) setActiveDotById(visible.target.id);
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
