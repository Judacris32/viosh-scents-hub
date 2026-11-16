import { shippingReturns } from '@/content/pages';
import { pageMeta } from '@/lib/seo';
import { LegalPage } from '@/components/ui/LegalPage';

export const metadata = pageMeta({ title: 'Shipping & returns', description: 'How we get your order to you, and what to do if something isn’t right.', path: '/shipping-returns' });

export default function ShippingPage() {
  return <LegalPage kicker="Shipping & returns" title="Delivery and *returns*" intro="How we get your order to you, and what to do if something isn’t right." sections={shippingReturns} updated="[DATE]" />;
}
