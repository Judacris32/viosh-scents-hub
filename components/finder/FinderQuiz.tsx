'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { products, type Product } from '@/content/products';
import { familyById, type FamilyId } from '@/content/families';
import { useShop, useUI } from '@/lib/store';
import { cn, EASE, formatPrice } from '@/lib/format';
import { fromPrice } from '@/content/products';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProductMedia } from '@/components/product/ProductMedia';

type Answer = { label: string; hint?: string; icon?: IconName; score: (p: Product) => number };
type Question = { id: string; title: string; sub: string; answers: Answer[] };

const fam = (ids: FamilyId[], pts = 3) => (p: Product) => (ids.includes(p.family) ? pts : 0);

const questions: Question[] = [
  {
    id: 'who',
    title: 'Who is this scent for?',
    sub: 'Fragrance has no rules, but this helps us start in the right place.',
    answers: [
      { label: 'For her', icon: 'heart', score: (p) => (p.gender === 'women' ? 3 : p.gender === 'unisex' ? 2 : 0) },
      { label: 'For him', icon: 'leaf', score: (p) => (p.gender === 'men' ? 3 : p.gender === 'unisex' ? 2 : 0) },
      { label: 'For anyone', icon: 'sparkle', score: (p) => (p.gender === 'unisex' ? 3 : 1) },
    ],
  },
  {
    id: 'mood',
    title: 'Which mood pulls you in?',
    sub: 'Go with your gut. There are no wrong answers.',
    answers: [
      { label: 'Fresh & clean', hint: 'Citrus, sea air, green tea', icon: 'drop', score: fam(['fresh', 'aquatic', 'green'], 4) },
      { label: 'Soft & romantic', hint: 'Rose, peony, white flowers', icon: 'heart', score: fam(['floral'], 4) },
      { label: 'Warm & cosy', hint: 'Vanilla, honey, amber', icon: 'sun', score: fam(['gourmand', 'amber'], 4) },
      { label: 'Dark & bold', hint: 'Oud, leather, smoky woods', icon: 'moon', score: fam(['woody', 'amber'], 4) },
    ],
  },
  {
    id: 'when',
    title: 'When will you wear it most?',
    sub: 'Your everyday scent and your night-out scent can be very different.',
    answers: [
      { label: 'Daytime & work', icon: 'sun', score: (p) => (p.occasions.includes('Office') ? 2 : 0) + (p.projection <= 3 ? 1 : 0) },
      { label: 'Evenings out', icon: 'moon', score: (p) => (p.occasions.includes('Evening') || p.occasions.includes('Date night') ? 3 : 0) },
      { label: 'Special occasions', icon: 'sparkle', score: (p) => (p.occasions.includes('Special occasion') ? 3 : 0) },
      { label: 'Every single day', icon: 'clock', score: (p) => (p.occasions.includes('Everyday') ? 3 : 0) },
    ],
  },
  {
    id: 'note',
    title: 'Pick a note you already love',
    sub: 'Think of a candle, a dessert or a place that makes you happy.',
    answers: [
      { label: 'Citrus', hint: 'Bergamot, lemon, orange', score: (p) => noteHit(p, ['bergamot', 'lemon', 'mandarin', 'grapefruit', 'rose', 'orange', 'neroli']) },
      { label: 'Flowers', hint: 'Rose, jasmine, tuberose', score: (p) => noteHit(p, ['rose', 'jasmine', 'peony', 'tuberose', 'magnolia', 'freesia', 'orange blossom']) },
      { label: 'Sweet treats', hint: 'Vanilla, caramel, tonka', score: (p) => noteHit(p, ['vanilla', 'praline', 'caramel', 'tonka', 'honey', 'benzoin']) },
      { label: 'Woods & spice', hint: 'Oud, cedar, saffron', score: (p) => noteHit(p, ['oud', 'cedar', 'sandalwood', 'vetiver', 'saffron', 'leather', 'amber']) },
      { label: 'Sea & air', hint: 'Salt, sage, driftwood', score: (p) => noteHit(p, ['sea salt', 'marine', 'driftwood', 'sage', 'ambroxan']) },
      { label: 'Green things', hint: 'Fig, tea, basil', score: (p) => noteHit(p, ['fig', 'matcha', 'tea', 'basil', 'galbanum', 'violet leaf']) },
    ],
  },
  {
    id: 'strength',
    title: 'How strong do you like it?',
    sub: 'Some people want a secret, others want a signature.',
    answers: [
      { label: 'Close to skin', hint: 'Only people near you notice', score: (p) => (p.projection <= 2 ? 3 : p.projection === 3 ? 1 : 0) },
      { label: 'Noticeable', hint: 'A soft, pleasant trail', score: (p) => (p.projection === 3 || p.projection === 4 ? 3 : 1) },
      { label: 'Fills the room', hint: 'Bold and memorable', score: (p) => (p.projection >= 4 ? 3 : 0) + (p.longevity === 5 ? 1 : 0) },
    ],
  },
];

function noteHit(p: Product, words: string[]) {
  const notes = [...p.notes.top, ...p.notes.heart, ...p.notes.base].map((n) => n.toLowerCase());
  const hits = notes.filter((n) => words.some((w) => n.includes(w))).length;
  return Math.min(4, hits * 2);
}

