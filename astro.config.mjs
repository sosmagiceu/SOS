import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sosmagic.eu',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
