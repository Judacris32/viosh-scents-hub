import { Container, Section, ButtonLink, Kicker } from '@/components/ui';
import { HeroBotanicals } from '@/components/home/HeroArt';

export default function NotFound() {
  return (
    <Section tone="wine" className="flex min-h-[100svh] items-center pt-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <HeroBotanicals subtle />
      </div>
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <Kicker className="text-gold">Page not found</Kicker>
        <p className="font-display text-[clamp(6rem,22vw,16rem)] font-semibold leading-none tracking-tighter text-gold" aria-hidden="true">
          4<span className="italic text-blush">0</span>4
        </p>
        <h1 className="text-display-md max-w-xl font-medium">
          This scent has <span className="accent">drifted away</span>
        </h1>
        <p className="text-muted max-w-md text-lg">The page you’re looking for may have moved. Let’s get you back to something lovely.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="gold">
            Back home
          </ButtonLink>
          <ButtonLink href="/shop" variant="ghost" icon="bag">
            Visit the shop
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
