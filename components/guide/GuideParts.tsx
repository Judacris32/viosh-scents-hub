'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { families } from '@/content/families';
import { glossary } from '@/content/guide';
import { products } from '@/content/products';
import { cn, EASE } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { ProductMedia } from '@/components/product/ProductMedia';

/* ---------- Interactive scent family wheel ---------- */
export function FamilyWheel() {
  const [active, setActive] = useState(families[0].id);
  const f = families.find((x) => x.id === active)!;
  const example = products.find((p) => p.family === f.id && !p.giftSet);
  const n = families.length;

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {families.map((fam, i) => {
            const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
            const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
            const r = 96;
            const ri = 46;
            const p = (a: number, rr: number) => `${100 + Math.cos(a) * rr} ${100 + Math.sin(a) * rr}`;
            const d = `M ${p(a0, ri)} L ${p(a0, r)} A ${r} ${r} 0 0 1 ${p(a1, r)} L ${p(a1, ri)} A ${ri} ${ri} 0 0 0 ${p(a0, ri)} Z`;
            return (
              <motion.path
                key={fam.id}
                d={d}
                fill={fam.tint}
                stroke="rgb(var(--bg))"
                strokeWidth="1.6"
                animate={{ opacity: active === fam.id ? 1 : 0.55, scale: active === fam.id ? 1.04 : 1 }}
                style={{ transformOrigin: '100px 100px' }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            );
          })}
          <circle cx="100" cy="100" r="42" fill="rgb(var(--bg))" />
        </svg>
        {families.map((fam, i) => {
          const a = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(a) * 35.5;
          const y = 50 + Math.sin(a) * 35.5;
          return (
            <button
              key={fam.id}
              type="button"
              onClick={() => setActive(fam.id)}
              onMouseEnter={() => setActive(fam.id)}
              aria-pressed={active === fam.id}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-wine-night transition-all duration-500 sm:text-xs',
                active === fam.id ? 'scale-110 bg-cream shadow-lift' : 'hover:bg-cream/70',
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {fam.short}
            </button>
          );
        })}
        <div className="absolute inset-0 grid place-items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={f.id}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid h-[19%] w-[19%] place-items-center rounded-full"
              style={{ background: f.colour }}
            >
              <Icon name="drop" size={26} className="text-cream" />
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={f.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col gap-5 rounded-[2rem] bg-bg p-7 shadow-soft md:p-9"
          aria-live="polite"
        >
          <span className="w-fit rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em]" style={{ background: f.tint, color: f.ink }}>
            {f.mood}
          </span>
          <h3 className="font-display text-4xl font-medium">{f.name}</h3>
          <p className="text-muted text-lg leading-relaxed">{f.description}</p>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em]">Key notes</p>
            <ul className="flex flex-wrap gap-2">
              {f.keyNotes.map((k) => (
                <li key={k} className="rounded-full bg-ink/[0.06] px-3.5 py-1.5 text-sm font-semibold">
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <p className="flex items-center gap-2 text-sm font-medium">
            <Icon name="clock" size={16} /> Great for: {f.wearWhen}
          </p>
          {example ? (
            <Link href={`/shop?family=${f.id}`} className="group mt-2 flex items-center gap-4 rounded-2xl bg-surface-2 p-3 transition-colors duration-500 hover:bg-gold hover:text-wine-night">
              <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl">
                <ProductMedia product={example} sizes="56px" />
              </span>
              <span className="flex-1">
                <span className="block text-sm opacity-75">Try it with</span>
                <span className="block font-display text-lg font-medium">{example.name}</span>
              </span>
              <span className="mr-2 grid h-10 w-10 place-items-center rounded-full bg-wine text-cream transition-transform duration-500 group-hover:rotate-[-45deg]">
                <Icon name="arrow" size={17} />
              </span>
            </Link>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------- Searchable glossary ---------- */
export function Glossary() {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? glossary.filter((g) => g.term.toLowerCase().includes(t) || g.text.toLowerCase().includes(t)) : glossary;
  }, [q]);

  return (
    <div>
      <div className="mx-auto mb-10 max-w-md">
        <label htmlFor="glossary-q" className="sr-only">
          Search the glossary
        </label>
        <div className="relative">
          <Icon name="search" size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input id="glossary-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a term, e.g. sillage" className="field !rounded-full !py-4 !pl-14" />
        </div>
      </div>
      {list.length ? (
        <motion.dl layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((g) => (
              <motion.div
                layout
                key={g.term}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="rounded-[1.4rem] bg-surface p-5 shadow-soft transition-shadow duration-500 hover:shadow-lift"
              >
                <dt className="flex items-center gap-3 font-display text-xl font-medium">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gold font-sans text-sm font-bold text-wine-night">{g.term[0]}</span>
                  {g.term}
                </dt>
                <dd className="text-muted mt-2 text-sm leading-relaxed">{g.text}</dd>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.dl>
      ) : (
        <p className="text-muted text-center">No terms match “{q}”.</p>
      )}
    </div>
  );
}
