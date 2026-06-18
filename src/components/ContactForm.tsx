import { useState } from 'react';
import type { FormEvent } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true); setStatus('Sending…');
    try {
      const response = await fetch('/.netlify/functions/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      if (!response.ok) throw new Error();
      form.reset(); setStatus('Thank you. Your message has been sent.');
    } catch { setStatus('Something went wrong. Please email support@sosmagic.eu.'); }
    finally { setSending(false); }
  }
  const field = 'mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-aqua';
  return <form onSubmit={submit} className="glass rounded-[2rem] p-6 sm:p-9" noValidate>
    <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm text-white/60">Name<input required name="name" placeholder="Your name" className={field} /></label><label className="text-sm text-white/60">Email<input required type="email" name="email" placeholder="Your email" className={field} /></label></div>
    <label className="mt-5 block text-sm text-white/60">Subject<input required name="subject" placeholder="Subject" className={field} /></label>
    <label className="mt-5 block text-sm text-white/60">Message<textarea required name="message" placeholder="Your message" rows={6} className={`${field} resize-none`} /></label>
    <button disabled={sending} className="mt-7 rounded-full bg-white px-7 py-3.5 font-bold text-ink transition hover:bg-aqua disabled:opacity-50">{sending ? 'Sending…' : 'Send Message'}</button>
    {status && <p className="mt-4 text-sm text-white/60" role="status">{status}</p>}
  </form>;
}
