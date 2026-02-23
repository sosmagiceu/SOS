// assets/js/method-accordion.js
// Smooth accordion for Method section 3 (expands inside the same card).
(() => {
  const root = document.querySelector('#section-3 .method-accordion');
  if (!root) return;

  const items = Array.from(root.querySelectorAll('.method-acc-item'));

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeItem = (item) => {
    const btn = item.querySelector('.method-acc-btn');
    const panel = item.querySelector('.method-acc-panel');
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'false');
    item.classList.remove('is-open');

    // Animate height down to 0
    panel.style.maxHeight = panel.scrollHeight + 'px';
    // Force reflow so the browser registers the current height
    panel.getBoundingClientRect();
    panel.style.maxHeight = '0px';
    panel.setAttribute('aria-hidden', 'true');
  };

  const openItem = (item) => {
    const btn = item.querySelector('.method-acc-btn');
    const panel = item.querySelector('.method-acc-panel');
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'true');
    item.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');

    // Set to the real content height for a smooth dropdown
    const target = panel.scrollHeight;
    panel.style.maxHeight = target + 'px';
  };

  items.forEach((item) => {
    const btn = item.querySelector('.method-acc-btn');
    const panel = item.querySelector('.method-acc-panel');
    if (!btn || !panel) return;

    // Remove HTML 'hidden' so transitions can work
    if (panel.hasAttribute('hidden')) panel.removeAttribute('hidden');
    panel.style.maxHeight = '0px';
    panel.setAttribute('aria-hidden', 'true');
    item.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      if (prefersReduced) {
        const isOpen = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(isOpen));
        panel.setAttribute('aria-hidden', String(!isOpen));
        panel.style.maxHeight = isOpen ? panel.scrollHeight + 'px' : '0px';
        return;
      }

      const isOpen = item.classList.contains('is-open');
      if (isOpen) closeItem(item);
      else openItem(item);
    });
  });

  // Keep heights correct if fonts load / window resizes
  const refreshOpenHeights = () => {
    items.forEach((item) => {
      if (!item.classList.contains('is-open')) return;
      const panel = item.querySelector('.method-acc-panel');
      if (!panel) return;
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  };

  window.addEventListener('resize', refreshOpenHeights);
  // fonts/images can shift layout after load
  window.addEventListener('load', refreshOpenHeights);
})();