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
 * 3D feature carousel on Home.html (carousel-3d / feature-card-3d).
 * Fixes prev/next and applies neon background ONLY to the active (front) card.
 * Keeps diagonal gradient motion by using CSS on .feature-card-3d.is-active.
 */
function initFeatureCarousel3D(){
  const carousel = document.getElementById("carousel");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const indicators = document.getElementById("indicators");

  if(!carousel) return;
  if(carousel.dataset.initialized === "true") return;

  const cards = Array.from(carousel.querySelectorAll(".feature-card-3d"));
  if(cards.length === 0) return;

  let currentIndex = 0;
  const angle = 360 / cards.length;
  const radius = 320; // matches vendor css translateZ(320px)

  // set each card position around the ring
  cards.forEach((card, i) => {
    card.style.transform = `rotateY(${i*angle}deg) translateZ(${radius}px)`;
  });

  function setActive(idx){
    currentIndex = (idx + cards.length) % cards.length;
    carousel.style.transform = `translateZ(-${radius}px) rotateY(${-currentIndex*angle}deg)`;

    cards.forEach((c, i) => c.classList.toggle("is-active", i === currentIndex));

    if(indicators){
      Array.from(indicators.children).forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }
  }

  // indicators
  if(indicators){
    indicators.innerHTML = "";
    cards.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "indicator" + (i===0 ? " active" : "");
      dot.addEventListener("click", () => setActive(i));
      indicators.appendChild(dot);
    });
  }

  prevBtn?.addEventListener("click", () => setActive(currentIndex - 1));
  nextBtn?.addEventListener("click", () => setActive(currentIndex + 1));

  // also allow keyboard arrows when carousel visible
  document.addEventListener("keydown", (e) => {
    // avoid hijacking when typing
    const tag = (document.activeElement && document.activeElement.tagName || "").toLowerCase();
    if(tag === "input" || tag === "textarea") return;

    if(e.key === "ArrowLeft") setActive(currentIndex - 1);
    if(e.key === "ArrowRight") setActive(currentIndex + 1);
  });

  setActive(0);
  carousel.dataset.initialized = "true";
}

export function initCarousels(){
  // Simple carousels
  qsAll("[data-carousel]").forEach(initSimpleCarousel);

  // Home 3D carousel
  initFeatureCarousel3D();
}
