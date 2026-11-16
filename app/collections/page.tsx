import { pageMeta } from '@/lib/seo';
import { Container, PageHero, Section } from '@/components/ui';
import { CollectionTiles } from '@/components/home/HomeSections';
import { collections, productsIn } from '@/content/collections';
import Link from 'next/link';
import { Icon } from '@/components/ui';
import { Reveal } from '@/components/motion';

export const metadata = pageMeta({
  title: 'Collections',
  description: 'Shop perfume collections for her, for him, unisex fragrances, gift sets and new arrivals at Viosh Scents Hub.',
  path: '/collections',
});

export default function CollectionsPage() {
  const newIn = collections.find((c) => c.slug === 'new-in')!;
  return (
    <>
      <PageHero
        kicker="Collections"
        title="Find your *corner* of the shelf"
        intro="Curated edits to make browsing easier, whether you’re shopping for yourself or for someone special."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Collections' }]}
        image="/hero/collections.jpg"
      />
      <Section tone="base">
        <Container>
          <CollectionTiles />
          <Reveal className="mt-5">
            <Link
              href={`/collections/${newIn.slug}`}
              className="group flex flex-col items-center justify-between gap-4 rounded-[1.75rem] bg-mauve p-8 text-wine-night shadow-soft transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-lift sm:flex-row"
            >
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">{newIn.kicker}</p>
                <p className="mt-1 font-display text-3xl font-medium">
                  {newIn.name} <span className="italic">{newIn.accent}</span>
                </p>
                <p className="mt-1 text-sm font-medium opacity-80">{productsIn(newIn).length} new scents to try</p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-wine-night text-cream transition-transform duration-500 group-hover:rotate-45">
                <Icon name="arrow-up-right" size={20} />
              </span>
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
