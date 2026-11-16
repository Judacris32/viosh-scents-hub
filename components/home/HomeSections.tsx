'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { families } from '@/content/families';
import { products, type Product } from '@/content/products';
import { collections, productsIn } from '@/content/collections';
import { concentrations } from '@/content/guide';
import { quickLinks } from '@/content/navigation';
import { cn, EASE } from '@/lib/format';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductMedia } from '@/components/product/ProductMedia';
import { Stagger, StaggerItem, Reveal } from '@/components/motion';

/* ---------- Quick category pills ---------- */
export function CategoryRail({ onDark = false }: { onDark?: boolean }) {
  return (
    <ul className={cn('no-scrollbar flex gap-2.5 overflow-x-auto sm:flex-wrap sm:justify-center', onDark ? '' : '-mx-4 px-4 sm:mx-0 sm:px-0')}>
      {quickLinks.map((q) => (
        <li key={q.href} className="shrink-0">
          <Link
            href={q.href}
            className={cn(
              'flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-[background-color,color,border-color,transform] duration-500 hover:-translate-y-0.5',
              onDark
                ? 'border-cream/35 text-cream hover:border-gold hover:bg-gold hover:text-wine-night'
                : 'border-ink/15 bg-surface shadow-soft hover:border-wine hover:bg-wine hover:text-cream dark:hover:border-gold dark:hover:bg-gold dark:hover:text-wine-night',
            )}
          >
            <Icon name={q.icon as IconName} size={16} />
            {q.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Horizontal product rail ---------- */
export function ProductRail({ items, label, preferDeal = false }: { items: Product[]; label: string; preferDeal?: boolean }) {
  const ref = useRef<HTMLUListElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: 'smooth' });
  };
  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2 max-sm:hidden">
        <button type="button" onClick={() => scrollBy(-1)} className="icon-btn border border-ink/15" aria-label={`Scroll ${label} left`}>
          <Icon name="arrow-left" size={18} />
        </button>
        <button type="button" onClick={() => scrollBy(1)} className="icon-btn border border-ink/15" aria-label={`Scroll ${label} right`}>
          <Icon name="arrow" size={18} />
        </button>
      </div>
      <ul ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" aria-label={label}>
        {items.map((p, i) => (
          <li key={p.slug} className="w-[min(68vw,15rem)] shrink-0 snap-start sm:w-60">
            <ProductCard product={p} priority={i < 2} compact preferDeal={preferDeal} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Tabbed product grid ---------- */
const tabs = [
  { id: 'best', label: 'Bestsellers', href: '/shop?sort=bestsellers', list: () => products.filter((p) => p.bestseller).slice(0, 8) },
  { id: 'new', label: 'New in', href: '/collections/new-in', list: () => products.filter((p) => p.isNew).slice(0, 8) },
  { id: 'women', label: 'For her', href: '/collections/women', list: () => productsIn(collections[0]).slice(0, 8) },
  { id: 'men', label: 'For him', href: '/collections/men', list: () => productsIn(collections[1]).slice(0, 8) },
  { id: 'gifts', label: 'Gift sets', href: '/collections/gift-sets', list: () => products.filter((p) => p.giftSet).slice(0, 8) },
];

export function ProductTabs() {
  const [tab, setTab] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === tab)!;
  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-ink/[0.06] p-1.5" role="tablist" aria-label="Product groups">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn('relative shrink-0 rounded-full px-3.5 py-2.5 text-sm font-semibold transition-colors duration-500 sm:px-5', tab === t.id ? 'text-cream dark:text-wine-night' : 'hover:text-ink')}
            >
              {tab === t.id ? <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-wine dark:bg-gold" transition={{ type: 'spring', stiffness: 380, damping: 32 }} /> : null}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.ul
          key={tab}
          className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {current.list().map((p) => (
            <motion.li key={p.slug} variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}>
              <ProductCard product={p} />
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
      <div className="mt-10 flex justify-center">
        <ButtonLink href={current.href}>See all {current.label.toLowerCase()}</ButtonLink>
      </div>
    </div>
  );
}

/* ---------- Shop by house ---------- */
export function BrandRail() {
  const houses = Array.from(new Set(products.filter((p) => !p.giftSet).map((p) => p.brand)));
  return (
    <ul className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-5">
      {houses.map((brand) => {
        const items = products.filter((p) => p.brand === brand && !p.giftSet);
        return (
          <li key={brand} className="w-36 shrink-0 sm:w-auto">
            <Link
              href={`/shop?brand=${encodeURIComponent(brand)}`}
              className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-surface text-ink shadow-soft transition-[transform,box-shadow] duration-500 ease-silk hover:-translate-y-1.5 hover:shadow-lift"
            >
              <div className="relative aspect-square overflow-hidden">
                <div className="h-full w-full transition-transform duration-[1.2s] ease-silk group-hover:scale-[1.07]">
                  <ProductMedia product={items[0]} sizes="200px" />
                </div>
              </div>
              <div className="p-3.5">
                <p className="truncate font-display text-lg font-medium leading-tight">{brand}</p>
                <p className="text-xs text-ink-soft">
                  {items.length} {items.length === 1 ? 'fragrance' : 'fragrances'}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Scent family chips ---------- */
export function FamilyChips() {
  const shown = families.filter((f) => products.some((p) => p.family === f.id && !p.giftSet));
  return (
    <ul className="flex flex-wrap justify-center gap-2.5">
      {shown.map((f) => (
        <li key={f.id}>
          <Link href={`/shop?family=${f.id}`} className="chip !py-2.5 !pl-3.5 !pr-4">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.colour }} aria-hidden="true" />
            {f.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Collection tiles ---------- */
export function CollectionTiles() {
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {collections.slice(0, 4).map((c) => {
        const ps = productsIn(c);
        const dark = c.tone === 'wine' || c.tone === 'plum';
        return (
          <StaggerItem key={c.slug}>
            <Link
              href={`/collections/${c.slug}`}
              className={cn(
                'group relative flex h-[21rem] flex-col justify-between overflow-hidden rounded-[1.5rem] p-6 shadow-soft transition-[transform,box-shadow] duration-500 ease-silk hover:-translate-y-1.5 hover:shadow-lift',
                dark ? 'on-dark text-cream' : 'text-wine-night',
              )}
              style={{ background: c.tint }}
            >
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">{c.kicker}</p>
                <h3 className="mt-2 font-display text-3xl font-medium leading-tight">
                  {c.name} <span className="italic">{c.accent}</span>
                </h3>
                <p className="mt-1 text-sm font-medium opacity-80">
                  {ps.length} {ps.length === 1 ? 'scent' : 'scents'}
                </p>
              </div>
              <div className="pointer-events-none absolute inset-x-4 bottom-0 flex h-[54%] items-end justify-center">
                {ps.slice(0, 3).map((p, i) => (
                  <div
                    key={p.slug}
                    className="-mx-5 h-full w-[52%] transition-transform duration-700 ease-silk group-hover:-translate-y-3"
                    style={{ transitionDelay: `${i * 60}ms`, zIndex: i === 1 ? 2 : 1, transform: `translateY(${i === 1 ? 0 : 14}px)` }}
                  >
                    <div className="h-full w-full overflow-hidden rounded-t-[1.2rem] bg-cream shadow-lift" style={{ transform: `rotate(${(i - 1) * 6}deg)`, transformOrigin: 'bottom center' }}>
                      <ProductMedia product={p} sizes="200px" tile="#FFFBF6" />
                    </div>
                  </div>
                ))}
              </div>
              <span className={cn('relative z-10 grid h-11 w-11 place-items-center self-end rounded-full transition-transform duration-500 group-hover:rotate-45', dark ? 'bg-gold text-wine-night' : 'bg-wine-night text-cream')}>
                <Icon name="arrow-up-right" size={18} />
              </span>
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

/* ---------- Concentration bars (also used on the Scent Guide) ---------- */
export function ConcentrationBars() {
  const max = 40;
  return (
    <div className="grid gap-4">
      {concentrations.map((c, i) => (
        <Reveal key={c.id} delay={i * 0.06}>
          <div className="grid items-center gap-3 rounded-[1.25rem] bg-bg/70 p-4 backdrop-blur md:grid-cols-[220px_1fr_160px] md:gap-6 md:p-5">
            <div>
              <p className="font-display text-xl font-medium">{c.name}</p>
              <p className="text-muted text-sm">{c.range} perfume oil</p>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-ink/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-plum via-gold to-rose"
                initial={{ width: 0 }}
                whileInView={{ width: `${(c.oil / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: EASE, delay: 0.2 + i * 0.08 }}
              />
            </div>
            <p className="flex items-center gap-2 text-sm font-semibold md:justify-end">
              <Icon name="clock" size={16} /> {c.lasts}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
