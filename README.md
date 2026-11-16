# Viosh Scents Hub

A luxury multi-brand perfume store built by JayDev Studio, designed around the Eau Élégance palette (burgundy, plum, rose, gold and cream). It behaves like a shopping app: add to bag from any card, quick-view without leaving the grid, and a bottom tab bar on phones. The storefront is frontend-only. Orders reach the owner through WhatsApp or email, and the checkout is a demo that is ready to connect to Paystack or Stripe later.

## Stack

- Next.js 14 (App Router) and TypeScript, all pages statically generated
- Tailwind CSS with design tokens. Light and dark colours are CSS variables in `app/globals.css`, and the scales are in `tailwind.config.ts`
- Framer Motion for every animation, with `prefers-reduced-motion` respected
- next-themes for the light/dark toggle, which follows the visitor's system setting by default
- Zustand for the bag and wishlist, saved in the visitor's browser
- Fuse.js for search
- Self-hosted fonts from Fontsource: **Cormorant Garamond Variable** for display text, with its italic used for accent words, and **Manrope Variable** for body text

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero, notes marquee, shop by family, product tabs, mood picker, statement, collections, strength explainer, how ordering works, Scent Guide teaser |
| `/shop` | All products, with filters for family, who it's for, strength, price and travel size. Includes search and sort, and every filter is kept in the URL so it can be shared |
| `/shop/[slug]` | Product page: gallery, size picker, add to bag, WhatsApp quick order, notes pyramid, wear profile, accordion, related products and Product JSON-LD |
| `/collections`, `/collections/[slug]` | Women, men, unisex, gift sets and new in |
| `/finder` | Fragrance Finder: a five-question quiz that returns a shortlist with match scores |
| `/scent-guide` | Notes pyramid, interactive family wheel, concentrations, how to apply, layering, storage and a searchable glossary |
| `/about`, `/contact`, `/faq` | About is a story with placeholders, contact is email-first, and the FAQ includes FAQ schema |
| `/shipping-returns`, `/privacy`, `/terms` | Policy templates |
| `/cart`, `/checkout`, `/checkout/success` | The bag page, the demo checkout with validation, and an order summary that sends the order to WhatsApp or email |
| `/wishlist` | Saved scents |
| 404 | Custom not-found page |

## Shopping experience

Everything is built so a customer can get from landing to bag in one or two taps.

- **Add from anywhere.** Every product card has size pills and an Add button, so no one has to open a product page to buy. Switching size updates the price and the Offer badge live.
- **Quick view.** The eye icon on a card opens a modal with the photo, sizes, quantity, Add to bag, Add & checkout, and a link to full details.
- **Mega menu.** Hovering Shop opens a panel with shop-by, scent family, budget bands and three trending products.
- **Bottom tab bar on phones.** Home, Shop, Search, Saved, Bag — fixed at the bottom like a native app, with live badges.
- **Sticky buy bar.** On a product page on a phone, once the main Add button scrolls away a bar slides up with the price and an Add button.
- **Slide-in mobile menu** that leads with six quick-shop pills before any other links.
- **Filters live in the URL**, so `/shop?brand=Chanel&family=floral` can be shared or linked to from anywhere. The mega menu and home page use this.
- **Search** opens with Ctrl/Cmd + K or the tab bar, and matches on name, brand, notes and family.

## Structure

```
app/              routes, metadata, sitemap, robots, manifest, icons, OG image
components/
  layout/         Header (island navbar), MobileMenu, Footer, CtaBanner, SearchDialog, Toast, ThemeToggle
  ui/             Container, Section, SectionHeading, Button, Kicker, PageHero, Icon, Logo, CopyButton, LegalPage
  motion/         Reveal, SplitWords, Stagger, CountUp, Magnetic, ScrollLit, MediaReveal, Marquee
  product/        BottleArt (illustrated bottles), ProductMedia, ProductCard, ProductDetail, NotesPyramid
  home/ shop/ cart/ checkout/ finder/ guide/
content/          ALL copy and data: store settings, products, families, collections, guide, FAQ, pages
lib/              bag store, formatting, SEO helpers, modal hook
```

## Palette (Eau Élégance)

| Token | Hex | Used for |
| --- | --- | --- |
| Wine | `#4B0F2F` | Primary buttons, dark sections, the bag button |
| Wine night | `#1F0512` | Footer, statement sections, dark-mode base |
| Plum | `#8C3A62` | Accent words on light grounds, unisex collection |
| Rose | `#D9A1B3` | Soft sections, wear-profile section |
| Gold | `#D4B06A` | Accents, marker highlights, gold CTAs, the progress line |
| Cream | `#F7EDE3` | Light background |
| Blush / Mauve / Champagne | `#F2D6DE` / `#EBDDE6` / `#F1E3CF` | Alternating section tones and tiles |

