import Image from 'next/image';
import Link from 'next/link';
import { home } from '@/content/home';
import { products } from '@/content/products';
import { pageMeta } from '@/lib/seo';
import { Container, Section, SectionHeading, ButtonLink, Icon } from '@/components/ui';
import type { IconName } from '@/components/ui/Icon';
import { Marquee, Reveal, Stagger, StaggerItem } from '@/components/motion';
import { HomeHero } from '@/components/home/HomeHero';
import { ProductTabs, ProductRail, BrandRail, FamilyChips, CollectionTiles, ConcentrationBars } from '@/components/home/HomeSections';

export const metadata = pageMeta({
  title: 'Luxury perfume, delivered',
  description:
    'Shop 37 fragrances from Chanel, Dior, Valentino, YSL, Gucci, Lattafa, Amouage and more at Viosh Scents Hub. Add to bag in one tap and order on WhatsApp.',
  path: '/',
});

const newIn = products.filter((p) => p.isNew);
const offers = products.filter((p) => p.sizes.some((s) => s.compareAt));

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Houses one way, notes the other */}
      <section data-tone="gold" className="overflow-hidden py-5 md:py-6" aria-label="Houses we carry">
        <Marquee items={home.marqueeTop} className="font-display text-2xl font-medium md:text-4xl" separator={<Icon name="sparkle" size={18} />} />
      </section>

      {/* Straight into shopping */}
      <Section tone="base" id="shop" size="md">
        <Container>
          <SectionHeading kicker="Shop now" title="Scents worth *falling* for" intro="Pick a size and add it to your bag right here. No extra clicks." />
          <div className="mt-10">
            <ProductTabs />
          </div>
        </Container>
      </Section>

      <Section tone="blush" size="sm">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Just arrived</p>
              <h2 className="mt-1 font-display text-display-md font-medium">
                New <span className="accent">in</span>
              </h2>
            </div>
            <Link href="/collections/new-in" className="link-underline text-sm font-semibold">
              See all {newIn.length} →
            </Link>
          </div>
          <ProductRail items={newIn} label="New in" />
        </Container>
      </Section>

      <Section tone="base" size="sm">
        <Container>
          <SectionHeading size="md" kicker="Shop by house" title="The names you *already* love" />
          <div className="mt-10">
            <BrandRail />
          </div>
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-muted text-xs font-bold uppercase tracking-[0.2em]">Or browse by scent family</p>
            <FamilyChips />
          </div>
        </Container>
      </Section>

      {offers.length ? (
        <Section tone="wine" size="sm">
          <div className="grain absolute inset-0" aria-hidden="true" />
          <Container className="relative">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Limited time</p>
                <h2 className="mt-1 font-display text-display-md font-medium">
                  On <span className="accent">offer</span>
                </h2>
              </div>
              <Link href="/shop?deal=1" className="link-underline text-sm font-semibold text-gold">
                See all offers →
              </Link>
            </div>
            <ProductRail items={offers} label="On offer" preferDeal />
          </Container>
        </Section>
      ) : null}

      <Section tone="base" size="sm">
        <Container>
          <SectionHeading size="md" kicker="Collections" title="Chosen for *you*" />
          <div className="mt-10">
            <CollectionTiles />
          </div>
        </Container>
      </Section>

      {/* How ordering works */}
      <Section tone="mauve" size="sm">
        <Container>
          <SectionHeading size="md" kicker="How ordering works" title="From our shelf to your *door*" />
          <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
            {home.steps.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="flex h-full gap-4 rounded-[1.5rem] bg-bg p-6 shadow-soft">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-wine text-gold" aria-hidden="true">
                    <Icon name={(['search', 'whatsapp', 'truck'] as const)[i]} size={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-medium">{s.title}</h3>
                    <p className="text-muted mt-1 text-sm leading-relaxed">{s.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Stagger className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {home.promises.map((p) => (
              <StaggerItem key={p.title} className="flex gap-3 rounded-[1.25rem] bg-bg/70 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-wine-night">
                  <Icon name={p.icon as IconName} size={19} />
                </span>
                <div>
                  <h3 className="font-sans text-sm font-bold">{p.title}</h3>
                  <p className="text-muted mt-0.5 text-xs leading-relaxed">{p.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Help choosing */}
      <Section tone="base" size="sm">
        <Container>
          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal className="on-dark relative isolate flex min-h-[18rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-8 text-cream">
              <Image src="/hero/finder.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-10 object-cover" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-wine-night via-wine-night/75 to-wine-night/25" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Not sure where to start?</p>
              <h2 className="mt-2 font-display text-3xl font-medium md:text-4xl">
                Five questions to your <span className="accent">perfect</span> match
              </h2>
              <p className="text-muted mt-2 max-w-sm text-sm">Takes about a minute and gives you a shortlist of three.</p>
              <div className="mt-6">
                <ButtonLink href="/finder" variant="gold" icon="spray">
                  Take the quiz
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="flex flex-col justify-between gap-6 rounded-[1.75rem] bg-surface-2 p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Strength explained</p>
                <h2 className="mt-2 font-display text-3xl font-medium md:text-4xl">
                  EDT, EDP or <span className="accent">Parfum</span>?
                </h2>
              </div>
              <ConcentrationBars />
              <ButtonLink href="/scent-guide" variant="ghost">
                Read the Scent Guide
              </ButtonLink>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
