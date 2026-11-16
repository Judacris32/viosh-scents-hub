
import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource-variable/manrope';
import './globals.css';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { store } from '@/content/store';
import { JsonLd } from '@/lib/seo';
import { Providers } from '@/components/layout/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaBanner } from '@/components/layout/CtaBanner';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { Toast } from '@/components/layout/Toast';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { QuickView } from '@/components/product/QuickView';

export const metadata: Metadata = {
  metadataBase: new URL(store.url),
  title: {
    default: `${store.name} · ${store.tagline}`,
    template: `%s · ${store.name}`,
  },
  description: store.description,
  applicationName: store.name,
  keywords: [
    'perfume',
    'fragrance',
    'eau de parfum',
    'gift sets',
    'unisex perfume',
    'perfume store',
    store.city,
  ],
  openGraph: {
    type: 'website',
    siteName: store.name,
    locale: 'en_NG',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
  },
};

// Light mode is the default browser theme colour
export const viewport: Viewport = {
  themeColor: '#F7EDE3',
  width: 'device-width',
  initialScale: 1,
};

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: store.name,
  url: store.url,
  logo: `${store.url}/icon-512.png`,
  email: store.email,
  description: store.description,
  sameAs: store.socials.map((s) => s.href).filter((h) => !h.includes('[')),
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <noscript>
          <style>
            {`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}.page-curtain{display:none!important}`}
          </style>
        </noscript>
      </head>

      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={JsonLd({ data: orgLd })}
        />

        <Providers>
          <a href="#main" className="skip-link">
            Skip to content
          </a>

          <Header />

          <main id="main" className="pb-16 lg:pb-0">
            {children}
          </main>

          <CtaBanner />
          <Footer />
          <CartDrawer />
          <SearchDialog />
          <Toast />
          <QuickView />
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}
