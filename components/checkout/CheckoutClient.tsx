'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { useCart, useShop } from '@/lib/store';
import { cn, EASE, formatPrice } from '@/lib/format';
import { store } from '@/content/store';
import { Icon } from '@/components/ui/Icon';
import { ProductMedia } from '@/components/product/ProductMedia';

type Fields = { name: string; email: string; phone: string; address: string; city: string; state: string; country: string; notes: string };
const empty: Fields = { name: '', email: '', phone: '', address: '', city: '', state: '', country: 'Nigeria', notes: '' };

const delivery = [
  { id: 'standard', label: 'Standard delivery', eta: store.shipping.standardEta, fee: store.shipping.standardFee },
  { id: 'express', label: 'Express delivery', eta: store.shipping.expressEta, fee: store.shipping.expressFee },
  { id: 'pickup', label: 'Pick up', eta: 'Collect from our store once confirmed [CONFIRM]', fee: 0 },
];

const payment = [
  { id: 'card', label: 'Card payment', note: 'Coming soon. Will connect to Paystack or Stripe.', disabled: true },
  { id: 'transfer', label: 'Bank transfer', note: 'We’ll send account details when we confirm your order.' },
  { id: 'delivery', label: 'Pay on delivery', note: 'Available in selected areas. [CONFIRM]' },
];

export type DemoOrder = {
  id: string;
  createdAt: string;
  customer: Fields;
  delivery: { label: string; fee: number };
  payment: string;
  lines: { name: string; ml: number; qty: number; total: number; isSet: boolean }[];
  subtotal: number;
  total: number;
};

