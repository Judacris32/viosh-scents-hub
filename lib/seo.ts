import type { Metadata } from 'next';
import { store } from '@/content/store';

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} · ${store.name}`, description, url: path, siteName: store.name, type: 'website' },
    twitter: { card: 'summary_large_image', title: `${title} · ${store.name}`, description },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
