'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { defaultSize, genderLabel, type Product } from '@/content/products';
import { useShop, useUI, useHydrated } from '@/lib/store';
import { cn, formatPrice } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { ProductMedia } from './ProductMedia';

export function WishButton({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const hydrated = useHydrated();
  const wished = useShop((s) => s.wishlist.includes(slug));
  const toggle = useShop((s) => s.toggleWish);
  const on = hydrated && wished;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(slug);
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={cn(
        'grid h-10 w-10 place-items-center rounded-full bg-cream/90 text-wine-night shadow-soft backdrop-blur transition-[transform,background-color,color] duration-500 hover:scale-110 hover:bg-cream',
        on && 'text-berry',
        className,
      )}
    >
      <motion.span animate={on ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.45 }}>
        <Icon name="heart" size={18} fill={on ? 'currentColor' : 'none'} />
      </motion.span>
    </button>
  );
}

export function ProductCard({
  product,
  priority = false,
  compact = false,
  preferDeal = false,
}: {
  product: Product;
  priority?: boolean;
  compact?: boolean;
  /** Start on the discounted size, for offer rails */
  preferDeal?: boolean;
}) {
  const add = useShop((s) => s.add);
  const showToast = useUI((s) => s.showToast);
  const setQuickView = useUI((s) => s.setQuickView);
  const [ml, setMl] = useState((preferDeal ? product.sizes.find((s) => s.compareAt && s.inStock) : null)?.ml ?? defaultSize(product).ml);

  const size = product.sizes.find((s) => s.ml === ml) ?? defaultSize(product);
  const soldOut = !product.sizes.some((s) => s.inStock);
  const onSale = !!size.compareAt;
  const isSet = product.concentration === 'Set';
  const multi = product.sizes.length > 1;

  const addToBag = () => {
    add(product.slug, size.ml, 1);
    showToast(`${product.name}${isSet ? '' : ` ${size.ml}ml`} added to your bag`);
  };

  const tag = 'rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em]';

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-surface text-ink shadow-soft transition-[transform,box-shadow] duration-500 ease-silk hover:-translate-y-1.5 hover:shadow-lift sm:rounded-[1.5rem]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link href={`/shop/${product.slug}`} aria-label={product.name} className="absolute inset-0" tabIndex={-1}>
          <div className="h-full w-full transition-transform duration-[1.2s] ease-silk group-hover:scale-[1.05]">
            <ProductMedia product={product} priority={priority} sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 50vw" />
          </div>
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.isNew ? <span className={`${tag} bg-wine text-cream`}>New</span> : null}
          {onSale ? <span className={`${tag} bg-berry text-cream`}>Offer</span> : null}
          {product.bestseller && !product.isNew && !onSale ? <span className={`${tag} bg-gold text-wine-night`}>Bestseller</span> : null}
          {soldOut ? <span className={`${tag} bg-ink/80 text-bg`}>Sold out</span> : null}
        </div>

        <div className="absolute right-2.5 top-2.5 flex flex-col gap-2">
          <WishButton slug={product.slug} name={product.name} />
          <button
            type="button"
            onClick={() => setQuickView(product.slug)}
            aria-label={`Quick view ${product.name}`}
            className="grid h-10 w-10 place-items-center rounded-full bg-cream/90 text-wine-night opacity-100 shadow-soft backdrop-blur transition-[opacity,transform,background-color] duration-500 hover:scale-110 hover:bg-cream focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <Icon name="eye" size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        <p className="truncate text-[0.63rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
          {product.brand} · {isSet ? 'Gift set' : product.concentration}
        </p>
        <h3 className="font-display text-[1.15rem] font-medium leading-tight sm:text-[1.3rem]">
          <Link href={`/shop/${product.slug}`} className="link-underline">
            {product.name}
          </Link>
        </h3>
        {!compact ? <p className="line-clamp-1 text-xs text-ink-soft sm:text-sm">{product.tagline}</p> : null}

        {/* Tap a size, then Add. No page change needed. */}
        {multi && !soldOut ? (
          <div className="mt-1 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Size for ${product.name}`}>
            {product.sizes.map((s) => (
              <button
                key={s.ml}
                type="button"
                role="radio"
                aria-checked={s.ml === ml}
                disabled={!s.inStock}
                onClick={() => setMl(s.ml)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[0.7rem] font-bold transition-colors duration-300',
                  s.ml === ml ? 'border-wine bg-wine text-cream dark:border-gold dark:bg-gold dark:text-wine-night' : 'border-ink/20 hover:border-ink/60',
                  !s.inStock && 'cursor-not-allowed opacity-40',
                )}
              >
                {s.ml}ml
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <p className="flex flex-col leading-tight">
            {size.compareAt ? <span className="text-xs tabular-nums text-ink-soft line-through">{formatPrice(size.compareAt)}</span> : null}
            <span className={cn('text-[1.05rem] font-bold tabular-nums sm:text-lg', !!size.compareAt && 'text-berry dark:text-rose')}>{formatPrice(size.price)}</span>
          </p>
          <button
            type="button"
            onClick={addToBag}
            disabled={soldOut}
            aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name}${isSet ? '' : ` ${size.ml}ml`} to bag`}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-wine px-3.5 text-sm font-semibold text-cream transition-[background-color,color,transform] duration-500 hover:bg-gold hover:text-wine-night active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gold dark:text-wine-night dark:hover:bg-rose sm:px-4"
          >
            <Icon name={soldOut ? 'clock' : 'plus'} size={16} strokeWidth={2.3} />
            <span className="hidden sm:inline">{soldOut ? 'Sold out' : 'Add'}</span>
          </button>
        </div>
        {!compact ? <p className="text-[0.68rem] text-ink-soft">{isSet ? 'Gift boxed' : genderLabel[product.gender]}</p> : null}
      </div>
    </article>
  );
}
