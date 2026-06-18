import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const cards = [
  ['Products','Take a look at what S.O.S. Magic offers.','/products','1.png'], ['Method','Find out how the S.O.S. Magic method works.','/method','2.png'], ['FAQ','Helpful answers to common questions.','/faq','3.png'], ['Our Story','Find out where and why we started.','/story','4.png'], ['Guided Reading','Clear insight for your current situation.','/guided-reading','5.png'], ['Partnership','Want to collaborate with us?','/partnership','6.png']
];
export default function HomeCarousel() {
  const [active, setActive] = useState(0); const card = cards[active];
  const move = (step:number) => setActive((active + step + cards.length) % cards.length);
  return <div className="grid items-center gap-10 lg:grid-cols-2"><div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] soft-ring"><img src={`https://sosmagic.b-cdn.net/carrousel%20fotos/${card[3]}`} alt="" className="h-full w-full object-cover" /></div><div><p className="eyebrow">0{active+1} / 0{cards.length}</p><h2 className="display mt-5 text-6xl">{card[0]}</h2><p className="mt-6 text-lg text-white/60">{card[1]}</p><a href={card[2]} className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 font-bold text-ink hover:bg-aqua">Learn More</a><div className="mt-8 flex gap-3"><button onClick={()=>move(-1)} className="grid size-12 place-items-center rounded-full border border-white/15" aria-label="Previous card"><ArrowLeft /></button><button onClick={()=>move(1)} className="grid size-12 place-items-center rounded-full border border-white/15" aria-label="Next card"><ArrowRight /></button></div></div></div>;
}
