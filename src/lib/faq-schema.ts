import { SITE_URL } from './seo';

/**
 * Builds FAQPage JSON-LD from the accordion markup of /faq, so the structured
 * data can never drift away from what the page actually shows. Pass the page
 * source in with Vite's `?raw` import.
 */
export function buildFaqSchema(source: string) {
  const mainEntity = source
    .split('<div class="faq-acc-item">')
    .slice(1)
    .map(item => {
      const question = item.match(/<span class="faq-acc-title">(.*?)<\/span>/s);
      const answer = item.match(/<div class="faq-acc-panel"[^>]*>(.*?)<\/div>/s);
      if (!question || !answer) return null;

      return {
        '@type': 'Question',
        name: text(question[1]),
        acceptedAnswer: { '@type': 'Answer', text: text(answer[1]) },
      };
    })
    .filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/faq`,
    mainEntity,
  };
}

function text(html: string) {
  return html
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<\/p>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
