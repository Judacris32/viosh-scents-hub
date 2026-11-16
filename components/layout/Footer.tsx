import Link from 'next/link';
import { footerNav } from '@/content/navigation';
import { store } from '@/content/store';
import { Container, Icon } from '@/components/ui';
import { Logo } from '@/components/ui/Logo';
import type { IconName } from '@/components/ui/Icon';

const trust: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: 'Authenticity first', text: '[CONFIRM] sourcing statement' },
  { icon: 'truck', title: 'Nationwide delivery', text: `From ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(store.shipping.standardFee)}` },
  { icon: 'gift', title: 'Gift-ready packing', text: 'On every order' },
  { icon: 'chat', title: 'Real help, fast', text: 'We reply on WhatsApp' },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative bg-wine-night text-cream" data-tone="night">
      {/* Trust strip */}
      <div className="border-b border-cream/12">
        <Container>
          <ul className="grid gap-px py-2 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((t) => (
              <li key={t.title} className="flex items-center gap-3 px-1 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <Icon name={t.icon} size={19} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{t.title}</span>
                  <span className="block truncate text-xs text-cream/60">{t.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <Container className="relative py-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex flex-col gap-5">
            <Logo tone="light" />
            <p className="max-w-sm text-sm leading-relaxed text-cream/70">{store.description}</p>
            <div className="flex flex-col gap-2 text-sm">
              <a href={`mailto:${store.email}`} className="link-underline w-fit font-semibold text-gold">
                {store.email}
              </a>
              <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer" className="link-underline w-fit text-cream/80">
                {store.whatsappDisplay} · WhatsApp
              </a>
              <p className="text-cream/60">{store.hours}</p>
            </div>
            <ul className="flex gap-2" aria-label="Social media">
              {store.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition-[background-color,color,border-color,transform] duration-500 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-wine-night"
                  >
                    <Icon name={s.icon as IconName} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h2 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.22em] text-gold">{col.title}</h2>
                <ul className="flex flex-col gap-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-underline text-cream/75 transition-colors duration-300 hover:text-cream">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream/12 pt-6 text-sm text-cream/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {store.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <Icon name="lock" size={14} /> Secure ordering · Card payment coming soon [CONFIRM]
          </p>
        </div>
      </Container>
    </footer>
  );
}
