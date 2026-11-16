import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { collections, collectionBySlug, productsIn } from '@/content/collections';
import { pageMeta } from '@/lib/seo';
import { Container, PageHero, Section, SectionHeading } from '@/components/ui';
import { Stagger, StaggerItem } from '@/components/motion';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = collectionBySlug(params.slug);
  if (!c) return {};
  return pageMeta({ title: `${c.kicker} perfumes`, description: c.intro, path: `/collections/${c.slug}` });
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const c = collectionBySlug(params.slug);
  if (!c) notFound();
  const list = productsIn(c);
  const others = collections.filter((x) => x.slug !== c.slug);

  return (
    <>
      <PageHero
        tone={c.tone === 'wine' ? 'night' : c.tone}
        kicker={c.kicker}
        title={`${c.name} *${c.accent}*`}
        intro={c.intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Collections', href: '/collections' }, { label: c.kicker }]}
        image="/hero/collections.jpg"
      >
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {others.map((o) => (
            <Link key={o.slug} href={`/collections/${o.slug}`} className="chip">
              {o.kicker}
            </Link>
          ))}
        </div>
      </PageHero>
      <Section tone="base">
        <Container>
          <p className="text-muted mb-8 text-center font-medium">
            {list.length} {list.length === 1 ? 'fragrance' : 'fragrances'}
          </p>
          <Stagger className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} priority={i < 4} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
      <Section tone="surface" size="sm">
        <Container>
          <SectionHeading size="md" kicker="Still deciding?" title="Let the *Fragrance Finder* help" intro={<Link href="/finder" className="font-semibold underline underline-offset-4">Answer five quick questions and get a personal shortlist →</Link>} />
        </Container>
      </Section>
    </>
  );
}
