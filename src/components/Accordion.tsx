import { useState } from 'react';
import { Plus } from 'lucide-react';

export type AccordionItem = { question: string; answer: string };

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  return <div className="divide-y divide-white/10 border-y border-white/10">
    {items.map((item, index) => <section key={item.question}>
      <button type="button" className="flex w-full items-start justify-between gap-6 py-6 text-left text-lg font-semibold" onClick={() => setActive(active === index ? null : index)} aria-expanded={active === index}>
        <span>{item.question}</span><Plus className={`mt-0.5 shrink-0 text-aqua transition-transform ${active === index ? 'rotate-45' : ''}`} />
      </button>
      {active === index && <div className="rich-content max-w-3xl pb-7 text-white/65" dangerouslySetInnerHTML={{ __html: item.answer }} />}
    </section>)}
  </div>;
}
