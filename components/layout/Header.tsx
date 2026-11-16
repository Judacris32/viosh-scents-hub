'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { mainNav, shopMenu } from '@/content/navigation';
import { products } from '@/content/products';
import { useCart, useShop, useHydrated, useUI } from '@/lib/store';
import { cn, EASE, formatPrice } from '@/lib/format';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mega, setMega] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const { count } = useCart();
  const wishCount = useShop((s) => s.wishlist.length);
  const hydrated = useHydrated();
  const setCartOpen = useUI((s) => s.setCartOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (menuOpen || mega) return;
    setHidden(y > 320 && y > prev + 4 ? true : y < prev - 4 ? false : hidden);
  });

  useEffect(() => {
    setMenuOpen(false);
    setMega(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setMega(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setSearchOpen]);

  const openMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), 140);
  };

  const isActive = (href: string) => {
    const base = href.split('?')[0];
    return base === '/' ? pathname === '/' : pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
        style={{ scaleX: progress, background: 'linear-gradient(90deg,#8C3A62,#D4B06A 50%,#D9A1B3)' }}
        aria-hidden="true"
      />
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
        onMouseLeave={closeMega}
      >
        {/* Promo bar */}
        <div className="bg-wine-night text-cream">
          <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-center gap-2 px-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
            <Icon name="truck" size={14} className="text-gold" />
            <span className="truncate">Nationwide delivery · Order on WhatsApp in one tap</span>
          </div>
        </div>

        <div className={cn('transition-[background-color,box-shadow] duration-500 ease-silk', scrolled || mega ? 'bg-surface shadow-lift' : 'bg-[rgb(var(--header-glass)/0.82)] backdrop-blur-xl')}>
          <nav aria-label="Main" className="mx-auto flex h-[4.25rem] w-full max-w-[1280px] items-center justify-between gap-3 px-4 md:px-8 lg:px-12">
            <Link href="/" className="rounded-full" aria-label="Viosh Scents Hub home">
              <Logo />
            </Link>

            <ul className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setHovered(null)}>
              {mainNav.map((item) => (
                <li key={item.href} className="relative" onMouseEnter={item.mega ? openMega : closeMega}>
                  <Link
                    href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    onFocus={() => {
                      setHovered(item.href);
                      if (item.mega) openMega();
                    }}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    aria-expanded={item.mega ? mega : undefined}
                    className="relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.92rem] font-semibold"
                  >
                    {isActive(item.href) ? <span className="h-1.5 w-1.5 rounded-full bg-berry" aria-hidden="true" /> : null}
                    {item.label}
                    {item.mega ? <Icon name="chevron-down" size={14} className={cn('transition-transform duration-300', mega && 'rotate-180')} /> : null}
                  </Link>
                  {hovered === item.href ? (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink/[0.07]" transition={{ type: 'spring', stiffness: 380, damping: 32 }} aria-hidden="true" />
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-0.5 md:gap-1">
              <button type="button" className="icon-btn hidden sm:grid" aria-label="Search fragrances" title="Search (Ctrl + K)" onClick={() => setSearchOpen(true)}>
                <Icon name="search" />
              </button>
              <ThemeToggle className="hidden sm:grid" />
              <Link href="/wishlist" className="icon-btn hidden sm:grid" aria-label={`Wishlist${hydrated && wishCount ? `, ${wishCount} saved` : ''}`}>
                <Icon name="heart" />
                {hydrated && wishCount > 0 ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-berry" aria-hidden="true" /> : null}
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="btn btn-primary ml-1 !gap-2 !py-1.5 !pl-4 !pr-1.5 text-sm"
                aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
              >
                <Icon name="bag" size={18} className="relative sm:hidden" />
                <span className="relative hidden sm:inline">Bag</span>
                <span className="btn-badge !h-9 !w-9 !rotate-0">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={count} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="text-sm font-bold tabular-nums">
                      {count}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-ink/[0.07] transition-colors duration-500 hover:bg-gold hover:text-wine-night lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                <Icon name="menu" />
              </button>
            </div>
          </nav>

          {/* Shop mega menu */}
          <AnimatePresence>
            {mega ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="hidden border-t border-ink/10 bg-surface lg:block"
                onMouseEnter={openMega}
              >
                <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(3,minmax(0,1fr))_1.1fr] gap-10 px-12 py-9">
                  {shopMenu.map((col) => (
                    <div key={col.title}>
                      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">{col.title}</p>
                      <ul className="flex flex-col gap-2.5">
                        {col.links.map((l) => (
                          <li key={l.href}>
                            <Link href={l.href} className="link-underline text-[0.95rem] font-medium" onClick={() => setMega(false)}>
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">Trending now</p>
                    <ul className="flex flex-col gap-2">
                      {products
                        .filter((p) => p.bestseller)
                        .slice(0, 3)
                        .map((p) => (
                          <li key={p.slug}>
                            <Link href={`/shop/${p.slug}`} onClick={() => setMega(false)} className="group flex items-center gap-3 rounded-2xl p-2 transition-colors duration-300 hover:bg-ink/[0.05]">
                              <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl" style={{ background: p.tint }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.image} alt="" className="h-full w-full object-contain p-1 mix-blend-multiply" loading="lazy" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold">{p.name}</span>
                                <span className="text-muted block text-xs">
                                  {p.brand} · {formatPrice(Math.min(...p.sizes.map((s) => s.price)))}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
    </>
  );
}
