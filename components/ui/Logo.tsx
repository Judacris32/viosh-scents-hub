import Image from 'next/image';
import { cn } from '@/lib/format';

/** Viosh emblem: a faceted crystal stopper inside a gold ring (public/logo-mark.png), set on a wine disc. */
export function LogoMark({ className }: { className?: string; tone?: 'auto' | 'light' }) {
  return (
    <span className={cn('relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-wine', className)}>
      <Image src="/logo-mark.png" alt="" width={64} height={64} className="h-[82%] w-[82%] object-contain" priority />
    </span>
  );
}

export function Logo({ className, tone = 'auto' }: { className?: string; tone?: 'auto' | 'light' }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-10 w-10" tone={tone} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.6rem] font-semibold tracking-[0.02em]">Viosh</span>
        <span className="mt-0.5 whitespace-nowrap text-[0.52rem] font-bold uppercase tracking-[0.3em] opacity-75 sm:text-[0.56rem] sm:tracking-[0.34em]">Scents Hub</span>
      </span>
    </span>
  );
}
