'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { concentrationLabel, defaultSize, type Product } from '@/content/products';
import { familyById } from '@/content/families';
import { store } from '@/content/store';
import { useShop, useUI } from '@/lib/store';
import { cn, EASE, formatPrice } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { ProductMedia } from './ProductMedia';
import { WishButton } from './ProductCard';
import { QtyStepper } from '@/components/cart/CartParts';

const views = [
  { id: 'front', label: 'Bottle' },
  { id: 'close', label: 'Close up' },
] as const;

export function ProductGallery({ product }: { product: Product }) {
  const [view, setView] = useState<(typeof views)[number]['id']>('front');
  const fam = familyById[product.family];
  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-28">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]" style={{ background: fam.tint }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ProductMedia product={product} view={view} priority sizes="(min-width: 1024px) 50vw, 100vw" />
          </motion.div>
        </AnimatePresence>
        <WishButton slug={product.slug} name={product.name} className="absolute right-4 top-4" />
      </div>
      <div className="grid grid-cols-3 gap-3" role="tablist" aria-label="Product images">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            aria-label={v.label}
            onClick={() => setView(v.id)}
            className={cn(
              'relative aspect-square overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-bg transition-[box-shadow,opacity] duration-500',
              view === v.id ? 'ring-wine dark:ring-gold' : 'opacity-70 ring-transparent hover:opacity-100',
            )}
            style={{ background: fam.tint }}
          >
            <ProductMedia product={product} view={v.id} sizes="160px" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function PurchasePanel({ product }: { product: Product }) {
  const firstInStock = defaultSize(product);
  const [ml, setMl] = useState(firstInStock.ml);
  const buyRef = useRef<HTMLDivElement>(null);
  const buyInView = useInView(buyRef, { margin: '-80px 0px -120px 0px' });
  const [qty, setQty] = useState(1);
  const add = useShop((s) => s.add);
  const showToast = useUI((s) => s.showToast);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const size = product.sizes.find((s) => s.ml === ml) ?? firstInStock;
  const isSet = product.concentration === 'Set';

  const quickOrder = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
    `Hello ${store.name}, I'd like to order ${product.name}${isSet ? '' : ` (${ml}ml)`} × ${qty}. Is it available?`,
  )}`;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-baseline gap-3">
        <motion.span key={size.price} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-4xl font-semibold tabular-nums">
          {formatPrice(size.price * qty)}
        </motion.span>
        {size.compareAt ? <span className="text-muted text-lg tabular-nums line-through">{formatPrice(size.compareAt * qty)}</span> : null}
      </div>

      {!isSet ? (
        <fieldset>
          <legend className="mb-3 text-sm font-bold uppercase tracking-[0.16em]">Choose a size</legend>
          <div className="flex flex-wrap gap-2.5">
            {product.sizes.map((s) => (
              <label key={s.ml} className={cn('relative cursor-pointer', !s.inStock && 'cursor-not-allowed')}>
                <input type="radio" name="size" value={s.ml} checked={ml === s.ml} disabled={!s.inStock} onChange={() => setMl(s.ml)} className="peer sr-only" />
                <span
                  className={cn(
                    'flex min-w-[6.5rem] flex-col rounded-2xl border-[1.5px] border-ink/15 px-4 py-3 transition-[border-color,background-color,color] duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-gold',
                    'hover:border-ink/50 peer-checked:border-wine peer-checked:bg-wine peer-checked:text-cream dark:peer-checked:border-gold dark:peer-checked:bg-gold dark:peer-checked:text-wine-night',
                    !s.inStock && 'opacity-45 hover:border-ink/15',
                  )}
                >
                  <span className="text-lg font-bold">{s.ml}ml</span>
                  <span className="text-sm opacity-80">{s.inStock ? formatPrice(s.price) : 'Sold out'}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div ref={buyRef} className="flex flex-col gap-3 sm:flex-row">
        <QtyStepper value={qty} label={product.name} onChange={(v) => setQty(Math.max(1, Math.min(10, v)))} />
        <button
          type="button"
          disabled={!size.inStock}
          onClick={() => {
            add(product.slug, size.ml, qty);
            showToast(`${product.name}${isSet ? '' : ` ${size.ml}ml`} added to your bag`);
          }}
          className="btn btn-primary flex-1 justify-between !py-1"
        >
          <span className="relative">{size.inStock ? 'Add to bag' : 'Sold out'}</span>
          <span className="btn-badge">
            <Icon name="bag" size={18} />
          </span>
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={quickOrder}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#1F9D55] px-5 text-sm font-semibold text-white transition-colors duration-500 hover:bg-[#178246]"
        >
          <Icon name="whatsapp" size={19} /> Order on WhatsApp
        </a>
        <button
          type="button"
          onClick={() => {
            add(product.slug, size.ml, qty);
            setCartOpen(true);
          }}
          disabled={!size.inStock}
          className="flex h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-ink/20 px-5 text-sm font-semibold transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-bg disabled:opacity-50"
        >
          Add &amp; view bag
        </button>
      </div>

      <ul className="grid gap-3 rounded-3xl bg-surface-2 p-5 text-sm">
        <li className="flex items-center gap-3">
          <Icon name="truck" size={20} className="shrink-0 text-wine dark:text-rose" />
          <span>
            Standard delivery {store.shipping.standardEta}. Express available. <span className="text-muted">[CONFIRM]</span>
          </span>
        </li>
        <li className="flex items-center gap-3">
          <Icon name="gift" size={20} className="shrink-0 text-wine dark:text-rose" />
          Gift-ready packing on request
        </li>
        <li className="flex items-center gap-3">
          <Icon name="chat" size={20} className="shrink-0 text-wine dark:text-rose" />
          Questions about this scent? Message us, we’re happy to help.
        </li>
      </ul>
      <p className="sr-only">{concentrationLabel[product.concentration]}</p>

      {/* App-style sticky buy bar: appears on phones once the main button scrolls away */}
      <AnimatePresence>
        {!buyInView ? (
          <motion.div
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-x-0 bottom-[3.9rem] z-30 border-t border-ink/10 bg-[rgb(var(--surface)/0.95)] px-4 py-3 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-lg items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{product.name}</p>
                <p className="text-sm font-bold tabular-nums text-ink-soft">
                  {formatPrice(size.price * qty)} {!isSet ? `· ${size.ml}ml` : ''}
                </p>
              </div>
              <button
                type="button"
                disabled={!size.inStock}
                onClick={() => {
                  add(product.slug, size.ml, qty);
                  showToast(`${product.name}${isSet ? '' : ` ${size.ml}ml`} added to your bag`);
                }}
                className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-wine px-5 font-semibold text-cream transition-colors duration-500 hover:bg-gold hover:text-wine-night disabled:opacity-50 dark:bg-gold dark:text-wine-night"
              >
                <Icon name="bag" size={18} /> {size.inStock ? 'Add' : 'Sold out'}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Meter({ label, value, low, high }: { label: string; value: number; low: string; high: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-bold uppercase tracking-[0.14em]">{label}</span>
        <span className="text-muted text-sm">{value} / 5</span>
      </div>
      <div className="flex gap-1.5" role="img" aria-label={`${label}: ${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className={cn('h-2.5 flex-1 rounded-full', i < value ? 'bg-gradient-to-r from-plum to-wine dark:from-gold dark:to-rose' : 'bg-ink/10')}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            style={{ originX: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
          />
        ))}
      </div>
      <div className="text-muted mt-1.5 flex justify-between text-xs">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

export function Accordion({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.title}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-base font-semibold"
              >
                {it.title}
                <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink/[0.06] transition-transform duration-500', isOpen && 'rotate-45 bg-gold text-wine-night')}>
                  <Icon name="plus" size={16} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="text-muted pb-6 leading-relaxed">{it.body}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
