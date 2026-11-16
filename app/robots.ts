import type { MetadataRoute } from 'next';
import { store } from '@/content/store';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/cart', '/checkout', '/wishlist'] }],
    sitemap: `${store.url}/sitemap.xml`,
  };
}
