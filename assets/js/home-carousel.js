// assets/js/home-carousel.js
(() => {
  function initHomeCarousel() {
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!carousel || !prevBtn || !nextBtn) return;
    if (carousel.dataset.carouselReady === 'true') return;
    carousel.dataset.carouselReady = 'true';

    const featureCards = Array.from(carousel.querySelectorAll('.feature-card-3d'));
    if (!featureCards.length) return;

    const step = 360 / featureCards.length;
    let currentRotation = 0;
    let currentIndex = 0;
    let touchStartX = 0;

    function updateActiveCard() {
      featureCards.forEach((card, index) => {
        card.classList.toggle('is-active', index === currentIndex);
      });
    }

    function updateView() {
      carousel.style.transform = `rotateY(${currentRotation}deg)`;
      updateActiveCard();
    }

    function prev() {
      currentIndex = (currentIndex - 1 + featureCards.length) % featureCards.length;
      currentRotation += step;
      updateView();
    }

    function next() {
      currentIndex = (currentIndex + 1) % featureCards.length;
      currentRotation -= step;
      updateView();
    }

    prevBtn.addEventListener('click', (event) => {
      event.preventDefault();
      prev();
    });

    nextBtn.addEventListener('click', (event) => {
      event.preventDefault();
      next();
    });

    carousel.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
      const touchEndX = event.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) next();
      if (touchEndX > touchStartX + 50) prev();
    }, { passive: true });

    featureCards.forEach((card) => {
      card.addEventListener('click', (event) => {
        if (!event.target.closest('.guide-btn')) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    });

    updateView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeCarousel, { once: true });
  } else {
    initHomeCarousel();
  }
})();
