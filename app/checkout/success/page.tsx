import { Container, Section } from '@/components/ui';
import { SuccessClient } from '@/components/checkout/SuccessClient';

export const metadata = { title: 'Order placed', robots: { index: false } };

export default function SuccessPage() {
  return (
    <Section tone="blush" className="min-h-[80vh] pt-32 md:pt-40">
      <Container>
        <SuccessClient />
      </Container>
    </Section>
  );
}
