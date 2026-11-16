import { Container, Section, Breadcrumb } from '@/components/ui';
import { SplitWords } from '@/components/motion';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';

export const metadata = { title: 'Checkout', robots: { index: false } };

export default function CheckoutPage() {
  return (
    <Section tone="base" className="pt-32 md:pt-40" size="sm">
      <Container>
        <div className="flex flex-col items-center gap-4 text-center">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Bag', href: '/cart' }, { label: 'Checkout' }]} />
          <SplitWords as="h1" immediate text="Almost *yours*" className="text-display-xl font-medium" />
        </div>
        <CheckoutClient />
      </Container>
    </Section>
  );
}
