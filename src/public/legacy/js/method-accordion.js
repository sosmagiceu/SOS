// assets/js/method-accordion.js
(() => {
  const accordions = Array.from(document.querySelectorAll('.method-accordion'));
  if (!accordions.length) return;

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

    requestAnimationFrame(() => {
      setPanelHeight(panel);

      requestAnimationFrame(() => {
        setPanelHeight(panel);

        setTimeout(() => {
          setPanelHeight(panel);
        }, 60);
      });
    });
  };

  accordions.forEach((root) => {
    const items = Array.from(root.querySelectorAll('.method-acc-item'));

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
  });

  const refreshOpenHeights = () => {
    document.querySelectorAll('.method-acc-item.is-open .method-acc-panel').forEach((panel) => {
      setPanelHeight(panel);
    });
  };

  window.addEventListener('resize', refreshOpenHeights);
  window.addEventListener('load', refreshOpenHeights);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshOpenHeights).catch(() => {});
  }
})();
