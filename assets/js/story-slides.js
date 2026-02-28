document.addEventListener("DOMContentLoaded", () => {

  const viewport = document.getElementById("storySlides");
  if (!viewport) return;

  const root = viewport.closest(".story-slides");
  const prevBtn = root.querySelector(".slides-nav.prev");
  const nextBtn = root.querySelector(".slides-nav.next");

  const slides = Array.from(viewport.querySelectorAll(".story-slide"));
  if (slides.length < 2) return;

  const centerOnIndex = (index, behavior = "smooth") => {
    const i = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slides[i];
    const target =
      slide.offsetLeft +
      slide.offsetWidth / 2 -
      viewport.clientWidth / 2;

    viewport.scrollTo({ left: target, behavior });
  };

  const getActiveIndex = () => {
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;

    slides.forEach((slide, i) => {
      const slideCenter =
        slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(center - slideCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    return closest;
  };

  prevBtn.addEventListener("click", () => {
    centerOnIndex(getActiveIndex() - 1);
  });

  nextBtn.addEventListener("click", () => {
    centerOnIndex(getActiveIndex() + 1);
  });

});
