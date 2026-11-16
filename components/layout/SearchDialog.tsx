'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { useMemo, useRef, useState } from 'react';
import { products, fromPrice, concentrationLabel } from '@/content/products';
import { familyById, families } from '@/content/families';
import { useUI } from '@/lib/store';
import { useModal } from '@/lib/hooks';
import { EASE, formatPrice, cn } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { ProductMedia } from '@/components/product/ProductMedia';

const index = products.map((p) => ({
  ...p,
  familyName: familyById[p.family].name,
  allNotes: [...p.notes.top, ...p.notes.heart, ...p.notes.base].join(' '),
}));

const fuse = new Fuse(index, {
  keys: [
    { name: 'name', weight: 3 },
    { name: 'brand', weight: 2.5 },
    { name: 'familyName', weight: 1.5 },
    { name: 'allNotes', weight: 1.5 },
    { name: 'tagline', weight: 1 },
    { name: 'gender', weight: 0.6 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
});

const suggestions = ['Chanel', 'Dior', 'Vanilla', 'Rose', 'Oud', 'Gift set'];

export function SearchDialog() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const close = () => {
    setOpen(false);
    setQ('');
    setActive(0);
  };
  useModal(open, close, ref);

  const results = useMemo(() => (q.trim() ? fuse.search(q.trim()).slice(0, 6).map((r) => r.item) : []), [q]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-3 pt-[10vh]">
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
            aria-label="Search fragrances"
            className="relative w-full max-w-2xl overflow-hidden rounded-4xl bg-bg text-ink shadow-lift"
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                const hit = results[active];
                if (hit) router.push(`/shop/${hit.slug}`);
                else if (q.trim()) router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
                close();
              }}
              className="flex items-center gap-3 border-b border-ink/10 px-5"
            >
              <Icon name="search" size={22} className="text-ink-soft" />
              <input
                data-autofocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  }
                }}
                placeholder="Search by name, note or mood…"
                aria-label="Search fragrances"
                aria-controls="search-results"
                className="h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-ink-soft/70"
                autoComplete="off"
              />
              <kbd className="hidden rounded-md border border-ink/15 px-2 py-1 text-xs text-ink-soft sm:block">Esc</kbd>
            </form>

            <div id="search-results" className="max-h-[60vh] overflow-y-auto p-3">
              {!q.trim() ? (
                <div className="p-3">
                  <p className="text-muted mb-3 text-sm font-semibold">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button key={s} type="button" className="chip" onClick={() => setQ(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-muted mb-3 mt-6 text-sm font-semibold">Browse by family</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {families.slice(0, 4).map((f) => (
                      <Link
                        key={f.id}
                        href={`/shop?family=${f.id}`}
                        onClick={close}
                        className="rounded-2xl px-4 py-3 text-sm font-semibold transition-transform duration-500 hover:-translate-y-0.5"
                        style={{ background: f.tint, color: f.ink }}
                      >
                        {f.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="text-muted p-6 text-center">
                  No matches for “{q}”. Try a note like vanilla, rose or oud.
                </p>
              ) : (
                <ul role="listbox" aria-label="Results">
                  {results.map((p, i) => (
                    <li key={p.slug} role="option" aria-selected={i === active}>
                      <Link
                        href={`/shop/${p.slug}`}
                        onClick={close}
                        onMouseEnter={() => setActive(i)}
                        className={cn('flex items-center gap-4 rounded-2xl p-2.5 transition-colors duration-300', i === active && 'bg-ink/[0.06]')}
                      >
                        <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl">
                          <ProductMedia product={p} sizes="56px" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg leading-tight">{p.name}</span>
                          <span className="text-muted block truncate text-sm">
                            {p.brand} · {concentrationLabel[p.concentration]}
                          </span>
                        </span>
                        <span className="text-sm font-semibold tabular-nums">{formatPrice(fromPrice(p))}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
