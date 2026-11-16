import Link from 'next/link';
import { store } from '@/content/store';
import { pageMeta } from '@/lib/seo';
import { Container, PageHero, Section, Icon } from '@/components/ui';
import type { IconName } from '@/components/ui/Icon';
import { CopyButton } from '@/components/ui/CopyButton';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { LiveTime } from '@/components/layout/LiveTime';

export const metadata = pageMeta({
  title: 'Contact us',
  description: 'Questions about a fragrance, an order or a gift? Message Viosh Scents Hub on WhatsApp or by email.',
  path: '/contact',
});

export default function ContactPage() {
  const ways = [
    { icon: 'whatsapp', title: 'WhatsApp', text: 'Fastest for orders and quick questions.', value: store.whatsappDisplay, href: `https://wa.me/${store.whatsapp}`, cta: 'Start a chat', tone: 'bg-rose' },
    { icon: 'instagram', title: 'Instagram', text: 'New arrivals, reels and behind the scenes.', value: '@[HANDLE]', href: store.socials[0].href, cta: 'Follow us', tone: 'bg-blush' },
    { icon: 'pin', title: 'Visit', text: store.hours, value: store.address, href: '/faq', cta: 'Read the FAQ', tone: 'bg-mauve' },
  ];
  return (
    <>
      <PageHero
        kicker="Contact"
        title="We’d love to *hear* from you"
        intro="Need help choosing a scent, checking an order or planning a gift? Send us a message and a real person will get back to you."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        image="/hero/contact.jpg"
      />

      <Section tone="base">
        <Container>
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">Email us</p>
            <a href={`mailto:${store.email}`} className="link-underline break-all font-display text-[clamp(2rem,6vw,4.5rem)] font-medium leading-none tracking-tight">
              {store.email}
            </a>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={`mailto:${store.email}`} className="btn btn-primary">
                <span className="relative">Write an email</span>
                <span className="btn-badge">
                  <Icon name="mail" size={18} />
                </span>
              </a>
              <CopyButton text={store.email} className="h-14" />
            </div>
            <p className="text-muted text-sm">
              It’s {store.city} time now: <LiveTime tz={store.timeZone} className="font-semibold text-ink" /> · We usually reply within one working day. [CONFIRM]
            </p>
          </Reveal>

          <Stagger className="mt-16 grid gap-5 md:grid-cols-3">
            {ways.map((w) => (
              <StaggerItem key={w.title}>
                <div className={`flex h-full flex-col gap-4 rounded-[1.75rem] p-7 text-wine-night shadow-soft transition-transform duration-500 hover:-translate-y-1.5 ${w.tone}`}>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-wine-night text-gold">
                    <Icon name={w.icon as IconName} size={22} />
                  </span>
                  <h2 className="font-display text-2xl font-medium">{w.title}</h2>
                  <p className="opacity-80">{w.text}</p>
                  <p className="font-semibold">{w.value}</p>
                  {w.href.startsWith('/') ? (
                    <Link href={w.href} className="mt-auto flex items-center gap-2 font-semibold underline-offset-4 hover:underline">
                      {w.cta} <Icon name="arrow" size={17} />
                    </Link>
                  ) : (
                    <a href={w.href} target="_blank" rel="noopener noreferrer" className="mt-auto flex items-center gap-2 font-semibold underline-offset-4 hover:underline">
                      {w.cta} <Icon name="arrow-up-right" size={17} />
                    </a>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
