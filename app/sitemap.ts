import type { MetadataRoute } from 'next';
import { products } from '@/content/products';
import { collections } from '@/content/collections';
import { store } from '@/content/store';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ['', '/shop', '/collections', '/finder', '/scent-guide', '/about', '/contact', '/faq', '/shipping-returns', '/privacy', '/terms'];
  return [
    ...pages.map((p) => ({ url: `${store.url}${p}`, lastModified: now, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...collections.map((c) => ({ url: `${store.url}/collections/${c.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${store.url}/shop/${p.slug}`, lastModified: new Date(p.addedAt), changeFrequency: 'weekly' as const, priority: 0.9 })),
  ];
}
