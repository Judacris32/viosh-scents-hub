import { pageMeta } from '@/lib/seo';
import { CartPageClient } from '@/components/checkout/CartPageClient';

export const metadata = { ...pageMeta({ title: 'Your bag', description: 'Review the fragrances in your bag.', path: '/cart' }), robots: { index: false } };

export default function CartPage() {
  return <CartPageClient />;
}
