document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".method-section");
  const dots = document.querySelectorAll(".method-dots .dot");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        dots.forEach(d => d.classList.remove("is-active"));
        const active = document.querySelector('.dot[data-target="'+entry.target.id+'"]');
        if(active) active.classList.add("is-active");
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(section => observer.observe(section));

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const target = document.getElementById(dot.dataset.target);
      if(target) target.scrollIntoView({ behavior:"smooth" });
    });
  });
});