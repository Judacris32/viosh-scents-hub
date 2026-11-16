export const mainNav = [
  { label: 'Shop', href: '/shop', mega: true },
  { label: 'For her', href: '/collections/women' },
  { label: 'For him', href: '/collections/men' },
  { label: 'Gift sets', href: '/collections/gift-sets' },
  { label: 'Scent Guide', href: '/scent-guide' },
];

/** Columns inside the Shop mega menu. */
export const shopMenu = [
  {
    title: 'Shop by',
    links: [
      { label: 'All fragrances', href: '/shop' },
      { label: 'For her', href: '/collections/women' },
      { label: 'For him', href: '/collections/men' },
      { label: 'Unisex', href: '/collections/unisex' },
      { label: 'Gift sets', href: '/collections/gift-sets' },
      { label: 'New in', href: '/collections/new-in' },
    ],
  },
  {
    title: 'Scent family',
    links: [
      { label: 'Floral', href: '/shop?family=floral' },
      { label: 'Woody', href: '/shop?family=woody' },
      { label: 'Amber & spice', href: '/shop?family=amber' },
      { label: 'Gourmand', href: '/shop?family=gourmand' },
      { label: 'Fresh & citrus', href: '/shop?family=fresh' },
      { label: 'Aquatic', href: '/shop?family=aquatic' },
    ],
  },
  {
    title: 'Budget',
    links: [
      { label: `Under ₦50,000`, href: '/shop?price=u50' },
      { label: `₦50,000 – ₦150,000`, href: '/shop?price=50-150' },
      { label: `Over ₦150,000`, href: '/shop?price=o150' },
      { label: 'On offer', href: '/shop?deal=1' },
      { label: 'Bestsellers', href: '/shop?sort=bestsellers' },
    ],
  },
];

/** Quick category pills shown on the home page and in the mobile menu. */
export const quickLinks = [
  { label: 'Bestsellers', href: '/shop?sort=bestsellers', icon: 'star' },
  { label: 'New in', href: '/collections/new-in', icon: 'sparkle' },
  { label: 'For her', href: '/collections/women', icon: 'heart' },
  { label: 'For him', href: '/collections/men', icon: 'user' },
  { label: 'Gift sets', href: '/collections/gift-sets', icon: 'gift' },
  { label: 'On offer', href: '/shop?deal=1', icon: 'tag' },
] as const;

export const footerNav = [
  {
    title: 'Shop',
    links: [
      { label: 'All fragrances', href: '/shop' },
      { label: 'For her', href: '/collections/women' },
      { label: 'For him', href: '/collections/men' },
      { label: 'Unisex', href: '/collections/unisex' },
      { label: 'Gift sets', href: '/collections/gift-sets' },
      { label: 'New in', href: '/collections/new-in' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Fragrance Finder', href: '/finder' },
      { label: 'Scent Guide', href: '/scent-guide' },
      { label: 'About us', href: '/about' },
      { label: 'Wishlist', href: '/wishlist' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping & returns', href: '/shipping-returns' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of sale', href: '/terms' },
    ],
  },
];
