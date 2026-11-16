'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { concentrationLabel } from '@/content/products';
import { store } from '@/content/store';
import { useShop, whatsappOrderLink, type CartLine } from '@/lib/store';
import { cn, EASE, formatPrice } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { ProductMedia } from '@/components/product/ProductMedia';

export function QtyStepper({ value, onChange, label, small = false }: { value: number; onChange: (v: number) => void; label: string; small?: boolean }) {
  return (
    <div className={cn('inline-flex items-center rounded-full border border-ink/15', small ? 'h-9' : 'h-12')} role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className={cn('grid place-items-center rounded-full transition-colors duration-300 hover:bg-ink/[0.08]', small ? 'h-9 w-9' : 'h-12 w-12')}
        onClick={() => onChange(value - 1)}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={16} />
      </button>
      <span className={cn('text-center font-semibold tabular-nums', small ? 'w-6 text-sm' : 'w-8')} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={cn('grid place-items-center rounded-full transition-colors duration-300 hover:bg-ink/[0.08] disabled:opacity-40', small ? 'h-9 w-9' : 'h-12 w-12')}
        onClick={() => onChange(value + 1)}
        disabled={value >= 10}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const setQty = useShop((s) => s.setQty);
  const remove = useShop((s) => s.remove);
  const p = line.product;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex gap-4 py-5"
    >
      <Link href={`/shop/${p.slug}`} onClick={onNavigate} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-2">
        <ProductMedia product={p} sizes="96px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/shop/${p.slug}`} onClick={onNavigate} className="link-underline font-display text-lg font-medium leading-tight">
              {p.name}
            </Link>
            <p className="text-muted mt-1 text-sm">
              {p.concentration === 'Set' ? 'Gift set' : `${concentrationLabel[p.concentration]} · ${line.ml}ml`}
            </p>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">{formatPrice(line.lineTotal)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QtyStepper small value={line.qty} label={p.name} onChange={(v) => setQty(p.slug, line.ml, v)} />
          <button
            type="button"
            onClick={() => remove(p.slug, line.ml)}
            className="text-muted flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 hover:bg-berry/15 hover:text-berry-deep dark:hover:text-berry"
          >
            <Icon name="trash" size={16} /> Remove
          </button>
        </div>
      </div>
    </motion.li>
  );
}

export function CartLines({ lines, onNavigate }: { lines: CartLine[]; onNavigate?: () => void }) {
  return (
    <ul className="divide-y divide-ink/10">
      <AnimatePresence initial={false}>
        {lines.map((l) => (
          <CartLineItem key={`${l.slug}-${l.ml}`} line={l} onNavigate={onNavigate} />
        ))}
      </AnimatePresence>
    </ul>
  );
}

export function WhatsAppOrderButton({ lines, subtotal, className }: { lines: CartLine[]; subtotal: number; className?: string }) {
  return (
    <a
      href={whatsappOrderLink(lines, subtotal)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-[#1F9D55] px-6 font-semibold text-white transition-[background-color,box-shadow] duration-500 hover:bg-[#178246] hover:shadow-[0_14px_30px_-12px_rgba(31,157,85,0.8)]',
        className,
      )}
    >
      <Icon name="whatsapp" size={22} />
      Order on WhatsApp
      <Icon name="arrow" size={18} className="transition-transform duration-500 group-hover:translate-x-1" />
    </a>
  );
}

export function FreeShippingNote({ subtotal }: { subtotal: number }) {
  const t = store.shipping.freeOver;
  if (!t) return null;
  const left = Math.max(0, t - subtotal);
  const pct = Math.min(100, (subtotal / t) * 100);
  return (
    <div className="rounded-2xl bg-surface-2 p-4 text-sm">
      <p className="font-medium">{left > 0 ? `You're ${formatPrice(left)} away from free delivery` : 'You’ve unlocked free delivery'}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-rose via-gold to-berry" animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: EASE }} />
      </div>
    </div>
  );
}
