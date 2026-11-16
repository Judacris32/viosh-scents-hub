import { pageMeta } from '@/lib/seo';
import { Container, Section, PageHero } from '@/components/ui';
import { FinderQuiz } from '@/components/finder/FinderQuiz';

export const metadata = pageMeta({
  title: 'Fragrance Finder quiz',
  description: 'Answer five quick questions and get a personal shortlist of fragrances you’re likely to love.',
  path: '/finder',
});

export default function FinderPage() {
  return (
    <>
      <PageHero
        kicker="Fragrance Finder"
        title="Five questions to your *perfect* match"
        intro="Takes about a minute. We’ll suggest three scents that fit your taste."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Fragrance Finder' }]}
        image="/hero/finder.jpg"
      />
    <Section tone="gold" className="min-h-[80svh]">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-cream/40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-berry/30 blur-3xl" aria-hidden="true" />
      <Container className="relative">
        <FinderQuiz />
      </Container>
    </Section>
    </>
  );
}
