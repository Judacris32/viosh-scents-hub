import Link from 'next/link';
import { faqGroups } from '@/content/faq';
import { pageMeta, JsonLd } from '@/lib/seo';
import { Container, PageHero, Section } from '@/components/ui';
import { Reveal } from '@/components/motion';
import { Accordion } from '@/components/product/ProductDetail';

export const metadata = pageMeta({
  title: 'FAQ',
  description: 'Answers to common questions about ordering, fragrances, delivery and returns at Viosh Scents Hub.',
  path: '/faq',
});

export default function FaqPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqGroups.flatMap((g) =>
      g.items.filter((i) => !i.a.includes('[')).map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
    ),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLd({ data: ld })} />
      <PageHero
        kicker="Help"
        title="Questions, *answered*"
        intro="The things people ask us most. Can’t find what you need? Just get in touch."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
        image="/hero/help.jpg"
        imagePosition="100% center"
        overlay="strong"
      />
      <Section tone="base">
        <Container className="max-w-3xl">
          <div className="grid gap-14">
            {faqGroups.map((g) => (
              <Reveal key={g.title}>
                <h2 className="mb-4 text-center font-display text-display-md font-medium">{g.title}</h2>
                <Accordion items={g.items.map((i) => ({ title: i.q, body: i.a }))} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 text-center">
            <p className="text-muted">
              Still have a question?{' '}
              <Link href="/contact" className="font-semibold text-ink underline underline-offset-4">
                Message us
              </Link>
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
