'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { useMemo, useRef, useState } from 'react';
import { products, fromPrice, type Product } from '@/content/products';
import { families, familyById } from '@/content/families';
import { useModal } from '@/lib/hooks';
import { cn, EASE, formatPrice } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { ProductCard } from '@/components/product/ProductCard';

const genders = [
  { id: 'women', label: 'For her' },
  { id: 'men', label: 'For him' },
  { id: 'unisex', label: 'Unisex' },
];
const concs = [
  { id: 'EDT', label: 'Eau de Toilette' },
  { id: 'EDP', label: 'Eau de Parfum' },
  { id: 'Parfum', label: 'Parfum' },
  { id: 'Extrait', label: 'Extrait' },
  { id: 'Set', label: 'Gift sets' },
];
const prices = [
  { id: 'u50', label: `Under ${formatPrice(50000)}`, test: (n: number) => n < 50000 },
  { id: '50-150', label: `${formatPrice(50000)} – ${formatPrice(150000)}`, test: (n: number) => n >= 50000 && n <= 150000 },
  { id: 'o150', label: `Over ${formatPrice(150000)}`, test: (n: number) => n > 150000 },
];
const sorts = [
  { id: 'featured', label: 'Featured' },
  { id: 'bestsellers', label: 'Bestsellers' },
  { id: 'new', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name', label: 'A – Z' },
];

const fuse = new Fuse(products, {
  keys: ['name', 'brand', 'tagline', 'notes.top', 'notes.heart', 'notes.base', 'family'],
  threshold: 0.38,
  ignoreLocation: true,
});

export type Filters = { brand: string[]; family: string[]; gender: string[]; conc: string[]; price: string[]; deal: boolean };
const brands = Array.from(new Set(products.filter((p) => !p.giftSet).map((p) => p.brand)));

function read(sp: URLSearchParams): Filters {
  const list = (k: string) => (sp.get(k) ? sp.get(k)!.split(',').filter(Boolean) : []);
  return { brand: list('brand'), family: list('family'), gender: list('gender'), conc: list('conc'), price: list('price'), deal: sp.get('deal') === '1' };
}

function applyFilters(list: Product[], f: Filters) {
  return list.filter((p) => {
    if (f.brand.length && !f.brand.includes(p.brand)) return false;
    if (f.family.length && !f.family.includes(p.family)) return false;
    if (f.gender.length && !f.gender.includes(p.gender)) return false;
    if (f.conc.length && !f.conc.includes(p.concentration)) return false;
    if (f.price.length && !prices.filter((pr) => f.price.includes(pr.id)).some((pr) => pr.test(fromPrice(p)))) return false;
    if (f.deal && !p.sizes.some((s) => s.compareAt)) return false;
    return true;
  });
}

export function ShopClient({ preset }: { preset?: Partial<Filters> }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const f = { ...read(new URLSearchParams(sp.toString())), ...preset } as Filters;
  const q = sp.get('q') ?? '';
  const sort = sp.get('sort') ?? 'featured';
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  useModal(drawer, () => setDrawer(false), drawerRef);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    const s = next.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };
  const toggle = (key: keyof Omit<Filters, 'deal'>, id: string) => {
    const cur = f[key];
    const nextList = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    update({ [key]: nextList.join(',') || null });
  };

  const results = useMemo(() => {
    const base = q.trim() ? fuse.search(q.trim()).map((r) => r.item) : products;
    const list = applyFilters(base, f);
    if (q.trim() && sort === 'featured') return list;
    const sorted = [...list];
    switch (sort) {
      case 'bestsellers':
        sorted.sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller) || Number(!!b.featured) - Number(!!a.featured));
        break;
      case 'new':
        sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
        break;
      case 'price-asc':
        sorted.sort((a, b) => fromPrice(a) - fromPrice(b));
        break;
      case 'price-desc':
        sorted.sort((a, b) => fromPrice(b) - fromPrice(a));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.addedAt.localeCompare(a.addedAt));
    }
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString(), q, sort]);

  const activeChips = [
    ...f.brand.map((id) => ({ key: 'brand' as const, id, label: id })),
    ...f.family.filter((id) => !preset?.family?.includes(id)).map((id) => ({ key: 'family' as const, id, label: familyById[id as keyof typeof familyById]?.name ?? id })),
    ...f.gender.filter((id) => !preset?.gender?.includes(id)).map((id) => ({ key: 'gender' as const, id, label: genders.find((g) => g.id === id)?.label ?? id })),
    ...f.conc.filter((id) => !preset?.conc?.includes(id)).map((id) => ({ key: 'conc' as const, id, label: concs.find((c) => c.id === id)?.label ?? id })),
    ...f.price.map((id) => ({ key: 'price' as const, id, label: prices.find((p) => p.id === id)?.label ?? id })),
  ];
  const activeCount = activeChips.length + (f.deal ? 1 : 0) + (q ? 1 : 0);

  const panel = (
    <div className="flex flex-col gap-8">
      <FilterGroup title="House">
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button key={b} type="button" className="chip" aria-pressed={f.brand.includes(b)} onClick={() => toggle('brand', b)}>
              {b}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Scent family">
        <div className="flex flex-wrap gap-2">
          {families.map((fam) => (
            <button key={fam.id} type="button" className="chip" aria-pressed={f.family.includes(fam.id)} onClick={() => toggle('family', fam.id)} disabled={!!preset?.family}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: fam.colour }} aria-hidden="true" />
              {fam.short}
            </button>
          ))}
        </div>
      </FilterGroup>
      {!preset?.gender ? (
        <FilterGroup title="Who it’s for">
          <div className="flex flex-wrap gap-2">
            {genders.map((g) => (
              <button key={g.id} type="button" className="chip" aria-pressed={f.gender.includes(g.id)} onClick={() => toggle('gender', g.id)}>
                {g.label}
              </button>
            ))}
          </div>
        </FilterGroup>
      ) : null}
      <FilterGroup title="Strength">
        <div className="flex flex-wrap gap-2">
          {concs
            .filter((c) => !preset?.conc || preset.conc.includes(c.id))
            .map((c) => (
              <button key={c.id} type="button" className="chip" aria-pressed={f.conc.includes(c.id)} onClick={() => toggle('conc', c.id)}>
                {c.label}
              </button>
            ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Price">
        <div className="flex flex-wrap gap-2">
          {prices.map((p) => (
            <button key={p.id} type="button" className="chip" aria-pressed={f.price.includes(p.id)} onClick={() => toggle('price', p.id)}>
              {p.label}
            </button>
          ))}
        </div>
      </FilterGroup>
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-surface-2 p-4">
        <span>
          <span className="block font-semibold">On offer only</span>
          <span className="text-muted text-sm">Show fragrances with a reduced price</span>
        </span>
        <input type="checkbox" className="peer sr-only" checked={f.deal} onChange={(e) => update({ deal: e.target.checked ? '1' : null })} />
        <span className="relative h-7 w-12 shrink-0 rounded-full bg-ink/15 transition-colors duration-300 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-300 peer-checked:bg-wine peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-gold dark:peer-checked:bg-gold" />
      </label>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[290px_1fr]">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-28 rounded-[1.75rem] bg-surface p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-medium">Filter</h2>
            {activeCount ? (
              <button type="button" className="text-sm font-semibold underline underline-offset-4" onClick={() => router.replace(pathname, { scroll: false })}>
                Clear all
              </button>
            ) : null}
          </div>
          {panel}
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setDrawer(true)} className="chip lg:hidden">
              <Icon name="filter" size={16} /> Filter {activeCount ? `(${activeCount})` : ''}
            </button>
            <p className="text-muted text-sm font-medium" aria-live="polite">
              {results.length} {results.length === 1 ? 'fragrance' : 'fragrances'}
              {q ? (
                <>
                  {' '}for “<span className="font-semibold text-ink">{q}</span>”
                </>
              ) : null}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <span className="text-muted">Sort by</span>
            <span className="relative">
              <select
                value={sort}
                onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}
                className="h-11 appearance-none rounded-full border border-ink/15 bg-surface pl-4 pr-10 font-semibold text-ink outline-none transition-colors hover:border-ink/40 focus:border-wine"
              >
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
            </span>
          </label>
        </div>

        {activeChips.length || q ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {q ? (
              <button type="button" className="chip" data-active="true" onClick={() => update({ q: null })}>
                “{q}” <Icon name="close" size={14} />
              </button>
            ) : null}
            {activeChips.map((c) => (
              <button key={`${c.key}-${c.id}`} type="button" className="chip" data-active="true" onClick={() => toggle(c.key, c.id)} aria-label={`Remove filter ${c.label}`}>
                {c.label} <Icon name="close" size={14} />
              </button>
            ))}
          </div>
        ) : null}

        {results.length ? (
          <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((p, i) => (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 6) * 0.04 }}
                >
                  <ProductCard product={p} priority={i < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-[1.75rem] bg-surface p-12 text-center shadow-soft">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-blush text-wine">
              <Icon name="search" size={32} />
            </div>
            <p className="font-display text-2xl">Nothing matches just yet</p>
            <p className="text-muted max-w-sm">Try removing a filter or two, or search for a note you love like vanilla, rose or gold.</p>
            <button type="button" className="chip" onClick={() => router.replace(pathname, { scroll: false })}>
              <Icon name="refresh" size={15} /> Reset filters
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {drawer ? (
          <div className="fixed inset-0 z-[80] lg:hidden">
            <motion.button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute inset-0 bg-wine-night/55 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
            />
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[2rem] bg-bg text-ink"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <div className="flex items-center justify-between px-6 pb-3 pt-5">
                <h2 className="font-display text-2xl font-medium">Filter</h2>
                <button type="button" className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close filters" data-autofocus>
                  <Icon name="close" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6">{panel}</div>
              <div className="grid grid-cols-2 gap-3 border-t border-ink/10 p-4">
                <button type="button" className="h-12 rounded-full border border-ink/20 font-semibold" onClick={() => router.replace(pathname, { scroll: false })}>
                  Clear all
                </button>
                <button type="button" className="h-12 rounded-full bg-wine font-semibold text-cream dark:bg-gold dark:text-wine-night" onClick={() => setDrawer(false)}>
                  Show {results.length}
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">{title}</legend>
      {children}
    </fieldset>
  );
}
