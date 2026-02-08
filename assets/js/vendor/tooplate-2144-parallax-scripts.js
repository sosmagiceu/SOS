/* =========================
   HOME CAROUSEL FIX
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".feature-card-3d");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");

  if (!cards.length) return;

  let activeIndex = 0;

  function updateCarousel() {
    cards.forEach((card, index) => {
      card.classList.remove("active", "left", "right");

      if (index === activeIndex) {
        card.classList.add("active");
      } else if (index === (activeIndex - 1 + cards.length) % cards.length) {
        card.classList.add("left");
      } else if (index === (activeIndex + 1) % cards.length) {
        card.classList.add("right");
      }
    });
  }

  function next() {
    activeIndex = (activeIndex + 1) % cards.length;
    updateCarousel();
  }

  function prev() {
    activeIndex = (activeIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  nextBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    next();
  });

  prevBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    prev();
  });

  /* --- Touch swipe support (mobile) --- */
  let startX = 0;

  cards.forEach((card) => {
    card.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );

    card.addEventListener(
      "touchend",
      (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
          diff > 0 ? next() : prev();
        }
      },
      { passive: true }
    );
  });

  /* --- Prevent whole card acting like a link --- */
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".guide-btn")) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  updateCarousel();
});
