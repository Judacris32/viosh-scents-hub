'use client';

import { products } from '@/content/products';
import { useShop, useHydrated } from '@/lib/store';
import { ButtonLink, Icon } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';

export function WishlistClient() {
  const hydrated = useHydrated();
  const wishlist = useShop((s) => s.wishlist);
  const list = hydrated ? products.filter((p) => wishlist.includes(p.slug)) : [];

  if (!hydrated) return <div className="h-64" />;

  if (!list.length) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-[2rem] bg-surface p-10 text-center shadow-soft">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-blush text-berry-deep">
          <Icon name="heart" size={34} />
        </div>
        <p className="font-display text-2xl">No favourites yet</p>
        <p className="text-muted">Tap the heart on any fragrance to save it here.</p>
        <ButtonLink href="/shop">Start browsing</ButtonLink>
      </div>
    );
  }

  return (
    <>
      <p className="text-muted mb-8 text-center font-medium">
        {list.length} saved {list.length === 1 ? 'fragrance' : 'fragrances'}
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
