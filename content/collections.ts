import { products, type Product } from './products';

export type Collection = {
  slug: string;
  name: string;
  accent: string;
  kicker: string;
  intro: string;
  tone: 'blush' | 'rose' | 'gold' | 'wine' | 'mauve' | 'plum';
  tint: string;
  filter: (p: Product) => boolean;
};

export const collections: Collection[] = [
  {
    slug: 'women',
    name: 'Scents for',
    accent: 'her',
    kicker: 'Women',
    intro: 'Florals with a twist, glowing gourmands and soft musks, chosen to feel personal, not predictable.',
    tone: 'blush',
    tint: '#F2D6DE',
    filter: (p) => p.gender === 'women' && !p.giftSet,
  },
  {
    slug: 'men',
    name: 'Scents for',
    accent: 'him',
    kicker: 'Men',
    intro: 'Smooth woods, dark vanillas and crisp freshness that work as well at the office as they do after dark.',
    tone: 'wine',
    tint: '#4B0F2F',
    filter: (p) => p.gender === 'men' && !p.giftSet,
  },
  {
    slug: 'unisex',
    name: 'Made for',
    accent: 'everyone',
    kicker: 'Unisex',
    intro: 'Fragrance has no rules. These are the scents that wear beautifully on anyone who loves them.',
    tone: 'plum',
    tint: '#8C3A62',
    filter: (p) => p.gender === 'unisex' && !p.giftSet,
  },
  {
    slug: 'gift-sets',
    name: 'Gifts that',
    accent: 'linger',
    kicker: 'Gift sets',
    intro: 'Discovery sets and boxed duos that take the guesswork out of gifting, ready to wrap and give.',
    tone: 'gold',
    tint: '#D4B06A',
    filter: (p) => !!p.giftSet,
  },
  {
    slug: 'new-in',
    name: 'Just',
    accent: 'arrived',
    kicker: 'New in',
    intro: 'The latest additions to the shelf. Be the first to try them.',
    tone: 'mauve',
    tint: '#EBDDE6',
    filter: (p) => !!p.isNew,
  },
];

export const collectionBySlug = (slug: string) => collections.find((c) => c.slug === slug);
export const productsIn = (c: Collection) => products.filter(c.filter);
