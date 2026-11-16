'use client';

import Link from 'next/link';
import { useCart } from '@/lib/store';
import { formatPrice } from '@/lib/format';
import { store } from '@/content/store';
import { products } from '@/content/products';
import { Container, Section, ButtonLink, Breadcrumb, Icon } from '@/components/ui';
import { SplitWords, Reveal } from '@/components/motion';
import { CartLines, FreeShippingNote, WhatsAppOrderButton } from '@/components/cart/CartParts';
import { ProductCard } from '@/components/product/ProductCard';

export function CartPageClient() {
  const { lines, subtotal, count, hydrated } = useCart();
  const suggestions = products.filter((p) => p.featured && !lines.some((l) => l.slug === p.slug)).slice(0, 3);

  return (
    <>
      <Section tone="base" className="pt-32 md:pt-40" size="sm">
        <Container>
          <div className="flex flex-col items-center gap-4 text-center">
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: 'Bag' }]} />
            <SplitWords as="h1" immediate text="Your *bag*" className="text-display-xl font-medium" />
            <p className="text-muted">{hydrated ? `${count} ${count === 1 ? 'item' : 'items'}` : ' '}</p>
          </div>

          {hydrated && lines.length === 0 ? (
            <Reveal className="mx-auto mt-12 flex max-w-lg flex-col items-center gap-5 rounded-[2rem] bg-surface p-10 text-center shadow-soft">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-blush text-wine">
                <Icon name="bag" size={34} />
              </div>
              <p className="font-display text-2xl">Nothing in here yet</p>
              <p className="text-muted">Browse the shop or let the Fragrance Finder suggest a few scents to start with.</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/shop">Shop all</ButtonLink>
                <ButtonLink href="/finder" variant="ghost" icon="spray">
                  Take the quiz
                </ButtonLink>
              </div>
            </Reveal>
          ) : (
            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_400px]">
              <div className="rounded-[2rem] bg-surface px-6 py-2 shadow-soft md:px-8">
                <CartLines lines={lines} />
              </div>
              <aside className="h-fit rounded-[2rem] bg-surface-2 p-6 md:p-8 lg:sticky lg:top-28" aria-label="Order summary">
                <h2 className="font-display text-2xl font-medium">Summary</h2>
                <dl className="mt-6 grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Subtotal</dt>
                    <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Delivery</dt>
                    <dd className="font-medium">From {formatPrice(store.shipping.standardFee)}</dd>
                  </div>
                </dl>
                <div className="my-5 h-px bg-ink/10" />
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">Estimated total</span>
                  <span className="font-display text-3xl font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-muted mt-1 text-xs">Plus delivery, confirmed at checkout.</p>
                <div className="mt-6 grid gap-3">
                  <FreeShippingNote subtotal={subtotal} />
                  <WhatsAppOrderButton lines={lines} subtotal={subtotal} />
                  <Link
                    href="/checkout"
                    className="flex h-14 items-center justify-center gap-2 rounded-full bg-wine font-semibold text-cream transition-colors duration-500 hover:bg-gold hover:text-wine-night dark:bg-gold dark:text-wine-night dark:hover:bg-blush"
                  >
                    <Icon name="lock" size={18} /> Continue to checkout
                  </Link>
                  <Link href="/shop" className="text-center text-sm font-semibold underline underline-offset-4">
                    Keep shopping
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </Container>
      </Section>

      {suggestions.length ? (
        <Section tone="blush" size="sm">
          <Container>
            <h2 className="mb-8 text-center font-display text-display-md font-medium">
              You might <span className="accent">also</span> like
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {suggestions.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
