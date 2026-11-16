import { store } from '@/content/store';

const money = new Intl.NumberFormat(store.locale, {
  style: 'currency',
  currency: store.currency,
  maximumFractionDigits: 0,
});

export const formatPrice = (n: number) => money.format(n);

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const EASE = [0.22, 1, 0.36, 1] as const;
