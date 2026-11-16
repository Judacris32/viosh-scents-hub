import Image from 'next/image';
import type { Product } from '@/content/products';
import { cn } from '@/lib/format';

/**
 * Product photography. Every photo has a white background, so `mix-blend-mode: multiply`
 * lets the tinted tile behind it show through instead of showing a white box.
 */
export function ProductMedia({
  product,
  view = 'front',
  className,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw',
  priority = false,
  tile,
}: {
  product: Product;
  view?: 'front' | 'close';
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Override the tinted tile behind the photo */
  tile?: string;
}) {
  const alt = `${product.name} by ${product.brand}`;
  return (
    <div className={cn('relative isolate h-full w-full overflow-hidden', className)} style={{ background: tile ?? product.tint }}>
      <Image
        src={product.image}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('photo-multiply', view === 'close' ? 'scale-[1.7] object-contain object-[50%_38%]' : 'object-contain p-[7%]')}
      />
    </div>
  );
}
