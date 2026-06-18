import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Star } from 'lucide-react';

type Review = { id?: string; name: string; message: string; score: number };
export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('');
  useEffect(() => { fetch('/.netlify/functions/get-reviews').then(r => r.ok ? r.json() : []).then(data => setReviews(Array.isArray(data) ? data : data.reviews || [])).catch(() => {}); }, []);
  const average = useMemo(() => reviews.length ? reviews.reduce((sum, review) => sum + Number(review.score), 0) / reviews.length : 0, [reviews]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!score) { setStatus('Please select a score.'); return; }
    const form = event.currentTarget; setStatus('Sending…');
    try {
      const response = await fetch('/.netlify/functions/submit-review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), score }) });
      if (!response.ok) throw new Error();
      form.reset(); setScore(0); setStatus('Thank you. Your review is awaiting approval.');
    } catch { setStatus('Something went wrong. Please try again.'); }
  }
  return <div>
    <div className="mb-10 flex items-center gap-3"><div className="flex text-aqua">{[1,2,3,4,5].map(value => <Star key={value} size={19} fill={value <= Math.round(average) ? 'currentColor' : 'none'} />)}</div><span className="text-white/60">Average {average.toFixed(1)} out of 5 stars</span></div>
    <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
      <form onSubmit={submit} className="glass rounded-3xl p-6 sm:p-8"><h2 className="display text-4xl">Leave a review</h2><label className="mt-7 block text-sm text-white/60">Name<input required name="name" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-aqua" /></label><label className="mt-5 block text-sm text-white/60">Message<textarea required name="message" rows={5} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-aqua" /></label><div className="mt-5 flex gap-1">{[1,2,3,4,5].map(value => <button type="button" key={value} onClick={() => setScore(value)} aria-label={`${value} stars`}><Star className={value <= score ? 'fill-aqua text-aqua' : 'text-white/20'} /></button>)}</div><button className="mt-7 rounded-full bg-white px-6 py-3 font-bold text-ink hover:bg-aqua">Send Review</button>{status && <p className="mt-4 text-sm text-white/55" role="status">{status}</p>}</form>
      <div className="space-y-4">{reviews.length ? reviews.map((review, index) => <article key={review.id || index} className="glass rounded-3xl p-6 sm:p-8"><div className="flex text-aqua">{Array.from({length: review.score}, (_, i) => <Star key={i} size={15} fill="currentColor" />)}</div><p className="mt-5 leading-7 text-white/70">“{review.message}”</p><p className="mt-5 text-sm font-bold">{review.name}</p></article>) : <div className="grid min-h-60 place-items-center rounded-3xl border border-dashed border-white/15 text-white/45">No approved reviews yet.</div>}</div>
    </div>
  </div>;
}
