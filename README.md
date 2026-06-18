# S.O.S. Magic — Astro rebuild

Modern rebuild using native Astro pages, React interactions and Tailwind CSS.
The original page copy, media, forms, legal text and behaviour are preserved.

## Start locally

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

The existing Netlify contact and review functions are retained. Configure these environment variables in Netlify before deployment:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_TO`

Netlify supplies `URL` and `DEPLOY_PRIME_URL` automatically.
