// assets/js/method-sections.js
(() => {
  const sections = Array.from(document.querySelectorAll(".method-section"));
  const dotsNav = document.querySelector(".method-dots");
  const dots = dotsNav ? Array.from(dotsNav.querySelectorAll(".dot")) : [];

  if (!sections.length || !dots.length) return;

  // ---------- Helpers ----------
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

  // ---------- Dot clicks ----------
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetId = dot.getAttribute("data-target");
      const idx = getIndexById(targetId);
      if (idx >= 0) scrollToIndex(idx);
    });
  });

  // ---------- Reliable active section detection ----------
  // Highlights the section that occupies the most "center space" in the viewport.
  const io = new IntersectionObserver(
    (entries) => {
      // Pick the entry with the highest intersection ratio
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const idx = sections.indexOf(visible.target);
      if (idx >= 0) setActiveDot(idx);
    },
    {
      root: null,
      // A few thresholds makes it more stable across devices
      threshold: [0.25, 0.4, 0.55, 0.7],
      // Favor the middle of the screen
      rootMargin: "-20% 0px -45% 0px",
    }
  );

  sections.forEach((s) => io.observe(s));

  // ---------- "Jump" behavior at edges ----------
  // When user scrolls DOWN at the bottom of current section -> jump to next
  // When user scrolls UP at the top of current section -> jump to prev

  let lock = false;
  const LOCK_MS = 650; // prevents double-jumps on touchpads

  const getCurrentIndex = () => {
    // use the active dot as source of truth
    const activeIdx = dots.findIndex((d) => d.classList.contains("is-active"));
    if (activeIdx >= 0) return activeIdx;

    // fallback: closest section top
    const y = window.scrollY;
    let best = 0;
    let bestDist = Infinity;
    sections.forEach((s, i) => {
      const dist = Math.abs(s.offsetTop - y);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  };

  const isAtBottomOfSection = (section) => {
    const rect = section.getBoundingClientRect();
    // bottom is near viewport bottom (allow a little slack)
    return rect.bottom <= window.innerHeight + 8;
  };

  const isAtTopOfSection = (section) => {
    const rect = section.getBoundingClientRect();
    return rect.top >= -8;
  };

  const tryJump = (dir /* 1 down, -1 up */) => {
    if (lock) return;

    const idx = getCurrentIndex();
    const section = sections[idx];
    if (!section) return;

    if (dir === 1) {
      if (!isAtBottomOfSection(section)) return;
      if (idx >= sections.length - 1) return;
      lock = true;
      scrollToIndex(idx + 1);
      setTimeout(() => (lock = false), LOCK_MS);
    } else {
      if (!isAtTopOfSection(section)) return;
      if (idx <= 0) return;
      lock = true;
      scrollToIndex(idx - 1);
      setTimeout(() => (lock = false), LOCK_MS);
    }
  };

  // Wheel (desktop + trackpads)
  window.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) < 5) return;
      const dir = e.deltaY > 0 ? 1 : -1;

      // only hijack scroll when we're at an edge
      const idx = getCurrentIndex();
      const section = sections[idx];
      if (!section) return;

      const shouldJump =
        (dir === 1 && isAtBottomOfSection(section)) ||
        (dir === -1 && isAtTopOfSection(section));

      if (!shouldJump) return;

      e.preventDefault();
      tryJump(dir);
    },
    { passive: false }
  );

  // Touch (mobile): jump on swipe end if you're at an edge
  let touchStartY = 0;

  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (e) => {
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - endY;

      // small swipes ignored
      if (Math.abs(dy) < 30) return;

      const dir = dy > 0 ? 1 : -1;
      tryJump(dir);
    },
    { passive: true }
  );
})();