const bestFor = (a: Answer) => Math.max(...products.filter((p) => !p.giftSet).map((p) => a.score(p)));

export function FinderQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = step >= questions.length;
  const add = useShop((s) => s.add);
  const showToast = useUI((s) => s.showToast);

  const choose = (i: number) => {
    const next = [...answers.slice(0, step), i];
    setAnswers(next);
    window.setTimeout(() => setStep((s) => s + 1), 220);
  };

  const results = done
    ? products
        .filter((p) => !p.giftSet)
        .map((p) => {
          const score = questions.reduce((n, q, qi) => n + q.answers[answers[qi]].score(p), 0);
          // Best score any product could get for the answers chosen
          const best = questions.reduce((n, q, qi) => n + bestFor(q.answers[answers[qi]]), 0) || 1;
          return { p, score, match: Math.round((score / best) * 100) };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    : [];

  const progress = (Math.min(step, questions.length) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-wine-night/15" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={Math.min(step, questions.length)} aria-label="Quiz progress">
          <motion.div className="h-full rounded-full bg-wine-night" animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: EASE }} />
        </div>
        <span className="text-sm font-bold tabular-nums">
          {Math.min(step + 1, questions.length)} of {questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={questions[step].id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5, ease: EASE }}>
            <fieldset>
              <legend className="w-full text-center">
                <span className="block font-display text-display-lg font-medium">{questions[step].title}</span>
                <span className="text-muted mt-3 block text-lg">{questions[step].sub}</span>
              </legend>
              <div className={cn('mt-10 grid gap-3', questions[step].answers.length > 4 ? 'sm:grid-cols-2 lg:grid-cols-3' : questions[step].answers.length === 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
                {questions[step].answers.map((a, i) => {
                  const selected = answers[step] === i;
                  return (
                    <motion.button
                      key={a.label}
                      type="button"
                      onClick={() => choose(i)}
                      aria-pressed={selected}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        'group flex items-center gap-4 rounded-[1.4rem] border-2 p-5 text-left transition-all duration-500',
                        selected ? 'border-wine-night bg-wine-night text-cream' : 'border-wine-night/20 bg-cream/60 hover:-translate-y-1 hover:border-wine-night hover:bg-cream',
                      )}
                    >
                      {a.icon ? (
                        <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors duration-500', selected ? 'bg-gold text-wine-night' : 'bg-wine-night text-gold')}>
                          <Icon name={a.icon} size={22} />
                        </span>
                      ) : null}
                      <span>
                        <span className="block font-display text-xl font-medium">{a.label}</span>
                        {a.hint ? <span className="block text-sm opacity-75">{a.hint}</span> : null}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </fieldset>
            {step > 0 ? (
              <div className="mt-8 flex justify-center">
                <button type="button" onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 hover:bg-wine-night/10">
                  <Icon name="arrow-left" size={16} /> Back
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em]">Your shortlist</p>
              <h2 className="mt-3 font-display text-display-lg font-medium">
                We think you’ll <span className="accent">love</span> these
              </h2>
              <p className="text-muted mt-3 text-lg">Based on your answers. Each one is available in more than one size.</p>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {results.map(({ p, match }, i) => {
                const travel = undefined as (typeof p.sizes)[number] | undefined;
                return (
                  <motion.li
                    key={p.slug}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.12 }}
                    className="flex flex-col overflow-hidden rounded-[1.75rem] bg-cream text-wine-night shadow-lift"
                  >
                    <Link href={`/shop/${p.slug}`} className="relative block aspect-[4/5]">
                      <ProductMedia product={p} />
                      <span className="absolute left-3 top-3 rounded-full bg-wine-night px-3 py-1.5 text-xs font-bold text-gold">{match}% match</span>
                      {i === 0 ? <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1.5 text-xs font-bold">Top pick</span> : null}
                    </Link>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-70">{p.brand} · {familyById[p.family].short}</p>
                      <Link href={`/shop/${p.slug}`} className="font-display text-2xl font-medium hover:underline">
                        {p.name}
                      </Link>
                      <p className="text-sm opacity-80">{p.tagline}</p>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                        <span className="font-bold tabular-nums">From {formatPrice(fromPrice(p))}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const s = travel ?? p.sizes.find((x) => x.inStock) ?? p.sizes[0];
                            add(p.slug, s.ml);
                            showToast(`${p.name} ${s.ml}ml added to your bag`);
                          }}
                          className="rounded-full bg-wine-night px-4 py-2.5 text-sm font-semibold text-cream transition-colors duration-500 hover:bg-berry hover:text-wine-night"
                        >
                          Add {travel ? '10ml' : ''}
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setAnswers([]);
                }}
                className="flex h-12 items-center gap-2 rounded-full border-2 border-wine-night px-6 font-semibold transition-colors duration-500 hover:bg-wine-night hover:text-cream"
              >
                <Icon name="refresh" size={17} /> Start again
              </button>
              <Link href="/shop" className="flex h-12 items-center gap-2 rounded-full bg-wine-night px-6 font-semibold text-cream transition-colors duration-500 hover:bg-cream hover:text-wine-night">
                Browse everything <Icon name="arrow" size={17} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
