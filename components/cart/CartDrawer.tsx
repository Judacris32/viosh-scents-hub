'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { useCart, useUI } from '@/lib/store';
import { useModal } from '@/lib/hooks';
import { EASE, formatPrice } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui';
import { CartLines, FreeShippingNote, WhatsAppOrderButton } from './CartParts';

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const { lines, subtotal, count } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  useModal(open, close, ref);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80]">
          <motion.button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 bg-wine-night/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-[460px] flex-col bg-bg text-ink shadow-lift sm:bottom-3 sm:right-3 sm:top-3 sm:rounded-4xl"
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <h2 id="bag-title" className="font-display text-3xl font-medium">
                Your bag <span className="text-muted text-lg font-normal">({count})</span>
              </h2>
              <button type="button" onClick={close} className="icon-btn" aria-label="Close bag" data-autofocus>
                <Icon name="close" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-blush text-wine">
                  <Icon name="bag" size={40} strokeWidth={1.4} />
                </div>
                <p className="font-display text-2xl">Your bag is empty</p>
                <p className="text-muted">Not sure where to start? Our Fragrance Finder will point you in the right direction.</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/shop" onClick={close}>
                    Shop all
                  </ButtonLink>
                  <ButtonLink href="/finder" variant="ghost" icon="spray" onClick={close}>
                    Take the quiz
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  <FreeShippingNote subtotal={subtotal} />
                  <CartLines lines={lines} onNavigate={close} />
                </div>
                <div className="border-t border-ink/10 px-6 pb-6 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-display text-2xl font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-muted mt-1 text-sm">Delivery is worked out at the next step.</p>
                  <div className="mt-5 grid gap-3">
                    <WhatsAppOrderButton lines={lines} subtotal={subtotal} />
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/cart"
                        onClick={close}
                        className="flex h-12 items-center justify-center rounded-full border border-ink/20 font-semibold transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-bg"
                      >
                        View bag
                      </Link>
                      <Link
                        href="/checkout"
                        onClick={close}
                        className="flex h-12 items-center justify-center rounded-full bg-wine font-semibold text-cream transition-colors duration-500 hover:bg-gold hover:text-wine-night dark:bg-gold dark:text-wine-night dark:hover:bg-blush"
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
