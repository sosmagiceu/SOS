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
    let swiped = false;

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

    // Rotate the shortest way round to any card.
    function goTo(index) {
      let delta = index - currentIndex;
      if (delta > featureCards.length / 2) delta -= featureCards.length;
      if (delta < -featureCards.length / 2) delta += featureCards.length;
      currentIndex = index;
      currentRotation -= delta * step;
      updateView();
    }

    carousel.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].screenX;
      swiped = false;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
      const touchEndX = event.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) { swiped = true; next(); }
      if (touchEndX > touchStartX + 50) { swiped = true; prev(); }
    }, { passive: true });

    featureCards.forEach((card, index) => {
      card.addEventListener('click', (event) => {
        // A swipe ends in a click too — that one must not navigate.
        if (swiped) {
          swiped = false;
          event.preventDefault();
          return;
        }

        // The button is a real link; let it do its own job.
        if (event.target.closest('.guide-btn')) return;

        event.preventDefault();

        // Only the card facing the viewer navigates. The ones turned away are
        // easy to hit by accident, so they just rotate to the front instead.
        if (index !== currentIndex) {
          goTo(index);
          return;
        }

        const link = card.querySelector('.guide-btn');
        if (link) window.location.href = link.href;
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
