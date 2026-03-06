(() => {
  const roots = Array.from(document.querySelectorAll('.faq-accordion'));
  if (!roots.length) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const allItems = [];

  const closeItem = (item) => {
    const btn = item.querySelector('.faq-acc-btn');
    const panel = item.querySelector('.faq-acc-panel');
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'false');
    item.classList.remove('is-open');
    panel.style.maxHeight = panel.scrollHeight + 'px';
    panel.getBoundingClientRect();
    panel.style.maxHeight = '0px';
    panel.setAttribute('aria-hidden', 'true');
  };

  const openItem = (item) => {
    const btn = item.querySelector('.faq-acc-btn');
    const panel = item.querySelector('.faq-acc-panel');
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', 'true');
    item.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  };

  roots.forEach((root) => {
    const items = Array.from(root.querySelectorAll('.faq-acc-item'));
    allItems.push(...items);

    items.forEach((item) => {
      const btn = item.querySelector('.faq-acc-btn');
      const panel = item.querySelector('.faq-acc-panel');
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
  });

  const refreshOpenHeights = () => {
    allItems.forEach((item) => {
      if (!item.classList.contains('is-open')) return;
      const panel = item.querySelector('.faq-acc-panel');
      if (!panel) return;
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  };

  window.addEventListener('resize', refreshOpenHeights);
  window.addEventListener('load', refreshOpenHeights);
})();
