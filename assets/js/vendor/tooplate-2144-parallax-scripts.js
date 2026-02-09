
// Parallax scrolling effect
const layers = document.querySelectorAll('.parallax-layer');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
   const scrollTop = window.pageYOffset;

   layers.forEach(layer => {
      const speed = layer.getAttribute('data-speed') || 0.5;
      const yPos = -(scrollTop * speed);
      layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
   });

   if (heroContent) {
      heroContent.style.transform = `translateY(${scrollTop * 0.3}px)`;
      heroContent.style.opacity = 1 - scrollTop / 500;
   }
});

// Feature cards hover effect
document.querySelectorAll('.feature-card').forEach(card => {
   card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
   });

   card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
   });
});

// 3D Tilt effect on cards
document.querySelectorAll('.feature-card-3d').forEach(rect => {
   rect.addEventListener('mousemove', (e) => {
      const rectBounds = rect.getBoundingClientRect();
      const x = e.clientX - rectBounds.left;
      const y = e.clientY - rectBounds.top;

      const centerX = rectBounds.width / 2;
      const centerY = rectBounds.height / 2;

      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      rect.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
   });

   rect.addEventListener('mouseleave', () => {
      rect.style.transform = '';
   });
});

// 3D Carousel Controls (Home page)
if (!window.__sos3dCarouselInit) {
  window.__sos3dCarouselInit = true;

  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('indicators');

  // Only initialize on pages that actually have the carousel
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

    function updateView() {
      carousel.style.transform = `rotateY(${currentRotation}deg)`;
      updateIndicators();
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

    // Touch swipe support (mobile)
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

    // Prevent accidental navigation when users click the card area
    featureCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.guide-btn')) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });

    updateView();
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
         target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });
      }
   });
});

// Intersection Observer for fade-in animations
const observerOptions = {
   threshold: 0.1,
   rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
         entry.target.style.opacity = 1;
         entry.target.style.transform = 'translateY(0)';
      }
   });
}, observerOptions);

// Observe feature cards and gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
   item.style.opacity = 0;
   item.style.transform = 'translateY(30px)';
   item.style.transition = 'all 0.6s ease';
   observer.observe(item);
});

// Form submission effect
const submitBtn = document.querySelector('.submit-btn');
if (submitBtn) {
   submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Create ripple effect
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
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
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
            @keyframes ripple {
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);
