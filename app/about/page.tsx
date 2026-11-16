import { about } from '@/content/pages';
import { products } from '@/content/products';
import { families } from '@/content/families';
import { pageMeta } from '@/lib/seo';
import { Container, PageHero, Section, SectionHeading, ButtonLink, Kicker } from '@/components/ui';
import type { Tone } from '@/components/ui';
import { CountUp, MediaReveal, Reveal, ScrollLit, Stagger, StaggerItem } from '@/components/motion';
import Image from 'next/image';

export const metadata = pageMeta({
  title: 'About us',
  description: 'Meet Viosh Scents Hub: a perfume store that makes finding a fragrance you love easy, personal and fun.',
  path: '/about',
});

const toneBg: Record<string, string> = { gold: 'bg-gold', blush: 'bg-blush', rose: 'bg-rose' };

export default function AboutPage() {
  const sizes = new Set(products.flatMap((p) => p.sizes.map((s) => s.ml)));
  const stats = [
    { n: products.filter((p) => !p.giftSet).length, label: 'Fragrances on the shelf' },
    { n: families.length, label: 'Scent families' },
    { n: sizes.size, label: 'Bottle sizes to choose from' },
  ];

  return (
    <>
      <PageHero
        kicker="About Viosh"
        title="A little shop with a *big* love of scent"
        intro={about.intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        image="/hero/about.jpg"
        imagePosition="center 35%"
      />

      <Section tone="base">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-4">
              <MediaReveal className="row-span-2 aspect-[3/5] overflow-hidden rounded-[1.75rem]">
                <Image src="/hero/contact.jpg" alt="A burgundy perfume bottle beside a handwritten card" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </MediaReveal>
              <MediaReveal className="aspect-square overflow-hidden rounded-[1.75rem]" delay={0.15}>
                <Image src="/hero/wishlist-2.jpg" alt="A blush perfume bottle on satin" fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
              </MediaReveal>
              <MediaReveal className="aspect-square overflow-hidden rounded-[1.75rem]" delay={0.3}>
                <Image src="/hero/shop.jpg" alt="Three perfume bottles on velvet" fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
              </MediaReveal>
            </div>
            <div className="flex flex-col gap-6">
              <SectionHeading align="left" kicker="Our story" title="How it *started*" className="items-center text-center lg:items-start lg:text-left" />
              {about.story.map((p, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08} className="text-muted text-lg leading-relaxed">
                  {p}
                </Reveal>
              ))}
              <Reveal delay={0.3} className="flex items-center gap-4 rounded-2xl bg-surface-2 p-4">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-wine font-display text-xl text-gold">V</span>
                <span>
                  <span className="block font-semibold">{about.founder.name}</span>
                  <span className="text-muted text-sm">
                    {about.founder.role} · since {about.founder.since}
                  </span>
                </span>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="night" size="lg">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine/60 blur-[120px]" aria-hidden="true" />
        <Container className="relative">
          <ScrollLit
            text="We believe everyone deserves a scent that feels like *them*. Not the loudest, not the most expensive, just the one that makes you feel most like yourself."
            className="mx-auto max-w-5xl text-center font-display text-[clamp(1.8rem,4vw,3.4rem)] font-medium leading-[1.15] tracking-tight"
          />
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <SectionHeading kicker="What we care about" title="Three things we *never* skip" />
          <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
            {about.values.map((v) => (
              <StaggerItem key={v.title}>
                <div className={`h-full rounded-[1.75rem] p-8 text-wine-night shadow-soft transition-transform duration-500 hover:-translate-y-1.5 ${toneBg[v.tone]}`}>
                  <span className="mb-6 block h-1 w-10 rounded-full bg-wine-night" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-medium">{v.title}</h3>
                  <p className="mt-3 leading-relaxed opacity-85">{v.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section tone="wine" size="sm">
        <Container>
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {stats.map((s) => (
              <Reveal key={s.label}>
                <CountUp to={s.n} className="block font-display text-7xl font-semibold text-gold" />
                <p className="text-muted mt-2 font-medium">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="blush" size="sm">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Kicker>Come say hello</Kicker>
          <h2 className="font-display text-display-md font-medium">
            Questions, gift ideas or <span className="accent">just curious</span>?
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact">Get in touch</ButtonLink>
            <ButtonLink href="/shop" variant="ghost" icon="bag">
              Visit the shop
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
