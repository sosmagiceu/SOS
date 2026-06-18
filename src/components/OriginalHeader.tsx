import { useEffect, useRef, useState } from 'react';

type Menu = 'lang' | 'nav' | null;

export default function OriginalHeader() {
  const [open, setOpen] = useState<Menu>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };
    document.addEventListener('click', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  const toggle = (menu: Exclude<Menu, null>) => setOpen(current => current === menu ? null : menu);

  return <div className="site-topbar" id="siteTopbar" ref={headerRef}>
    <div className="inner">
      <a className="icon-btn home-btn" href="/" aria-label="Home">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2 3 10.6v9.2c0 .6.4 1 1 1h5.4v-6.3h5.2v6.3H20c.6 0 1-.4 1-1v-9.2L12 3.2Zm7 16.6h-3.4v-6.3H8.4v6.3H5v-8.2l7-5.7 7 5.7v8.2Z" /></svg>
      </a>
      <div className="topbar-actions">
        <div className="menu-wrap" onMouseEnter={() => setOpen('lang')} onMouseLeave={() => setOpen(null)}>
          <button className="icon-btn menu-btn" type="button" onClick={() => toggle('lang')} aria-expanded={open === 'lang'} aria-controls="langMenu" aria-label="Language">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3.6 12h16.8" /><path d="M12 3c3 3.2 3 14.8 0 18" /><path d="M12 3c-3 3.2-3 14.8 0 18" /></g></svg>
          </button>
          <div id="langMenu" className="menu-panel" hidden={open !== 'lang'}><button className="menu-item" type="button">English</button></div>
        </div>
        <div className="menu-wrap" onMouseEnter={() => setOpen('nav')} onMouseLeave={() => setOpen(null)}>
          <button className="icon-btn menu-btn" type="button" onClick={() => toggle('nav')} aria-expanded={open === 'nav'} aria-controls="navMenu" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" /></svg>
          </button>
          <div id="navMenu" className="menu-panel menu-panel--wide" hidden={open !== 'nav'}><nav className="menu-list" aria-label="Main menu">
            <a className="menu-link" href="/products">Products</a><a className="menu-link" href="/method">Method</a><a className="menu-link" href="/faq">FAQ</a><a className="menu-link" href="/story">Our Story</a><a className="menu-link" href="/partnership">Partnership</a><a className="menu-link" href="/reviews">Reviews</a><a className="menu-link" href="/contact">Contact</a><a className="menu-link" href="/terms">Terms of Service</a>
          </nav></div>
        </div>
      </div>
    </div>
  </div>;
}
