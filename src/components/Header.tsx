import { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';

const links = [
  ['Products', '/products'], ['Method', '/method'], ['Our story', '/story'],
  ['FAQ', '/faq'], ['Reviews', '/reviews'], ['Partnership', '/partnership'], ['Contact', '/contact']
];

export default function Header({ currentPath = '/' }: { currentPath?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [currentPath]);
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-ink/75 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
      <a href="/" className="flex items-center gap-3" aria-label="S.O.S. Magic home">
        <img src="https://sosmagic.b-cdn.net/Achterground%20enzo/Logo%20.png" alt="S.O.S. Magic" className="h-10 w-auto" />
      </a>
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
        {links.map(([label, href]) => <a key={href} href={href} className={`text-sm transition hover:text-aqua ${currentPath === href ? 'text-aqua' : 'text-white/65'}`}>{label}</a>)}
      </nav>
      <div className="flex items-center gap-2">
        <a href="/products" className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-aqua sm:inline-flex"><ShoppingBag size={16} className="mr-2" />Explore decks</a>
        <button onClick={() => setOpen(!open)} className="grid size-11 place-items-center rounded-full border border-white/12 lg:hidden" aria-label="Toggle menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>
    </div>
    {open && <nav className="border-t border-white/8 bg-ink px-5 py-5 lg:hidden" aria-label="Mobile navigation">
      <div className="mx-auto grid max-w-7xl gap-1">{links.map(([label, href]) => <a key={href} href={href} className="rounded-xl px-4 py-3 text-white/75 hover:bg-white/5 hover:text-white">{label}</a>)}</div>
    </nav>}
  </header>;
}
