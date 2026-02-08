// JavaScript Document

/*

Tooplate 2144 SOS Magic

https://www.tooplate.com/view/2144-parallax-depth

*/

// Stars/twinkle background removed (site uses a consistent static background now)

// Parallax scrolling effect
const layers = document.querySelectorAll('.parallax-layer');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
   const scrolled = window.pageYOffset;

   // Move hero content
   if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
      heroContent.style.opacity = 1 - (scrolled / 800);
   }

   // Apply different speeds to each layer in hero section only
   if (scrolled < window.innerHeight) {
      layers.forEach((layer, index) => {
         const speed = (index + 1) * 0.2;
         layer.style.transform = `translateY(${scrolled * speed}px)`;
      });
   }
});


// Mouse follower removed (not used on SOS Magic)

// Interactive hover effects for rectangles
const rectangles = document.querySelectorAll('.rect');

rectangles.forEach(rect => {
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

// 3D Carousel Controls
if (!window.__sos3dCarouselInit) {
  window.__sos3dCarouselInit = true;

const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');
const featureCards = carousel ? carousel.querySelectorAll('.feature-card-3d') : document.querySelectorAll('.feature-card-3d');

// STOP_CARD_CLICK: Only the button should navigate (do not make the whole card clickable)
featureCards.forEach(card => {
   card.addEventListener('click', (e) => {
      // Allow clicks on the actual button only
      if (e.target && e.target.closest && e.target.closest('.guide-btn')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
   }, true); // capture phase: blocks any old "card click opens link" handlers

   // Touch devices: prevent synthetic "tap" click from triggering card-level handlers
   const blockIfNotButton = (ev) => {
      if (ev.target && ev.target.closest && ev.target.closest('.guide-btn')) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
   };
   card.addEventListener('touchstart', blockIfNotButton, { capture: true, passive: false });
   card.addEventListener('touchend', blockIfNotButton, { capture: true, passive: false });
   card.addEventListener('pointerdown', blockIfNotButton, { capture: true, passive: false });
   card.addEventListener('pointerup', blockIfNotButton, { capture: true, passive: false });

});

let currentRotation = 0;
let currentIndex = 0;

// Create indicators
if (indicatorsContainer) indicatorsContainer.innerHTML = '';

featureCards.forEach((_, index) => {
   const indicator = document.createElement('div');
   indicator.className = 'indicator';
   if (index === 0) indicator.classList.add('active');
   indicator.addEventListener('click', () => goToSlide(index));
   indicatorsContainer.appendChild(indicator);
});

const indicators = document.querySelectorAll('.indicator');

// Update view - always use 3D rotation
function updateView() {
   carousel.style.transform = `rotateY(${currentRotation}deg)`;
   updateIndicators();
}

// Update indicators
function updateIndicators() {
   indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
   });
}

// Go to specific slide
function goToSlide(index) {
   currentIndex = index;
   currentRotation = -index * 60;
   updateView();
}

// Previous button
prevBtn.addEventListener('click', () => {
   currentIndex = (currentIndex - 1 + featureCards.length) % featureCards.length;
   currentRotation += 60;
   updateView();
});

// Next button
nextBtn.addEventListener('click', () => {
   currentIndex = (currentIndex + 1) % featureCards.length;
   currentRotation -= 60;
   updateView();
});

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
   touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (e) => {
   touchEndX = e.changedTouches[0].screenX;
   handleSwipe();
});

function handleSwipe() {
   if (touchEndX < touchStartX - 50) {
      // Swipe left - next
      nextBtn.click();
   }
   if (touchEndX > touchStartX + 50) {
      // Swipe right - previous
      prevBtn.click();
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
         entry.target.style.opacity = '1';
         entry.target.style.transform = 'translateY(0)';
      }
   });
}, observerOptions);

// Observe feature cards and gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
   item.style.opacity = '0';
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
}
