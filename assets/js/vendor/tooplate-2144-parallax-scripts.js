// JavaScript Document
/*
Tooplate 2144 SOS Magic
https://www.tooplate.com/view/2144-parallax-depth
*/

// Parallax scrolling effect
const layers = document.querySelectorAll('.parallax-layer');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;

  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
    heroContent.style.opacity = 1 - (scrolled / 800);
  }

  if (scrolled < window.innerHeight) {
    layers.forEach((layer, index) => {
      const speed = (index + 1) * 0.2;
      layer.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }
});

// Interactive hover effects for rectangles (only .rect, not carousel cards)
document.querySelectorAll('.rect').forEach(rect => {
  rect.addEventListener('mousemove', (e) => {
    const boundingRect = rect.getBoundingClientRect();
    const x = e.clientX - boundingRect.left;
    const y = e.clientY - boundingRect.top;

    const centerX = boundingRect.width / 2;
    const centerY = boundingRect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    rect.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  rect.addEventListener('mouseleave', () => {
    rect.style.transform = '';
  });
});

// 3D Carousel Controls (Home)
if (!window.__sos3dCarouselInit) {
  window.__sos3dCarouselInit = true;

  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('indicators');

  // Only init when carousel exists
  if (carousel && prevBtn && nextBtn && indicatorsContainer) {
    const featureCards = carousel.querySelectorAll('.feature-card-3d');
    const step = featureCards.length ? (360 / featureCards.length) : 60;

    let currentRotation = 0;
    let currentIndex = 0;

    // Build indicators
    indicatorsContainer.innerHTML = '';
    featureCards.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = 'indicator';
      if (index === 0) indicator.classList.add('active');

      indicator.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(index);
      });

      indicatorsContainer.appendChild(indicator);
    });

    const indicators = indicatorsContainer.querySelectorAll('.indicator');

    function updateIndicators() {
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    }

    // ✅ THIS is what you were missing: active class follows the front card
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
      currentIndex = index;
      currentRotation = -index * step;
      updateView();
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

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      prev();
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      next();
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) next();
      if (touchEndX > touchStartX + 50) prev();
    }, { passive: true });

    // Prevent clicks on card body doing weird stuff (only allow button clicks)
    featureCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.guide-btn')) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });

    // Initial state
    updateView();
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.gallery-item').forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px)';
  item.style.transition = 'all 0.6s ease';
  observer.observe(item);
});

// Form submission ripple (only if button exists)
const submitBtn = document.querySelector('.submit-btn');
if (submitBtn) {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';

    const rect = submitBtn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';

    submitBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { width: 300px; height: 300px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
