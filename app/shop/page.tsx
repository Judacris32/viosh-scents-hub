import { Suspense } from 'react';
import { pageMeta } from '@/lib/seo';
import { Container, PageHero, Section } from '@/components/ui';
import { ShopClient } from '@/components/shop/ShopClient';

export const metadata = pageMeta({
  title: 'Shop all fragrances',
  description: 'Browse every fragrance at Viosh Scents Hub. Filter by scent family, strength, price and who it’s for.',
  path: '/shop',
});

export default function ShopPage() {
  return (
    <>
      <PageHero
        tone="wine"
        kicker="The shop"
        title="Every scent, all in *one* place"
        intro="Filter by mood, strength or budget, or search for a note you already love."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Shop' }]}
        image="/hero/shop.jpg"
      />
      <Section tone="base" size="sm">
        <Container>
          <Suspense fallback={<div className="h-96" />}>
            <ShopClient />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
