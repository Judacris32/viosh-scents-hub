'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useUI } from '@/lib/store';
import { EASE } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';

export function Toast() {
  const toast = useUI((s) => s.toast);
  const setCartOpen = useUI((s) => s.setCartOpen);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => useUI.setState({ toast: null }), 3600);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[85] flex justify-center px-4" aria-live="polite" role="status">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-wine-night py-2 pl-3 pr-2 text-cream shadow-lift"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-rose text-wine-night">
              <Icon name="check" size={16} strokeWidth={2.4} />
            </span>
            <span className="text-sm font-medium">{toast.text}</span>
            <button
              type="button"
              onClick={() => {
                setCartOpen(true);
                useUI.setState({ toast: null });
              }}
              className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-wine-night transition-colors duration-500 hover:bg-cream"
            >
              View bag
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
