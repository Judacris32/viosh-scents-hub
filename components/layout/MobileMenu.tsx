'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { shopMenu, quickLinks } from '@/content/navigation';
import { store } from '@/content/store';
import { useModal } from '@/lib/hooks';
import { EASE, cn } from '@/lib/format';
import { Logo } from '@/components/ui/Logo';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ThemeToggle } from './ThemeToggle';

const extra = [
  { label: 'Fragrance Finder', href: '/finder' },
  { label: 'Scent Guide', href: '/scent-guide' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
];

export function MobileMenu({ open, onClose, isActive }: { open: boolean; onClose: () => void; isActive: (h: string) => boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(open, onClose, ref);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 bg-wine-night/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-bg text-ink"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-bg px-5 py-4">
              <Link href="/" onClick={onClose} aria-label="Viosh Scents Hub home">
                <Logo />
              </Link>
              <button type="button" onClick={onClose} className="icon-btn" aria-label="Close menu" data-autofocus>
                <Icon name="close" />
              </button>
            </div>

            <div className="px-5 py-6">
              {/* Quick shop links */}
              <ul className="grid grid-cols-2 gap-2.5">
                {quickLinks.map((q, i) => (
                  <motion.li key={q.href} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.03, duration: 0.45, ease: EASE }}>
                    <Link
                      href={q.href}
                      onClick={onClose}
                      className="flex items-center gap-2.5 rounded-2xl bg-surface px-4 py-3.5 text-sm font-semibold shadow-soft transition-colors duration-300 hover:bg-gold hover:text-wine-night"
                    >
                      <Icon name={q.icon as IconName} size={18} />
                      {q.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {shopMenu.map((col) => (
                <div key={col.title} className="mt-8">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">{col.title}</p>
                  <ul className="flex flex-col">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={onClose}
                          className={cn('flex items-center justify-between border-b border-ink/8 py-3 font-display text-xl transition-colors duration-300 hover:text-plum', isActive(l.href) && 'text-plum')}
                        >
                          {l.label}
                          <Icon name="chevron-right" size={17} className="opacity-40" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="mt-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">More</p>
                <ul className="flex flex-wrap gap-2">
                  {extra.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} onClick={onClose} className="chip">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex items-center justify-between rounded-2xl bg-surface-2 p-4">
                <span className="text-sm font-semibold">Appearance</span>
                <ThemeToggle />
              </div>

              <a
                href={`https://wa.me/${store.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1F9D55] font-semibold text-white"
              >
                <Icon name="whatsapp" size={19} /> Chat with us
              </a>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
