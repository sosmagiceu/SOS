// assets/js/method-accordion.js
(() => {
  const root = document.querySelector('#section-3 .method-accordion');
  if (!root) return;

  const items = Array.from(root.querySelectorAll('.method-acc-item'));

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setPanelHeight = (panel) => {
    if (!panel) return;
    panel.style.maxHeight = 'none';
    const target = panel.scrollHeight;
    panel.style.maxHeight = target + 'px';
  };

  const closeItem = (item) => {
    const btn = item.querySelector('.method-acc-btn');
    const panel = item.querySelector('.method-acc-panel');
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'false');
    item.classList.remove('is-open');

    // Start from current natural height, then animate down
    panel.style.maxHeight = panel.scrollHeight + 'px';
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

    // Let open-state padding/layout apply first
    requestAnimationFrame(() => {
      setPanelHeight(panel);

      // Second pass catches late wrapping/font settling
      requestAnimationFrame(() => {
        setPanelHeight(panel);

        // Third delayed pass catches mobile Safari / delayed font paint
        setTimeout(() => {
          setPanelHeight(panel);
        }, 50);
      });
    });
  };

  items.forEach((item) => {
    const btn = item.querySelector('.method-acc-btn');
    const panel = item.querySelector('.method-acc-panel');
    if (!btn || !panel) return;

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

  const refreshOpenHeights = () => {
    items.forEach((item) => {
      if (!item.classList.contains('is-open')) return;
      const panel = item.querySelector('.method-acc-panel');
      setPanelHeight(panel);
    });
  };

  window.addEventListener('resize', refreshOpenHeights);
  window.addEventListener('load', refreshOpenHeights);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshOpenHeights).catch(() => {});
  }
})();
