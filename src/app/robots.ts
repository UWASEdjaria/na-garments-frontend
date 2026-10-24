import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/account/',
        '/checkout/',
        '/orders/',
        '/cart/',
        '/wishlist/',
      ],
    },
    sitemap: 'https://nagarments.com/sitemap.xml',
  };
}
