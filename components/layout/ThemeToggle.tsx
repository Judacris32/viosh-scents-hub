'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useHydrated } from '@/lib/store';
import { cn } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';

export function ThemeToggle({ className, large = false }: { className?: string; large?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = hydrated && resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  if (large) {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn('relative flex h-12 w-24 items-center rounded-full border border-white/25 p-1', className)}
        aria-label={label}
        aria-pressed={isDark}
      >
        <motion.span
          className="grid h-10 w-10 place-items-center rounded-full bg-gold text-wine-night"
          animate={{ x: isDark ? 46 : 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        >
          <Icon name={isDark ? 'moon' : 'sun'} size={18} />
        </motion.span>
      </button>
    );
  }

  return (
    <button type="button" onClick={() => setTheme(isDark ? 'light' : 'dark')} className={cn('icon-btn overflow-hidden', className)} aria-label={label} title={label}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid place-items-center"
        >
          <Icon name={isDark ? 'moon' : 'sun'} size={20} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