Sections alternate between cream, blush, gold, wine night, mauve, rose and wine. Dark mode turns the light tones into deep wine shades and keeps gold as the accent.

## Logo and favicon

- The mark is the generated gold emblem (a faceted crystal stopper inside a gold ring), stored as `public/logo-mark.png` with a transparent background and shown on a wine disc by `components/ui/Logo.tsx`.
- `app/favicon.ico` (16/32/48px), `app/icon.png`, `app/apple-icon.png` (180px) and `public/icon-512.png` / `icon-1024.png` for the web app manifest are all cut from the same emblem.
- `app/opengraph-image.png` is the 1200×630 image used when the site is shared.

## Product imagery

37 product photos live in `public/products`, each padded to a 4:5 frame on white. The photos come from the pages the client supplied. Because the backgrounds are white, `components/product/ProductMedia.tsx` places each one on a tinted tile with `mix-blend-mode: multiply` so the white disappears into the tile; the tile colour is the `tint` field on each product and was sampled from the bottle itself.

To swap in better photography later, drop a file with the same name into `public/products` — nothing else changes.

**Image quality note:** the designer-brand shots (Chanel, Dior, Gucci, YSL and so on) came in at 420px and were upscaled to 900px, so they are slightly soft on large retina screens. The niche and Middle Eastern shots are 930px and look sharper. Ask the client for 1200px+ originals when they have them.

## Ordering today

- **Order on WhatsApp** in the bag, on product pages and on the success page builds a message with every item, size, quantity and total.
- **Checkout** validates the customer's details, saves a reference such as `VSH-4K2P9A`, clears the bag, and shows a one-tap "Send order on WhatsApp" or email button. No payment is taken.
- **Adding payments later**: wire Paystack or Stripe into `components/checkout/CheckoutClient.tsx`. The "Card payment" option is already in place and marked "Soon".

## Before launch

Search the project for `[CONFIRM]` and `[` to find every placeholder.

- [ ] **Products (biggest job)**: `content/products.ts` holds 37 fragrances. The photos are real, but **every price, size and stock flag is invented** and must be replaced with the client's real figures. Names and notes follow each house's published information where the bottle was identifiable.
- [ ] **Confirm the `[CONFIRM]` products**: seven bottles carried no readable brand, so they are listed under "Viosh Select" or a best guess — *Amour*, *Noir Rouge*, *Ignite Oud*, *Oud & Roses*, *Pink Cloud*, *Fireside in Flames*, *Petra*, plus *Hypnotic Oud* (brand) and *La Favorite* (name). Search the file for `[CONFIRM]`.
- [ ] **Gift sets**: confirm the contents and sizes of the three gift sets.
- [ ] If any product is an "inspired-by" blend rather than the original, the copy must say so plainly.
- [ ] **Authenticity**: the hero shows "Authentic [CONFIRM]" and the promises strip has a placeholder. Replace with the store's real sourcing statement.
- [ ] **Store settings** in `content/store.ts`: email, WhatsApp number (digits only, international format), social handles, city, hours, address, live domain, and delivery fees and times. `freeOver` turns on the free-delivery progress bar.
- [ ] **Currency**: prices are in NGN. If the client wants USD or GBP shown too, they need to supply the rates.
- [ ] **About page**: the founder's story, name, start year and what makes Viosh different (`content/pages.ts`).
- [ ] **Promises strip** on the home page: authenticity and gift-packing claims (`content/home.ts`).
- [ ] **FAQ answers** marked `[CONFIRM]` (`content/faq.ts`).
- [ ] **Policies**: fill in the shipping and returns, privacy, and terms templates, set the "Last updated" date, and have them reviewed for the business.
- [ ] **Product ingredients**: the accordion on product pages has a placeholder.
- [ ] **Analytics**: none is installed, so no cookie banner is needed. If analytics or ads are added, add a consent banner first.
- [ ] **Domain**: update `store.url` and connect the domain in Vercel.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

Deploy by pushing to GitHub and importing the repo in Vercel. No environment variables are needed.

## Verified

- `npm run lint` and `npm run build` pass, and all 67 routes are generated statically.
- Every route was checked at 1440px and 390px in light and dark mode with no horizontal scroll and no console errors.
- Add-from-card, quick view, the mega menu, the bottom tab bar, the sticky buy bar, the offers filter and the bestseller sort were all driven in a real browser.
- The add to bag → drawer → checkout validation → success → WhatsApp link flow, the quiz, search (Ctrl/Cmd + K), filters and the theme toggle were all tested in a browser.
