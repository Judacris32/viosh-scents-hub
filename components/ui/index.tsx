import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/format';
import { AccentText, SplitWords, Reveal } from '@/components/motion';
import { Icon, type IconName } from './Icon';

export { Icon };

export type Tone = 'base' | 'surface' | 'blush' | 'rose' | 'mauve' | 'gold' | 'plum' | 'wine' | 'night' | 'berry';

export function Container({ children, className, as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'nav' | 'header' }) {
  return <Tag className={cn('mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12', className)}>{children}</Tag>;
}

export function Section({
  children,
  tone = 'base',
  className,
  id,
  size = 'md',
  ...rest
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
} & Omit<ComponentProps<'section'>, 'children'>) {
  const pad = { sm: 'py-14 md:py-20', md: 'py-20 md:py-28', lg: 'py-24 md:py-36' }[size];
  return (
    <section id={id} data-tone={tone} className={cn('relative overflow-hidden', pad, className)} {...rest}>
      {children}
    </section>
  );
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-[0.78rem] font-bold uppercase tracking-[0.22em]', className)}>
      <span className="h-px w-6 bg-current opacity-60" aria-hidden="true" />
      {children}
      <span className="h-px w-6 bg-current opacity-60" aria-hidden="true" />
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  intro,
  align = 'center',
  as = 'h2',
  className,
  size = 'lg',
}: {
  kicker?: string;
  title: string;
  intro?: ReactNode;
  align?: 'center' | 'left';
  as?: 'h1' | 'h2';
  className?: string;
  size?: 'xl' | 'lg' | 'md';
}) {
  const sizeClass = { xl: 'text-display-xl', lg: 'text-display-lg', md: 'text-display-md' }[size];
  return (
    <div className={cn('flex flex-col gap-5', align === 'center' ? 'mx-auto max-w-3xl items-center text-center' : 'items-start', className)}>
      {kicker ? (
        <Reveal y={12}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
      ) : null}
      <SplitWords as={as} text={title} className={cn(sizeClass, 'text-balance font-medium')} />
      {intro ? (
        <Reveal delay={0.15} className={cn('text-muted text-pretty text-lg leading-relaxed', align === 'center' && 'max-w-2xl')}>
          {intro}
        </Reveal>
      ) : null}
    </div>
  );
}

type BtnVariant = 'primary' | 'gold' | 'light' | 'ghost';

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  icon = 'arrow',
  className,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: BtnVariant;
  icon?: IconName;
  className?: string;
  external?: boolean;
} & Omit<ComponentProps<'a'>, 'href' | 'children'>) {
  const inner = (
    <>
      <span className="relative">{children}</span>
      <span className="btn-badge">
        <Icon name={icon} size={18} />
      </span>
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn('btn', `btn-${variant}`, className)} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cn('btn', `btn-${variant}`, className)} {...rest}>
      {inner}
    </Link>
  );
}

export function Button({
  children,
  variant = 'primary',
  icon = 'arrow',
  className,
  ...rest
}: { children: ReactNode; variant?: BtnVariant; icon?: IconName; className?: string } & ComponentProps<'button'>) {
  return (
    <button type="button" className={cn('btn', `btn-${variant}`, className)} {...rest}>
      <span className="relative">{children}</span>
      <span className="btn-badge">
        <Icon name={icon} size={18} />
      </span>
    </button>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium opacity-80">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {it.href ? (
              <Link href={it.href} className="link-underline">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page">{it.label}</span>
            )}
            {i < items.length - 1 ? <Icon name="chevron-right" size={14} /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  kicker,
  title,
  intro,
  crumbs,
  tone = 'wine',
  image,
  imagePosition = 'center',
  overlay = 'normal',
  art,
  children,
}: {
  kicker: string;
  title: string;
  intro?: ReactNode;
  crumbs: { label: string; href?: string }[];
  tone?: Tone;
  /** Full-bleed photo behind the hero (public path). The copy sits on a dark overlay. */
  image?: string;
  imagePosition?: string;
  /** 'strong' for photos with busy detail behind the copy */
  overlay?: 'normal' | 'strong';
  art?: ReactNode;
  children?: ReactNode;
}) {
  const photo = !!image;
  return (
    <Section tone={photo ? 'night' : tone} className={cn('pb-16 pt-36 md:pb-24 md:pt-44', photo && 'on-dark min-h-[70svh] md:min-h-[76svh] flex items-center')} size="sm">
      {photo ? (
        <div className="absolute inset-0" aria-hidden="true">
          <HeroPhoto src={image!} position={imagePosition} soft={overlay === 'strong'} />
          <div className={cn('absolute inset-0', overlay === 'strong' ? 'bg-[radial-gradient(ellipse_75%_80%_at_50%_55%,rgba(31,5,18,0.9)_0%,rgba(31,5,18,0.72)_55%,rgba(31,5,18,0.45)_100%)]' : 'bg-[radial-gradient(ellipse_70%_70%_at_50%_55%,rgba(31,5,18,0.78)_0%,rgba(31,5,18,0.55)_55%,rgba(31,5,18,0.3)_100%)]')} />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-wine-night/70 to-transparent" />
        </div>
      ) : art ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {art}
        </div>
      ) : null}
      <div className="grain absolute inset-0" aria-hidden="true" />
      <Container className="relative flex w-full flex-col items-center gap-6 text-center">
        <Reveal y={10}>
          <Breadcrumb items={crumbs} />
        </Reveal>
        <Reveal y={10} delay={0.05}>
          <Kicker className={photo ? 'text-gold' : undefined}>{kicker}</Kicker>
        </Reveal>
        <SplitWords as="h1" immediate delay={0.1} text={title} className="text-display-xl max-w-4xl text-balance font-medium" />
        {intro ? (
          <Reveal delay={0.25} className="text-muted max-w-2xl text-pretty text-lg leading-relaxed">
            {intro}
          </Reveal>
        ) : null}
        {children}
      </Container>
    </Section>
  );
}

function HeroPhoto({ src, position, soft }: { src: string; position: string; soft?: boolean }) {
  return <Image src={src} alt="" fill priority sizes="100vw" className={cn('object-cover', soft && 'scale-105 blur-[6px]')} style={{ objectPosition: position }} />;
}

export function Accent({ children }: { children: string }) {
  return <AccentText text={`*${children}*`} />;
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em]', className)}>
      {children}
    </span>
  );
}