export function CheckoutClient() {
  const { lines, subtotal, hydrated } = useCart();
  const clear = useShop((s) => s.clear);
  const router = useRouter();
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [ship, setShip] = useState('standard');
  const [pay, setPay] = useState('transfer');
  const [submitting, setSubmitting] = useState(false);

  const freeShip = store.shipping.freeOver && subtotal >= store.shipping.freeOver;
  const d = delivery.find((x) => x.id === ship)!;
  const fee = freeShip && ship === 'standard' ? 0 : d.fee;
  const total = subtotal + fee;

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof Fields, string>> = {};
    if (f.name.trim().length < 2) e.name = 'Please enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Please enter a valid email address';
    if (f.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a phone number we can reach you on';
    if (ship !== 'pickup') {
      if (f.address.trim().length < 5) e.address = 'Please enter your delivery address';
      if (!f.city.trim()) e.city = 'Please enter your city';
    }
    setErrors(e);
    return e;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    const firstKey = Object.keys(e)[0];
    if (firstKey) {
      document.getElementById(`f-${firstKey}`)?.focus();
      return;
    }
    setSubmitting(true);
    const order: DemoOrder = {
      id: `VSH-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customer: f,
      delivery: { label: d.label, fee },
      payment: payment.find((p) => p.id === pay)!.label,
      lines: lines.map((l) => ({ name: l.product.name, ml: l.ml, qty: l.qty, total: l.lineTotal, isSet: l.product.concentration === 'Set' })),
      subtotal,
      total,
    };
    try {
      sessionStorage.setItem('viosh-last-order', JSON.stringify(order));
    } catch {
      /* storage unavailable: success page will show a generic message */
    }
    window.setTimeout(() => {
      clear();
      router.push('/checkout/success');
    }, 900);
  };

  if (hydrated && lines.length === 0 && !submitting) {
    return (
      <div className="mx-auto mt-10 flex max-w-lg flex-col items-center gap-4 rounded-[2rem] bg-surface p-10 text-center shadow-soft">
        <p className="font-display text-2xl">Your bag is empty</p>
        <p className="text-muted">Add a fragrance or two, then come back to check out.</p>
        <Link href="/shop" className="btn btn-primary">
          <span className="relative">Go to the shop</span>
          <span className="btn-badge">
            <Icon name="arrow" size={18} />
          </span>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
      <div className="flex flex-col gap-6">
        <div className="flex gap-3 rounded-2xl border border-gold bg-gold/15 p-4 text-sm" role="note">
          <Icon name="sparkle" size={20} className="mt-0.5 shrink-0" />
          <p>
            <strong>Demo checkout.</strong> No payment is taken here yet. When you place your order you’ll be able to send it to us on WhatsApp in one tap, and we’ll confirm everything with you.
          </p>
        </div>

        <Panel title="Your details" icon="user">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Full name" value={f.name} onChange={set('name')} error={errors.name} autoComplete="name" className="sm:col-span-2" />
            <Field id="email" label="Email" type="email" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            <Field id="phone" label="Phone (WhatsApp if possible)" type="tel" value={f.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
          </div>
        </Panel>

        <Panel title="Delivery" icon="truck">
          <div className="grid gap-3" role="radiogroup" aria-label="Delivery method">
            {delivery.map((x) => {
              const xFee = freeShip && x.id === 'standard' ? 0 : x.fee;
              return (
                <Choice key={x.id} name="ship" checked={ship === x.id} onChange={() => setShip(x.id)} title={x.label} note={x.eta} right={xFee === 0 ? 'Free' : formatPrice(xFee)} />
              );
            })}
          </div>
          {ship !== 'pickup' ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.45, ease: EASE }} className="mt-5 grid gap-4 overflow-hidden sm:grid-cols-2">
              <Field id="address" label="Street address" value={f.address} onChange={set('address')} error={errors.address} autoComplete="street-address" className="sm:col-span-2" />
              <Field id="city" label="City" value={f.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
              <Field id="state" label="State / region" value={f.state} onChange={set('state')} autoComplete="address-level1" />
              <Field id="country" label="Country" value={f.country} onChange={set('country')} autoComplete="country-name" className="sm:col-span-2" />
            </motion.div>
          ) : null}
        </Panel>

        <Panel title="Payment" icon="lock">
          <div className="grid gap-3" role="radiogroup" aria-label="Payment method">
            {payment.map((p) => (
              <Choice key={p.id} name="pay" checked={pay === p.id} onChange={() => setPay(p.id)} title={p.label} note={p.note} disabled={p.disabled} right={p.disabled ? 'Soon' : undefined} />
            ))}
          </div>
          <label htmlFor="f-notes" className="mt-5 block text-sm font-semibold">
            Order notes <span className="text-muted font-normal">(optional)</span>
          </label>
          <textarea id="f-notes" rows={3} value={f.notes} onChange={set('notes')} className="field mt-2 resize-none" placeholder="Gift wrapping, a note for the card, delivery instructions…" />
        </Panel>
      </div>

      <aside className="h-fit rounded-[2rem] bg-surface-2 p-6 md:p-8 lg:sticky lg:top-28" aria-label="Order summary">
        <h2 className="font-display text-2xl font-medium">Order summary</h2>
        <ul className="mt-5 grid gap-4">
          {lines.map((l) => (
            <li key={`${l.slug}-${l.ml}`} className="flex items-center gap-3">
              <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl">
                <ProductMedia product={l.product} sizes="56px" />
                <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-full bg-wine px-1 text-[0.65rem] font-bold text-cream">{l.qty}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{l.product.name}</span>
                <span className="text-muted text-sm">{l.product.concentration === 'Set' ? 'Gift set' : `${l.ml}ml`}</span>
              </span>
              <span className="text-sm font-semibold tabular-nums">{formatPrice(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 grid gap-3 border-t border-ink/10 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{d.label}</dt>
            <dd className="font-semibold tabular-nums">{fee === 0 ? 'Free' : formatPrice(fee)}</dd>
          </div>
        </dl>
        <div className="mt-5 flex items-baseline justify-between border-t border-ink/10 pt-5">
          <span className="font-semibold">Total</span>
          <span className="font-display text-3xl font-semibold tabular-nums">{formatPrice(total)}</span>
        </div>
        <button type="submit" disabled={submitting || !hydrated} className="btn btn-primary mt-6 w-full justify-between !py-1.5">
          <span className="relative">{submitting ? 'Placing order…' : 'Place order'}</span>
          <span className="btn-badge">
            {submitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Icon name="arrow" size={18} />}
          </span>
        </button>
        <p className="text-muted mt-4 text-center text-xs leading-relaxed">
          By placing your order you agree to our{' '}
          <Link href="/terms" className="underline">
            terms of sale
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline">
            privacy policy
          </Link>
          .
        </p>
      </aside>
    </form>
  );
}

function Panel({ title, icon, children }: { title: string; icon: 'user' | 'truck' | 'lock'; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] bg-surface p-6 shadow-soft md:p-8">
      <h2 className="mb-5 flex items-center gap-3 font-display text-2xl font-medium">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-rose text-wine-night">
          <Icon name={icon} size={18} />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  error,
  className,
  ...rest
}: { id: string; label: string; error?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={`f-${id}`} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={`f-${id}`}
        name={id}
        aria-invalid={!!error}
        aria-describedby={error ? `f-${id}-err` : undefined}
        className={cn('field', error && '!border-berry-deep')}
        {...rest}
      />
      {error ? (
        <p id={`f-${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-berry-deep dark:text-berry">
          <Icon name="close" size={14} /> {error}
        </p>
      ) : null}
    </div>
  );
}

function Choice({
  name,
  checked,
  onChange,
  title,
  note,
  right,
  disabled,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  note: string;
  right?: string;
  disabled?: boolean;
}) {
  return (
    <label className={cn('relative block', disabled ? 'cursor-not-allowed opacity-55' : 'cursor-pointer')}>
      <input type="radio" name={name} checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" />
      <span className="flex items-center gap-4 rounded-2xl border-[1.5px] border-ink/15 p-4 transition-[border-color,background-color] duration-300 hover:border-ink/40 peer-checked:border-wine peer-checked:bg-wine/[0.06] peer-focus-visible:ring-2 peer-focus-visible:ring-gold dark:peer-checked:border-gold dark:peer-checked:bg-gold/10">
        <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border-2', checked ? 'border-wine dark:border-gold' : 'border-ink/30')}>
          {checked ? <span className="h-2.5 w-2.5 rounded-full bg-wine dark:bg-gold" /> : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{title}</span>
          <span className="text-muted block text-sm">{note}</span>
        </span>
        {right ? <span className="text-sm font-semibold">{right}</span> : null}
      </span>
    </label>
  );
}
