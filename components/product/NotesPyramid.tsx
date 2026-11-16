import type { Product } from '@/content/products';
import { Stagger, StaggerItem } from '@/components/motion';

const tiers = [
  { key: 'top', label: 'Top notes', hint: 'The first impression', width: '58%', bg: 'bg-gold', ink: 'text-wine-night' },
  { key: 'heart', label: 'Heart notes', hint: 'The character', width: '80%', bg: 'bg-blush', ink: 'text-wine-night' },
  { key: 'base', label: 'Base notes', hint: 'What lingers', width: '100%', bg: 'bg-rose', ink: 'text-wine-night' },
] as const;

export function NotesPyramid({ product }: { product: Product }) {
  const isSet = product.concentration === 'Set';
  return (
    <Stagger className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
      {tiers.map((t) => (
        <StaggerItem key={t.key} className="w-full">
          <div
            className={`mx-auto flex flex-col items-center gap-3 rounded-[1.75rem] px-5 py-6 text-center md:px-8 ${t.bg} ${t.ink}`}
            style={{ width: t.width, minWidth: 'min(100%, 290px)' }}
          >
            <div>
              <p className="font-display text-2xl font-medium">{isSet ? t.label.replace('notes', 'picks') : t.label}</p>
              <p className="text-sm font-medium opacity-75">{t.hint}</p>
            </div>
            <ul className="flex flex-wrap justify-center gap-2">
              {product.notes[t.key].map((n) => (
                <li key={n} className="rounded-full bg-cream/70 px-3.5 py-1.5 text-sm font-semibold">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
