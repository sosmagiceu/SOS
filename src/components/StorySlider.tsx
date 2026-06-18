import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function StorySlider({ slides }: { slides: { title: string; body: string }[] }) {
  const [active, setActive] = useState(0);
  const move = (step: number) => setActive((active + step + slides.length) % slides.length);
  return <div className="glass rounded-[2rem] p-7 sm:p-10"><p className="eyebrow">Chapter {active + 1} of {slides.length}</p><h2 className="display mt-5 text-4xl sm:text-5xl">{slides[active].title}</h2><p className="mt-6 min-h-32 whitespace-pre-line leading-8 text-white/65">{slides[active].body}</p><div className="mt-8 flex gap-3"><button onClick={() => move(-1)} className="grid size-12 place-items-center rounded-full border border-white/15 hover:border-aqua" aria-label="Previous slide"><ArrowLeft /></button><button onClick={() => move(1)} className="grid size-12 place-items-center rounded-full border border-white/15 hover:border-aqua" aria-label="Next slide"><ArrowRight /></button></div></div>;
}
