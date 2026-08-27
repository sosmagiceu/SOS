export const SITE_URL = 'https://sosmagic.eu';
export const SITE_NAME = 'S.O.S. MAGIC';

// Shared branded sharing image, 1200x630. Drop the file in public/ to replace it.
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  legalName: 'Van der Velde Beheer B.V.',
  url: SITE_URL,
  logo: 'https://sosmagic.b-cdn.net/Achterground%20enzo/Logo%20.png',
  image: OG_IMAGE,
  email: 'support@sosmagic.eu',
  vatID: 'NL810301076B01',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Noord Spuidijk 2',
    postalCode: '3247LB',
    addressLocality: 'Dirksland',
    addressCountry: 'NL',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@sosmagic.eu',
    url: `${SITE_URL}/contact`,
  },
};
