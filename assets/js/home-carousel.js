// assets/js/home-carousel.js
(() => {
  function initHomeCarousel() {
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');

    if (!carousel || !prevBtn || !nextBtn || !indicatorsContainer) return;
    if (carousel.dataset.carouselReady === 'true') return;
    carousel.dataset.carouselReady = 'true';

    const featureCards = Array.from(carousel.querySelectorAll('.feature-card-3d'));
    if (!featureCards.length) return;

    const step = 360 / featureCards.length;
    let currentRotation = 0;
    let currentIndex = 0;
    let touchStartX = 0;

    indicatorsContainer.innerHTML = '';

    function updateIndicators() {
      indicatorsContainer.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    }

    function updateActiveCard() {
      featureCards.forEach((card, index) => {
        card.classList.toggle('is-active', index === currentIndex);
      });
    }

    function updateView() {
      carousel.style.transform = `rotateY(${currentRotation}deg)`;
      updateIndicators();
      updateActiveCard();
    }

    function goToSlide(index) {
      currentIndex = ((index % featureCards.length) + featureCards.length) % featureCards.length;
      currentRotation = -currentIndex * step;
      updateView();
    }

    function prev() { goToSlide(currentIndex - 1); }
    function next() { goToSlide(currentIndex + 1); }

    featureCards.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.className = 'indicator';
      indicator.setAttribute('aria-label', `Go to card ${index + 1}`);
      indicator.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        goToSlide(index);
      });
      indicatorsContainer.appendChild(indicator);
    });

    prevBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      prev();
    });

    nextBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
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
