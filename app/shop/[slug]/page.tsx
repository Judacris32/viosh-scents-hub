import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { products, productBySlug, concentrationLabel, genderLabel } from '@/content/products';
import { familyById } from '@/content/families';
import { store } from '@/content/store';
import { JsonLd, pageMeta } from '@/lib/seo';
import { Container, Section, SectionHeading, Breadcrumb, Kicker, Icon } from '@/components/ui';
import { Reveal, SplitWords, Stagger, StaggerItem } from '@/components/motion';
import { ProductGallery, PurchasePanel, Meter, Accordion } from '@/components/product/ProductDetail';
import { NotesPyramid } from '@/components/product/NotesPyramid';
import { ProductCard } from '@/components/product/ProductCard';

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = productBySlug(params.slug);
  if (!p) return {};
  return pageMeta({
    title: `${p.name} ${p.concentration === 'Set' ? 'Gift Set' : concentrationLabel[p.concentration]}`,
    description: `${p.tagline}. ${p.description}`.slice(0, 158),
    path: `/shop/${p.slug}`,
  });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = productBySlug(params.slug);
  if (!product) notFound();
  const fam = familyById[product.family];
  const isSet = product.concentration === 'Set';

  const related = products
    .filter((p) => p.slug !== product.slug)
    .map((p) => ({ p, score: (p.family === product.family ? 3 : 0) + (p.gender === product.gender ? 1 : 0) + (p.giftSet === product.giftSet ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => r.p);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Brand', name: product.brand },
    category: 'Perfume',
    image: `${store.url}/opengraph-image.png`,
    sku: product.slug,
    offers: product.sizes.map((s) => ({
      '@type': 'Offer',
      name: `${s.ml}ml`,
      price: s.price,
      priceCurrency: store.currency,
      availability: s.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${store.url}/shop/${product.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLd({ data: ld })} />

      <Section tone="base" className="pt-28 md:pt-36" size="sm">
        <Container>
          <div className="mb-8 flex justify-center lg:justify-start [&_ol]:lg:justify-start">
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: product.name }]} />
          </div>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <ProductGallery product={product} />
            </Reveal>
            <div className="flex flex-col gap-6">
              <Reveal y={12} className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em]" style={{ background: fam.tint, color: fam.ink }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: fam.colour }} />
                  {fam.name}
                </span>
                <span className="rounded-full bg-ink/[0.07] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">{concentrationLabel[product.concentration]}</span>
                <span className="rounded-full bg-ink/[0.07] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">{genderLabel[product.gender]}</span>
              </Reveal>
              <div>
                <p className="text-muted mb-2 text-sm font-semibold uppercase tracking-[0.2em]">{product.brand}</p>
                <SplitWords as="h1" immediate text={product.name} className="text-display-lg font-medium" />
              </div>
              <Reveal delay={0.1}>
                <p className="font-display text-2xl italic leading-snug">
                  {product.tagline}
                </p>
                <p className="text-muted mt-4 text-lg leading-relaxed">{product.description}</p>
                {product.contents ? (
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {product.contents.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm font-medium">
                        <Icon name="check" size={16} className="text-wine dark:text-rose" /> {c}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
              <Reveal delay={0.18}>
                <PurchasePanel product={product} />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="wine">
        <div className="grain absolute inset-0" aria-hidden="true" />
        <Container className="relative">
          <SectionHeading
            kicker={isSet ? 'Inside the box' : 'What it smells like'}
            title={isSet ? 'A little bit of *everything*' : 'From first spray to *dry down*'}
            intro={
              isSet
                ? 'The scents in this set span our fragrance families, from bright and fresh to warm and rich.'
                : 'A perfume unfolds in layers. Here’s how this one moves on your skin over the hours.'
            }
          />
          <div className="mt-14">
            <NotesPyramid product={product} />
          </div>
        </Container>
      </Section>

      <Section tone="rose">
        <Container>
          <SectionHeading kicker="How it wears" title="Your *wear* profile" intro="A quick guide to strength, staying power and the moments this scent was made for." />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <Reveal className="rounded-[1.75rem] bg-bg p-7 shadow-soft">
              <div className="grid gap-8">
                <Meter label="Longevity" value={product.longevity} low="A few hours" high="All day and night" />
                <Meter label="Projection" value={product.projection} low="Close to skin" high="Fills the room" />
              </div>
            </Reveal>
            <Reveal delay={0.08} className="rounded-[1.75rem] bg-bg p-7 shadow-soft">
              <Kicker className="text-muted">Best seasons</Kicker>
              <ul className="mt-5 grid grid-cols-2 gap-2.5">
                {(['Spring', 'Summer', 'Autumn', 'Winter'] as const).map((s) => {
                  const on = product.seasons.includes(s);
                  return (
                    <li
                      key={s}
                      className={`rounded-2xl px-4 py-3 text-center font-semibold ${on ? 'bg-gold text-wine-night' : 'bg-ink/[0.05] text-ink-soft line-through decoration-1'}`}
                    >
                      {s}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
            <Reveal delay={0.16} className="rounded-[1.75rem] bg-bg p-7 shadow-soft">
              <Kicker className="text-muted">Perfect for</Kicker>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {product.occasions.map((o) => (
                  <li key={o} className="rounded-full bg-blush px-4 py-2 font-semibold text-wine-night">
                    {o}
                  </li>
                ))}
              </ul>
              <p className="text-muted mt-6 text-sm leading-relaxed">{fam.wearWhen}.</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="base" size="sm">
        <Container className="max-w-3xl">
          <Reveal>
            <h2 className="mb-6 text-center font-display text-display-md font-medium">Good to know</h2>
          </Reveal>
          <Accordion
            items={[
              {
                title: 'How to wear it',
                body: 'Spray two or three times on pulse points (wrists, neck, behind the ears) from about 15cm away. Let it dry naturally, without rubbing, so the top notes can open properly.',
              },
              {
                title: 'Ingredients',
                body: 'Full ingredient list is printed on the packaging. [CLIENT TO ADD INGREDIENT LIST] If you have sensitive skin, patch-test before use.',
              },
              {
                title: 'Delivery',
                body: `Standard delivery takes ${store.shipping.standardEta}. Express: ${store.shipping.expressEta}. See our Shipping & Returns page for full details. [CONFIRM]`,
              },
              {
                title: 'Returns',
                body: 'For hygiene reasons, opened fragrances can’t be returned. Unopened, sealed items can be returned within the period set out in our Shipping & Returns policy.',
              },
            ]}
          />
        </Container>
      </Section>

      <Section tone="blush">
        <Container>
          <SectionHeading kicker="Keep exploring" title="You might *also* love" />
          <Stagger className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>
    </>
  );
}
