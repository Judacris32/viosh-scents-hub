import { pageMeta } from '@/lib/seo';
import { PageHero, Section, Container } from '@/components/ui';
import { WishlistClient } from '@/components/shop/WishlistClient';

export const metadata = { ...pageMeta({ title: 'Wishlist', description: 'Fragrances you’ve saved for later.', path: '/wishlist' }), robots: { index: false } };

export default function WishlistPage() {
  return (
    <>
      <PageHero
        image="/hero/wishlist.jpg"
        kicker="Saved for later"
        title="Your *wishlist*"
        intro="Scents you’ve fallen for. They’re saved on this device, ready when you are."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]}
      />
      <Section tone="base" size="sm">
        <Container>
          <WishlistClient />
        </Container>
      </Section>
    </>
  );
}
