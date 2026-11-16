/** Copy for About and policy pages. [BRACKETS] are placeholders for the client. */

export const about = {
  intro:
    'Viosh Scents Hub is a home for people who love fragrance, and for people just discovering it. We bring together beautiful scents across every family and make choosing one feel easy, personal and fun.',
  story: [
    '[FOUNDER STORY] Tell the story of how Viosh started: who founded it, when, and why. One or two short paragraphs in the founder’s own voice work best.',
    '[WHAT MAKES VIOSH DIFFERENT] Describe how the store chooses its fragrances, where stock comes from, and what customers can expect every time they order.',
  ],
  founder: { name: '[FOUNDER NAME]', role: 'Founder, Viosh Scents Hub', since: '[YEAR]' },
  values: [
    { title: 'Scent made simple', text: 'Clear notes, honest descriptions and a guide that explains things without the jargon.', tone: 'gold' },
    { title: 'Something for everyone', text: 'Fresh, floral, woody or sweet, for her, for him or for anyone. Fragrance has no rules.', tone: 'blush' },
    { title: 'Care in every order', text: 'Packed securely, delivered carefully and followed up by real people who love perfume.', tone: 'rose' },
  ],
};

export type LegalSection = { heading: string; body: string[] };

export const shippingReturns: LegalSection[] = [
  {
    heading: 'Where we deliver',
    body: ['[CONFIRM] List the cities, states or countries the store delivers to.'],
  },
  {
    heading: 'Delivery times and fees',
    body: [
      'Standard delivery: [TIMEFRAME], [FEE].',
      'Express delivery: [TIMEFRAME], [FEE]. Available in [CITIES].',
      'Orders confirmed before [CUT-OFF TIME] on a working day are usually dispatched the same day.',
    ],
  },
  {
    heading: 'Returns',
    body: [
      'For hygiene and safety reasons, we cannot accept returns on fragrances that have been opened, sprayed or had their seal removed.',
      'Unopened items in their original, sealed packaging can be returned within [NUMBER] days of delivery. Contact us first and we will explain how to send it back.',
    ],
  },
  {
    heading: 'Damaged or incorrect items',
    body: [
      'If your order arrives damaged or you received the wrong item, message us within [NUMBER] hours of delivery with a photo of the item and packaging. We will make it right with a replacement or refund.',
    ],
  },
  {
    heading: 'Refunds',
    body: ['Approved refunds are made to the original payment method within [NUMBER] working days. [CONFIRM]'],
  },
];

export const privacy: LegalSection[] = [
  {
    heading: 'Who we are',
    body: ['This website is run by [REGISTERED BUSINESS NAME], trading as Viosh Scents Hub, [ADDRESS]. Contact: [EMAIL].'],
  },
  {
    heading: 'What we collect',
    body: [
      'When you order, we collect the details needed to deliver it: your name, phone number, email and delivery address.',
      'Your bag, wishlist and light or dark mode choice are saved only in your own browser so they are still there when you return. We do not use them to track you.',
      'We do not currently use advertising or analytics cookies. If that changes, we will ask for your consent first.',
    ],
  },
  {
    heading: 'How we use it',
    body: ['We use your details only to process and deliver your order, answer your questions and, if you agree, send occasional news. We never sell your data.'],
  },
  {
    heading: 'Your rights',
    body: [
      'You can ask to see, correct or delete the personal data we hold about you at any time by emailing [EMAIL]. Depending on where you live, laws such as the Nigeria Data Protection Act or the GDPR may give you further rights.',
    ],
  },
  {
    heading: 'Changes',
    body: ['We may update this policy from time to time. The date at the top shows when it last changed.'],
  },
];

export const terms: LegalSection[] = [
  {
    heading: 'About these terms',
    body: ['These terms apply to purchases from Viosh Scents Hub, run by [REGISTERED BUSINESS NAME]. By placing an order you agree to them.'],
  },
  {
    heading: 'Orders and pricing',
    body: [
      'All prices are shown in [CURRENCY] and include [TAX DETAILS]. We do our best to keep prices and stock accurate; if there is an error we will contact you before your order is processed.',
      'An order is confirmed only once we have accepted it and received payment.',
    ],
  },
  {
    heading: 'Product information',
    body: ['Fragrances can smell slightly different on different skin. Product colours and packaging may vary from the images shown.'],
  },
  {
    heading: 'Allergies and safe use',
    body: ['Perfumes contain fragrance ingredients that some people are sensitive to. Check the ingredients on the packaging, patch-test if you have sensitive skin, and stop using a product if irritation occurs. Keep out of reach of children.'],
  },
  {
    heading: 'Governing law',
    body: ['These terms are governed by the laws of [JURISDICTION].'],
  },
];
