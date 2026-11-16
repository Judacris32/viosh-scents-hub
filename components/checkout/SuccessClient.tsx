'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { store } from '@/content/store';
import { EASE, formatPrice } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui';
import type { DemoOrder } from './CheckoutClient';

function orderMessage(o: DemoOrder) {
  const rows = o.lines.map((l) => `• ${l.name}${l.isSet ? '' : ` (${l.ml}ml)`} × ${l.qty} — ${formatPrice(l.total)}`);
  const c = o.customer;
  return [
    `Hello ${store.name}, I've placed order ${o.id} on your website:`,
    '',
    ...rows,
    '',
    `Subtotal: ${formatPrice(o.subtotal)}`,
    `${o.delivery.label}: ${o.delivery.fee ? formatPrice(o.delivery.fee) : 'Free'}`,
    `Total: ${formatPrice(o.total)}`,
    `Payment: ${o.payment}`,
    '',
    `Name: ${c.name}`,
    `Phone: ${c.phone}`,
    `Email: ${c.email}`,
    c.address ? `Address: ${[c.address, c.city, c.state, c.country].filter(Boolean).join(', ')}` : '',
    c.notes ? `Notes: ${c.notes}` : '',
  ]
    .filter((x) => x !== '')
    .join('\n');
}

export function SuccessClient() {
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('viosh-last-order');
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.3 }}
        className="grid h-24 w-24 place-items-center rounded-full bg-rose text-wine-night shadow-glow"
      >
        <Icon name="check" size={44} strokeWidth={2.4} />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.45 }} className="mt-8 text-display-lg font-medium">
        Thank you{order ? `, ${order.customer.name.split(' ')[0]}` : ''}! <span className="accent">One last tap</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-muted mt-4 text-lg leading-relaxed">
        {order
          ? `Your order reference is ${order.id}. Send it to us on WhatsApp and we’ll confirm stock, delivery and payment with you.`
          : loaded
            ? 'Send us your order on WhatsApp and we’ll confirm everything with you.'
            : ' '}
      </motion.p>

      {order ? (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.85 }} className="mt-10 w-full rounded-[2rem] bg-surface p-6 text-left shadow-soft md:p-8">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl font-medium">Order {order.id}</p>
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-wine-night">Awaiting confirmation</span>
          </div>
          <ul className="mt-5 grid gap-2 text-sm">
            {order.lines.map((l) => (
              <li key={`${l.name}-${l.ml}`} className="flex justify-between gap-4">
                <span>
                  {l.name}
                  {l.isSet ? '' : ` · ${l.ml}ml`} × {l.qty}
                </span>
                <span className="font-semibold tabular-nums">{formatPrice(l.total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-semibold tabular-nums">{formatPrice(order.total)}</span>
          </div>
          <a
            href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(orderMessage(order))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-[#1F9D55] font-semibold text-white transition-colors duration-500 hover:bg-[#178246]"
          >
            <Icon name="whatsapp" size={22} /> Send order on WhatsApp
          </a>
          <a href={`mailto:${store.email}?subject=${encodeURIComponent(`Order ${order.id}`)}&body=${encodeURIComponent(orderMessage(order))}`} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-ink/20 font-semibold transition-colors duration-500 hover:bg-ink hover:text-bg">
            <Icon name="mail" size={18} /> Or send by email
          </a>
        </motion.div>
      ) : null}

      <div className="mt-10">
        <ButtonLink href="/shop" variant="ghost">
          Keep shopping
        </ButtonLink>
      </div>
    </div>
  );
}
