'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { productBySlug, defaultSize, concentrationLabel, genderLabel } from '@/content/products';
import { familyById } from '@/content/families';
import { useShop, useUI } from '@/lib/store';
import { useModal } from '@/lib/hooks';
import { cn, EASE, formatPrice } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { ProductMedia } from './ProductMedia';
import { WishButton } from './ProductCard';

/** Opens from any product card so people can buy without leaving the grid. */
export function QuickView() {
  const slug = useUI((s) => s.quickView);
  const setQuickView = useUI((s) => s.setQuickView);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const showToast = useUI((s) => s.showToast);
  const add = useShop((s) => s.add);
  const ref = useRef<HTMLDivElement>(null);
  const product = slug ? productBySlug(slug) : undefined;
  const [ml, setMl] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

  const close = () => setQuickView(null);
  useModal(!!product, close, ref);

  useEffect(() => {
    if (product) {
      setMl(defaultSize(product).ml);
      setQty(1);
    }
  }, [product]);

  const size = product ? product.sizes.find((s) => s.ml === ml) ?? defaultSize(product) : null;
  const isSet = product?.concentration === 'Set';

  return (
    <AnimatePresence>
      {product && size ? (
        <div className="fixed inset-0 z-[82] flex items-end justify-center sm:items-center sm:p-4">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 bg-wine-night/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} quick view`}
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[1.75rem] bg-bg text-ink shadow-lift sm:rounded-[1.75rem]"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <button type="button" onClick={close} className="icon-btn absolute right-3 top-3 z-10 bg-bg/80 backdrop-blur" aria-label="Close quick view" data-autofocus>
              <Icon name="close" />
            </button>

            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[26rem]">
                <ProductMedia product={product} sizes="(min-width: 640px) 50vw, 100vw" />
                <WishButton slug={product.slug} name={product.name} className="absolute left-3 top-3" />
              </div>

              <div className="flex flex-col gap-4 p-6 sm:p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">{product.brand}</p>
                  <h2 className="mt-1 font-display text-3xl font-medium leading-tight">{product.name}</h2>
                  <p className="text-muted mt-1 text-sm">
                    {concentrationLabel[product.concentration]} · {isSet ? 'Gift boxed' : genderLabel[product.gender]} · {familyById[product.family].short}
                  </p>
                </div>

                <p className="text-muted line-clamp-3 text-sm leading-relaxed">{product.description}</p>

                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-semibold tabular-nums">{formatPrice(size.price * qty)}</span>
                  {size.compareAt ? <span className="text-muted tabular-nums line-through">{formatPrice(size.compareAt * qty)}</span> : null}
                </div>

                {product.sizes.length > 1 ? (
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
                    {product.sizes.map((s) => (
                      <button
                        key={s.ml}
                        type="button"
                        role="radio"
                        aria-checked={s.ml === size.ml}
                        disabled={!s.inStock}
                        onClick={() => setMl(s.ml)}
                        className={cn(
                          'rounded-full border-[1.5px] px-4 py-2 text-sm font-bold transition-colors duration-300',
                          s.ml === size.ml ? 'border-wine bg-wine text-cream dark:border-gold dark:bg-gold dark:text-wine-night' : 'border-ink/20 hover:border-ink/60',
                          !s.inStock && 'cursor-not-allowed opacity-40',
                        )}
                      >
                        {s.ml}ml {s.inStock ? '' : '· sold out'}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mt-auto flex flex-col gap-3 pt-2">
                  <div className="flex gap-3">
                    <div className="inline-flex h-12 shrink-0 items-center rounded-full border border-ink/15">
                      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-11 place-items-center rounded-full transition-colors hover:bg-ink/[0.07]" aria-label="Decrease quantity">
                        <Icon name="minus" size={15} />
                      </button>
                      <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
                      <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid h-12 w-11 place-items-center rounded-full transition-colors hover:bg-ink/[0.07]" aria-label="Increase quantity">
                        <Icon name="plus" size={15} />
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={!size.inStock}
                      onClick={() => {
                        add(product.slug, size.ml, qty);
                        showToast(`${product.name}${isSet ? '' : ` ${size.ml}ml`} added to your bag`);
                        close();
                      }}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-wine font-semibold text-cream transition-colors duration-500 hover:bg-gold hover:text-wine-night disabled:opacity-50 dark:bg-gold dark:text-wine-night dark:hover:bg-rose"
                    >
                      <Icon name="bag" size={18} /> {size.inStock ? 'Add to bag' : 'Sold out'}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={!size.inStock}
                      onClick={() => {
                        add(product.slug, size.ml, qty);
                        setCartOpen(true);
                      }}
                      className="h-11 flex-1 rounded-full border border-ink/20 text-sm font-semibold transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-bg disabled:opacity-50"
                    >
                      Add &amp; checkout
                    </button>
                    <Link href={`/shop/${product.slug}`} onClick={close} className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/20 text-sm font-semibold transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-bg">
                      Full details <Icon name="arrow" size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
