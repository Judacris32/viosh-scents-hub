import { pageMeta } from '@/lib/seo';
import { pyramid, applySteps, layeringTips, storageTips } from '@/content/guide';
import { Container, PageHero, Section, SectionHeading, Icon, ButtonLink } from '@/components/ui';
import type { IconName } from '@/components/ui/Icon';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { ConcentrationBars } from '@/components/home/HomeSections';
import { FamilyWheel, Glossary } from '@/components/guide/GuideParts';

export const metadata = pageMeta({
  title: 'Scent Guide',
  description: 'Perfume explained simply: top, heart and base notes, scent families, EDT vs EDP, how to apply fragrance so it lasts, layering tips and an A–Z glossary.',
  path: '/scent-guide',
});

const pyramidStyle = ['bg-gold', 'bg-blush', 'bg-rose'];
const applyIcons: IconName[] = ['drop', 'heart', 'sparkle', 'close', 'leaf'];

export default function ScentGuidePage() {
  return (
    <>
      <PageHero
        kicker="Scent Guide"
        title="Perfume, explained *simply*"
        intro="Everything you need to choose, wear and love fragrance, without the jargon. Jump to a section below."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Scent Guide' }]}
        image="/hero/guide.jpg"
      >
        <nav aria-label="On this page" className="mt-4 flex flex-wrap justify-center gap-2">
          {[
            ['Notes', '#pyramid'],
            ['Families', '#families'],
            ['Strength', '#strength'],
            ['How to apply', '#apply'],
            ['Layering', '#layering'],
            ['Glossary', '#glossary'],
          ].map(([l, h]) => (
            <a key={h} href={h} className="chip">
              {l}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section tone="base" id="pyramid" className="scroll-mt-20">
        <Container>
          <SectionHeading kicker="The notes pyramid" title="Every perfume has *three* acts" intro="Fragrance changes as it dries. Perfumers build it in layers that reveal themselves one after another." />
          <Stagger className="mt-14 grid gap-5 lg:grid-cols-3">
            {pyramid.map((p, i) => (
              <StaggerItem key={p.layer}>
                <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface shadow-soft">
                  <div className={`${pyramidStyle[i]} relative px-7 pb-6 pt-8 text-wine-night`}>
                    <svg viewBox="0 0 120 60" className="absolute right-5 top-5 h-12 w-24 opacity-40" aria-hidden="true">
                      {[0, 1, 2].map((k) => (
                        <rect key={k} x={30 - k * 15} y={k * 20} width={60 + k * 30} height="16" rx="8" fill={k === i ? '#4B0F2F' : '#1F0512'} opacity={k === i ? 1 : 0.25} />
                      ))}
                    </svg>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-75">{p.when}</p>
                    <h3 className="mt-2 font-display text-3xl font-medium">{p.layer}</h3>
                  </div>
                  <div className="flex flex-1 flex-col gap-5 p-7">
                    <p className="text-muted leading-relaxed">{p.text}</p>
                    <ul className="mt-auto flex flex-wrap gap-2">
                      {p.examples.map((e) => (
                        <li key={e} className="rounded-full bg-ink/[0.06] px-3 py-1.5 text-sm font-semibold">
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section tone="blush" id="families" className="scroll-mt-20">
        <Container>
          <SectionHeading kicker="Scent families" title="Find your *family*" intro="Most perfumes belong to one of these families. Tap around the wheel to explore each one." />
          <div className="mt-14">
            <FamilyWheel />
          </div>
        </Container>
      </Section>

      <Section tone="rose" id="strength" className="scroll-mt-20">
        <Container>
          <SectionHeading kicker="Strength" title="What the label *really* means" intro="Concentration ranges vary from house to house, but these are the typical figures." />
          <div className="mx-auto mt-12 max-w-4xl">
            <ConcentrationBars />
            <Reveal className="text-muted mt-6 text-center text-sm">
              Longevity also depends on the notes: gold fades faster, while woods, resins and vanilla linger.
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="wine" id="apply" className="scroll-mt-20">
        <div className="grain absolute inset-0" aria-hidden="true" />
        <Container className="relative">
          <SectionHeading kicker="How to apply" title="Make your scent *last*" intro="A few small habits make a big difference to how long fragrance stays with you." />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {applySteps.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="flex h-full flex-col gap-4 rounded-[1.75rem] bg-cream/[0.07] p-6 ring-1 ring-inset ring-cream/15 transition-colors duration-500 hover:bg-cream/[0.13]">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-wine-night">
                    <Icon name={applyIcons[i]} size={20} />
                  </span>
                  <h3 className="font-display text-xl font-medium leading-tight">{s.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{s.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section tone="mauve" id="layering" className="scroll-mt-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading align="left" size="md" kicker="Layering" title="Create a scent that’s *yours*" className="items-center text-center lg:items-start lg:text-left" />
              <Stagger className="mt-8 grid gap-3">
                {layeringTips.map((t) => (
                  <StaggerItem key={t.title}>
                    <div className="flex gap-4 rounded-[1.4rem] bg-bg p-5 shadow-soft">
                      <Icon name="sparkle" size={22} className="mt-0.5 shrink-0 text-berry" />
                      <div>
                        <h3 className="font-sans text-base font-bold">{t.title}</h3>
                        <p className="text-muted mt-1 text-sm leading-relaxed">{t.text}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
            <div>
              <SectionHeading align="left" size="md" kicker="Storage" title="Keep it *fresh*" className="items-center text-center lg:items-start lg:text-left" />
              <Reveal className="mt-8 rounded-[1.75rem] bg-wine p-7 text-cream">
                <ul className="grid gap-4">
                  {storageTips.map((t) => (
                    <li key={t} className="flex gap-3 leading-relaxed">
                      <Icon name="check" size={20} className="mt-0.5 shrink-0 text-gold" />
                      <span className="text-cream/85">{t}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="base" id="glossary" className="scroll-mt-20">
        <Container>
          <SectionHeading kicker="A–Z glossary" title="Words you’ll *hear* a lot" intro="The terms perfume lovers use, in plain English." />
          <div className="mt-12">
            <Glossary />
          </div>
          <Reveal className="mt-14 flex justify-center">
            <ButtonLink href="/finder" icon="spray">
              Ready? Take the Fragrance Finder
            </ButtonLink>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
