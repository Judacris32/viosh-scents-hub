'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart, useShop, useHydrated, useUI } from '@/lib/store';
import { cn } from '@/lib/format';
import { Icon, type IconName } from '@/components/ui/Icon';

/** App-style bottom navigation. Phones and tablets only. */
export function MobileTabBar() {
  const pathname = usePathname();
  const { count } = useCart();
  const hydrated = useHydrated();
  const wish = useShop((s) => s.wishlist.length);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);

  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const tabs: { label: string; icon: IconName; href?: string; onClick?: () => void; badge?: number; isActive: boolean }[] = [
    { label: 'Home', icon: 'home', href: '/', isActive: active('/') },
    { label: 'Shop', icon: 'grid', href: '/shop', isActive: active('/shop') || active('/collections') },
    { label: 'Search', icon: 'search', onClick: () => setSearchOpen(true), isActive: false },
    { label: 'Saved', icon: 'heart', href: '/wishlist', badge: hydrated ? wish : 0, isActive: active('/wishlist') },
    { label: 'Bag', icon: 'bag', onClick: () => setCartOpen(true), badge: count, isActive: false },
  ];

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-[rgb(var(--surface)/0.92)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {tabs.map((t) => {
          const inner = (
            <>
              <span className="relative">
                <Icon name={t.icon} size={21} strokeWidth={t.isActive ? 2.1 : 1.7} />
                {t.badge ? (
                  <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-berry px-1 text-[0.6rem] font-bold text-cream">{t.badge}</span>
                ) : null}
              </span>
              <span className="text-[0.63rem] font-semibold">{t.label}</span>
              {t.isActive ? <motion.span layoutId="tab-dot" className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-gold" /> : null}
            </>
          );
          const cls = cn('relative flex w-full flex-col items-center justify-center gap-1 py-2.5 transition-colors duration-300', t.isActive ? 'text-ink' : 'text-ink-soft');
          return (
            <li key={t.label} className="flex-1">
              {t.href ? (
                <Link href={t.href} className={cls} aria-current={t.isActive ? 'page' : undefined}>
                  {inner}
                </Link>
              ) : (
                <button type="button" onClick={t.onClick} className={cls} aria-label={t.label}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
