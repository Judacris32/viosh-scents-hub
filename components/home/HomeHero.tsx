'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { home } from '@/content/home';
import { EASE } from '@/lib/format';
import { Container, ButtonLink, Kicker, Icon } from '@/components/ui';
import { Magnetic, SplitWords } from '@/components/motion';
import { HeroBotanicals } from './HeroArt';
import { CategoryRail } from './HomeSections';

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yA = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const [l1, l2, accent, l3] = home.hero.title;

  return (
    <section ref={ref} data-tone="wine" className="on-dark relative flex min-h-[86svh] items-center overflow-hidden bg-wine pb-16 pt-32 text-cream md:pb-20 md:pt-36">
      <motion.div className="absolute inset-0" style={{ scale: bgScale }} initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: EASE }}>
        <Image src="/hero/home.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[65%_45%] opacity-80" />
        <HeroBotanicals subtle />
      </motion.div>

      <FloatingBottle src="/hero/bottle-ruby.jpg" y={yA} delay={0.4} className="absolute bottom-[-10%] left-[-16%] w-[40vw] max-w-[230px] sm:left-[-4%] md:bottom-[-8%] md:left-[2%] md:w-[26vh] md:max-w-[300px]" />
      <FloatingBottle src="/hero/bottle-burgundy.jpg" y={yB} delay={0.55} className="absolute bottom-[-12%] right-[-16%] w-[40vw] max-w-[230px] sm:right-[-4%] md:bottom-[-10%] md:right-[2%] md:w-[28vh] md:max-w-[320px]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_62%_at_50%_46%,rgba(31,5,18,0.84)_0%,rgba(31,5,18,0.56)_55%,rgba(31,5,18,0.14)_100%)]" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />

      <Container className="relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}>
            <Kicker className="text-gold">{home.hero.kicker}</Kicker>
          </motion.div>
          <SplitWords as="h1" immediate delay={0.3} text={`${l1} ${l2} *${accent}* ${l3}`} className="text-display-2xl text-balance font-medium" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
            className="max-w-xl text-pretty text-base leading-relaxed text-cream/85 md:text-lg"
          >
            {home.hero.intro}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.95 }} className="flex flex-col items-center gap-3 sm:flex-row">
            <Magnetic>
              <ButtonLink href="/shop" variant="gold" icon="bag">
                Shop all 37 fragrances
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="/finder" variant="ghost" icon="spray">
              Find your scent
            </ButtonLink>
          </motion.div>

          {/* Shoppable straight away */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15, duration: 0.8 }} className="mt-3 w-full">
            <CategoryRail onDark />
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cream/65"
          >
            <li className="flex items-center gap-2">
              <Icon name="shield" size={14} className="text-gold" /> Authentic [CONFIRM]
            </li>
            <li className="flex items-center gap-2">
              <Icon name="truck" size={14} className="text-gold" /> Nationwide delivery
            </li>
            <li className="flex items-center gap-2">
              <Icon name="whatsapp" size={14} className="text-gold" /> Order on WhatsApp
            </li>
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}

function FloatingBottle({ src, className, delay, y }: { src: string; className: string; delay: number; y: MotionValue<number> }) {
  return (
    <motion.div className={className} style={{ y }} aria-hidden="true">
      <motion.div initial={{ opacity: 0, y: 70, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.3, ease: EASE, delay }}>
        <div className="animate-float" style={{ animationDelay: `${delay * 2}s` }}>
          <div className="gold-frame relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-cream shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
            <Image src={src} alt="" fill sizes="340px" className="object-contain p-[6%]" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
