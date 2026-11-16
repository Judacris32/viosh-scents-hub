'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE } from '@/lib/format';

/** Page transition: a coloured curtain lifts away as each page enters. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="page-curtain pointer-events-none fixed inset-0 z-[95] origin-top bg-wine"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.05 }}
        style={{ transformOrigin: 'top' }}
      >
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-wine to-gold"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
      <motion.div data-reveal initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}>
        {children}
      </motion.div>
    </>
  );
}
