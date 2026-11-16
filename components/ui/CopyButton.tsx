'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/format';
import { Icon } from './Icon';

export function CopyButton({ text, label = 'Copy email', className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}
      className={cn(
        'inline-flex h-12 items-center gap-2 rounded-full border-[1.5px] border-current px-5 text-sm font-semibold transition-[background-color,color] duration-500 hover:bg-cream hover:text-wine-night',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={copied ? 'y' : 'n'} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} className="flex items-center gap-2">
          <Icon name={copied ? 'check' : 'copy'} size={17} />
          {copied ? 'Copied!' : label}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </span>
    </button>
  );
}
