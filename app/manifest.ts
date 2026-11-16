import type { MetadataRoute } from 'next';
import { store } from '@/content/store';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: store.name,
    short_name: store.shortName,
    description: store.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F7EDE3',
    theme_color: '#4B0F2F',
    icons: [
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-1024.png', sizes: '1024x1024', type: 'image/png' },
    ],
  };
}
