'use client';

import { usePathname } from 'next/navigation';
import { store } from '@/content/store';
import Image from 'next/image';
import { Container, ButtonLink, Kicker } from '@/components/ui';
import { CopyButton } from '@/components/ui/CopyButton';
import { Reveal, SplitWords, Magnetic } from '@/components/motion';

const HIDE_ON = ['/contact', '/checkout', '/cart'];

export function CtaBanner() {
  const pathname = usePathname();
  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <section className="bg-bg pb-6 pt-16 md:pt-24" aria-labelledby="cta-title">
      <Container>
        <div className="on-dark relative isolate overflow-hidden rounded-[2rem] bg-wine-deep px-6 py-16 text-center text-cream md:rounded-5xl md:px-12 md:py-24">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <Image src="/hero/collections.jpg" alt="" fill sizes="1280px" className="object-cover opacity-75" />
          </div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(31,5,18,0.8)_0%,rgba(54,8,31,0.62)_50%,rgba(54,8,31,0.4)_100%)]" aria-hidden="true" />
          <div className="grain absolute inset-0 -z-10" aria-hidden="true" />

          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
            <Reveal y={10}>
              <Kicker className="text-gold">Need a hand choosing?</Kicker>
            </Reveal>
            <SplitWords as="h2" text="Let’s find your *signature* scent" className="text-display-lg text-balance font-medium" />
            <Reveal delay={0.15} className="max-w-xl text-lg text-cream/80">
              Tell us what you love and we’ll suggest a shortlist, or send us a message and talk it through with a real person.
            </Reveal>
            <Reveal delay={0.25} className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              <Magnetic>
                <ButtonLink href="/finder" variant="gold" icon="spray">
                  Take the Fragrance Finder
                </ButtonLink>
              </Magnetic>
              <CopyButton text={store.email} />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
