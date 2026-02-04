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

export function initCarousels(){
  qsAll("[data-carousel]").forEach(initSimpleCarousel);
}
