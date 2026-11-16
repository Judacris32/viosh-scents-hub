'use client';

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import { Children, createElement, Fragment, useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { EASE, cn } from '@/lib/format';

/* ---------- Reveal: fade + rise ---------- */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'li' | 'section' | 'p' | 'span';
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/* ---------- Text with *accent* markers ---------- */
export function parseAccent(text: string) {
  return text.split(/(\*[^*]+\*)/g).filter(Boolean).map((part) =>
    part.startsWith('*') ? { text: part.slice(1, -1), accent: true } : { text: part, accent: false },
  );
}

/** Words with accent flags, remembering whether each had a space before it (so "*start*?" keeps the ? attached). */
export function tokenize(text: string) {
  const tokens: { w: string; accent: boolean; space: boolean }[] = [];
  let pending = false;
  parseAccent(text).forEach((seg) => {
    seg.text.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        pending = true;
        return;
      }
      tokens.push({ w: part, accent: seg.accent, space: tokens.length > 0 && pending });
      pending = false;
    });
  });
  return tokens;
}

export function AccentText({ text }: { text: string }) {
  return (
    <>
      {parseAccent(text).map((p, i) =>
        p.accent ? (
          <span key={i} className="accent">
            {p.text}
          </span>
        ) : (
          <Fragment key={i}>{p.text}</Fragment>
        ),
      )}
    </>
  );
}

/* ---------- Split words: each word slides up behind a mask ---------- */
export function SplitWords({
  text,
  as = 'h2',
  className,
  delay = 0,
  immediate = false,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  const show = immediate || inView;
  const words = tokenize(text);

  return createElement(
    as as ElementType,
    { ref, className, 'aria-label': text.replace(/\*/g, '') },
    words.map(({ w, accent, space }, i) => (
      <Fragment key={i}>
        {space ? ' ' : null}
        <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom" style={{ marginBottom: '-0.12em' }}>
          <motion.span
            data-reveal
            className={cn('inline-block', accent && 'accent')}
            initial={{ y: '110%' }}
            animate={show ? { y: '0%' } : { y: '110%' }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}
          </motion.span>
        </span>
      </Fragment>
    )),
  );
}

/* ---------- Stagger groups ---------- */
const groupVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export function Stagger({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M className={className} variants={groupVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -8% 0px' }}>
      {children}
    </M>
  );
}

export function StaggerItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M data-reveal className={className} variants={itemVariants}>
      {children}
    </M>
  );
}

/* ---------- Count up ---------- */
export function CountUp({ to, suffix = '', className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setVal(to);
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  );
}

/* ---------- Magnetic wrapper ---------- */
export function Magnetic({ children, strength = 0.3, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Scroll-lit statement ---------- */
function LitWord({ word, progress, range, accent }: { word: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className={cn('inline-block', accent && 'accent')}>
      {word}
    </motion.span>
  );
}

export function ScrollLit({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = tokenize(text);
  return (
    <p ref={ref} className={className} aria-label={text.replace(/\*/g, '')}>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            {w.space ? ' ' : null}
            <LitWord word={w.w} accent={w.accent} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          </Fragment>
        ))}
      </span>
    </p>
  );
}

/* ---------- Parallax ---------- */
export function Parallax({ children, className, offset = 80 }: { children: ReactNode; className?: string; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/* ---------- Media reveal: clip wipe on an inner layer + settle from zoom ---------- */
export function MediaReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  return (
    <div ref={ref} className={className}>
      <motion.div
        data-reveal
        className="h-full w-full overflow-hidden"
        initial={{ clipPath: 'inset(100% 0% 0% 0% round 28px)' }}
        animate={inView ? { clipPath: 'inset(0% 0% 0% 0% round 28px)' } : undefined}
        transition={{ duration: 1.2, ease: EASE, delay }}
      >
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.18 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ duration: 1.6, ease: EASE, delay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------- Marquee ---------- */
export function Marquee({ items, reverse = false, className, separator }: { items: string[]; reverse?: boolean; className?: string; separator?: ReactNode }) {
  const row = [...items, ...items];
  return (
    <div className={cn('relative flex overflow-hidden', className)} aria-hidden="true">
      <div className={cn('flex shrink-0 items-center whitespace-nowrap', reverse ? 'animate-marquee-rev' : 'animate-marquee')}>
        {Children.toArray(
          row.map((t) => (
            <span className="flex items-center">
              <span className="px-6 md:px-10">{t}</span>
              {separator}
            </span>
          )),
        )}
      </div>
    </div>
  );
}
