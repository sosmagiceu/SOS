import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const routes: Record<string, string> = {
  'Home.html': '/',
  'Products.html': '/products',
  'Method.html': '/method',
  'FAQ.html': '/faq',
  'Story.html': '/story',
  'Partnership.html': '/partnership',
  'Reviews.html': '/reviews',
  'Contact.html': '/contact',
  'TOS.html': '/terms',
  'guidedreading.html': '/guided-reading',
};

export function getLegacyPage(filename: string) {
  const source = readFileSync(join(process.cwd(), 'src', 'legacy', filename), 'utf8');
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';
  const inlineScripts = [...source.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean)
    .join('\n');
  const inlineStyles = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean)
    .join('\n');

  let html = body
    .replace(/<div\s+id=["']header-mount["'][^>]*><\/div>/gi, '')
    .replace(/<div\s+id=["']footer-mount["'][^>]*><\/div>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');

  for (const [oldPath, newPath] of Object.entries(routes)) {
    html = html.replaceAll(`href="${oldPath}"`, `href="${newPath}"`);
    html = html.replaceAll(`href="/${oldPath}"`, `href="${newPath}"`);
  }

  return { html, inlineScripts, inlineStyles };
}
