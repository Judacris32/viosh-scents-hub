import { store } from './store';

/** Answers marked [CONFIRM] must be checked against the client's real policies. */
export const faqGroups = [
  {
    title: 'Ordering',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Add your fragrances to the bag, then either send the order to us on WhatsApp or go through checkout. On WhatsApp we will confirm stock, delivery and payment details with you directly.',
      },
      {
        q: 'Can I pay online?',
        a: 'Online card payment is coming soon. For now, the fastest way to order is through WhatsApp, where we will share payment options with you. [CONFIRM]',
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'Yes, as long as it has not been dispatched. Message us as soon as possible with your order details. [CONFIRM]',
      },
    ],
  },
  {
    title: 'Products',
    items: [
      {
        q: 'Are your fragrances authentic?',
        a: '[CONFIRM WITH CLIENT] Describe exactly where stock comes from (official distributors, own house blends, etc.) and what guarantee the store offers.',
      },
      {
        q: 'What’s the difference between EDT, EDP and Parfum?',
        a: 'It comes down to how much perfume oil is in the bottle. EDT is lighter, EDP is richer and lasts longer, and Parfum or Extrait is the most concentrated. Our Scent Guide explains it in more detail.',
      },
      {
        q: 'Do you sell samples?',
        a: 'The Icons Discovery Set lets you try five of our bestsellers in travel sizes before committing to a full bottle. [CONFIRM]',
      },
      {
        q: 'How do I find a scent I’ll love?',
        a: 'Take our Fragrance Finder. It asks five quick questions about what you enjoy and suggests a shortlist that matches.',
      },
    ],
  },
  {
    title: 'Delivery & returns',
    items: [
      {
        q: 'How long does delivery take?',
        a: `Standard delivery usually takes ${store.shipping.standardEta}. Express delivery is ${store.shipping.expressEta.toLowerCase()}. [CONFIRM]`,
      },
      {
        q: 'Do you ship internationally?',
        a: '[CONFIRM WITH CLIENT] List the countries the store ships to, or say delivery is currently local only.',
      },
      {
        q: 'Can I return a perfume?',
        a: 'For hygiene reasons, opened fragrances usually cannot be returned. Unopened items in their original packaging can be returned within the window in our Shipping & Returns policy. [CONFIRM]',
      },
    ],
  },
];
