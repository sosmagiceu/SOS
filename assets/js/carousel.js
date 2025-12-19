import { qs, qsAll } from "./utils.js";

/**
 * Simple slider used on pages that have the tm-carousel markup (data-carousel*).
 */
function initSimpleCarousel(root){
  const track=qs("[data-carousel-track]", root);
  const slides=qsAll("[data-carousel-slide]", root);
  const prev=qs("[data-carousel-prev]", root);
  const next=qs("[data-carousel-next]", root);
  const dots=qs("[data-carousel-dots]", root);
  if(!track||slides.length===0) return;

  let i=0;
  const set=(idx)=>{
    i=(idx+slides.length)%slides.length;
    track.style.transform=`translateX(${-i*100}%)`;
    if(dots) qsAll(".tm-dot", dots).forEach((d,di)=>d.classList.toggle("is-active", di===i));
  };

  if(dots){
    dots.innerHTML=slides.map((_,di)=>`<button class="tm-dot" data-dot="${di}" aria-label="Slide ${di+1}"></button>`).join("");
    dots.addEventListener("click",(e)=>{
      const b=e.target.closest("[data-dot]");
      if(!b) return;
      set(parseInt(b.dataset.dot,10));
    });
  }

  prev?.addEventListener("click",()=>set(i-1));
  next?.addEventListener("click",()=>set(i+1));

  const autoplay=root.dataset.autoplay==="true";
  const delay=parseInt(root.dataset.delay||"6500",10);
  let t=null;
  const start=()=>{ if(!autoplay) return; stop(); t=setInterval(()=>set(i+1), delay); };
  const stop=()=>{ if(t){ clearInterval(t); t=null; } };

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  set(0);
  start();
}

/**
 * 3D feature carousel on Home.html (#carousel).
 * Uses the original template behavior (rotateY only) to preserve size + side-card 3D tilt.
 * Adds:
 * - working prev/next
 * - indicators
 * - swipe on mobile
 * - .is-active class on the current/front card for "always-on" neon background
 */
function initFeatureCarousel3D(){
  const carousel = document.getElementById("carousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const indicatorsContainer = document.getElementById("indicators");

  if(!carousel) return;
  if(carousel.dataset.initialized === "true") return;

  const cards = Array.from(document.querySelectorAll(".feature-card-3d"));
  if(cards.length === 0) return;

  const step = 360 / cards.length; // should be 60 for 6 cards
  let currentRotation = 0;
  let currentIndex = 0;

  // Create indicators
  if(indicatorsContainer){
    indicatorsContainer.innerHTML = "";
    cards.forEach((_, index) => {
      const indicator = document.createElement("div");
      indicator.className = "indicator" + (index === 0 ? " active" : "");
      indicator.addEventListener("click", () => goToSlide(index));
      indicatorsContainer.appendChild(indicator);
    });
  }
  const indicators = indicatorsContainer ? Array.from(indicatorsContainer.querySelectorAll(".indicator")) : [];

  function setActiveIndex(idx){
    currentIndex = (idx + cards.length) % cards.length;
    cards.forEach((c,i)=>c.classList.toggle("is-active", i === currentIndex));
    indicators.forEach((d,i)=>d.classList.toggle("active", i === currentIndex));
  }

  function updateView(){
    carousel.style.transform = `rotateY(${currentRotation}deg)`;
    setActiveIndex(currentIndex);
  }

  function goToSlide(index){
    currentIndex = (index + cards.length) % cards.length;
    currentRotation = -currentIndex * step; // direct jump only when clicking dots
    updateView();
  }

  prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    currentRotation += step; // keep moving left
    updateView();
  });

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % cards.length;
    currentRotation -= step; // keep moving right (no jump at wrap)
    updateView();
  });

  // Swipe support (mobile)
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe(){
    if(touchEndX < touchStartX - 50) nextBtn?.click();
    if(touchEndX > touchStartX + 50) prevBtn?.click();
  }

  // Keyboard arrows
  document.addEventListener("keydown", (e) => {
    const tag = (document.activeElement && document.activeElement.tagName || "").toLowerCase();
    if(tag === "input" || tag === "textarea") return;
    if(e.key === "ArrowLeft") prevBtn?.click();
    if(e.key === "ArrowRight") nextBtn?.click();
  });

  // init
  setActiveIndex(0);
  updateView();
  carousel.dataset.initialized = "true";
}

export function initCarousels(){
  qsAll("[data-carousel]").forEach(initSimpleCarousel);
  initFeatureCarousel3D();
}
