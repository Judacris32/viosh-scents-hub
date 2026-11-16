/**
 * Store-wide settings. Every value in [BRACKETS] is a placeholder the client
 * must confirm before launch (see README → "Before launch").
 */
export const store = {
  name: 'Viosh Scents Hub',
  shortName: 'Viosh',
  tagline: 'Luxury fragrance, delivered',
  description:
    'Viosh Scents Hub is an online luxury perfume store carrying Chanel, Dior, Valentino, Yves Saint Laurent, Hugo Boss and more, with gift sets, a fragrance finder and a friendly scent guide.',
  url: 'https://viosh-scents-hub.vercel.app', // [UPDATE] to the live domain
  email: 'hello@vioshscents.com', // [CONFIRM] client email
  whatsapp: '2340000000000', // [CONFIRM] international format, digits only, no +
  whatsappDisplay: '+234 000 000 0000', // [CONFIRM]
  currency: 'NGN',
  locale: 'en-NG',
  city: 'Lagos', // [CONFIRM] store base city
  timeZone: 'Africa/Lagos',
  hours: 'Mon – Sat, 9am – 7pm', // [CONFIRM]
  address: '[STORE ADDRESS OR "Online only"]',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/[HANDLE]', icon: 'instagram' },
    { label: 'TikTok', href: 'https://tiktok.com/@[HANDLE]', icon: 'tiktok' },
    { label: 'WhatsApp', href: 'https://wa.me/2340000000000', icon: 'whatsapp' },
  ] as const,
  /** Shown in the footer clocks. */
  clocks: [
    { city: 'Lagos', tz: 'Africa/Lagos' },
    { city: 'London', tz: 'Europe/London' },
    { city: 'New York', tz: 'America/New_York' },
  ],
  shipping: {
    // [CONFIRM] all delivery figures with the client. Set to null to hide.
    freeOver: null as number | null,
    standardFee: 3500,
    expressFee: 7000,
    standardEta: '2 – 4 working days',
    expressEta: 'Next working day (selected cities)',
  },
};

export type StoreConfig = typeof store;
