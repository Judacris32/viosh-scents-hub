import type { LegalSection } from '@/content/pages';
import { Container, PageHero, Section } from '@/components/ui';
import { Reveal } from '@/components/motion';

export function LegalPage({ kicker, title, intro, sections, updated }: { kicker: string; title: string; intro: string; sections: LegalSection[]; updated: string }) {
  return (
    <>
      <PageHero kicker={kicker} title={title} intro={intro} crumbs={[{ label: 'Home', href: '/' }, { label: kicker }]} image="/hero/help.jpg" imagePosition="100% center" overlay="strong" />
      <Section tone="base">
        <Container className="max-w-3xl">
          <p className="text-muted mb-10 text-center text-sm">Last updated: {updated}</p>
          <div className="grid gap-6">
            {sections.map((s) => (
              <Reveal key={s.heading}>
                <section className="rounded-[1.75rem] bg-surface p-7 shadow-soft md:p-9">
                  <h2 className="font-display text-2xl font-medium">{s.heading}</h2>
                  <div className="text-muted mt-3 grid gap-3 leading-relaxed">
                    {s.body.map((b) => (
                      <p key={b}>{b}</p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
          {process.env.NODE_ENV !== 'production' ? (
          <p className="text-muted mt-10 rounded-2xl border border-dashed border-ink/25 p-5 text-center text-sm">
            This policy is a starting template. Please have it reviewed for your business and location before launch.
          </p>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
