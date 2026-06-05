import { Link } from "react-router-dom";
import { ShoppingBag, Sparkles as SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { gradientFor } from "@/lib/gradients";
import type { ProductWithVariants } from "@/hooks/useProducts";

export function ProductCard({ product }: { product: ProductWithVariants }) {
  const { addItem } = useCart();
  const grad = gradientFor(product.slug);
  const hasVariants = (product.product_variants?.length ?? 0) > 0;

  function quickAdd() {
    // Products with variants or customization go to the detail page.
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      unitPrice: Number(product.base_price),
      quantity: 1,
      gradient: grad,
    });
    toast.success(`${product.name} added to cart ✨`);
  }

  return (
    <div className="group flex flex-col">
      <Link
        to={`/shop/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition group-hover:shadow-[var(--shadow-soft)]"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${grad}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <SparklesIcon className="h-10 w-10 text-white/80" />
        </div>
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium tracking-wide text-charcoal">
            Bestseller
          </span>
        )}
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link to={`/shop/${product.slug}`} className="story-link font-display text-lg leading-tight">
            {product.name}
          </Link>
          <p className="text-sm text-mid-gray">
            {hasVariants ? "From " : ""}${Number(product.base_price).toFixed(2)}
          </p>
        </div>
        {hasVariants || product.customizable ? (
          <Link
            to={`/shop/${product.slug}`}
            className="shrink-0 rounded-full bg-pink-pale p-2.5 text-charcoal transition hover:bg-pink-blush"
            aria-label={`View ${product.name}`}
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
        ) : (
          <button
            onClick={quickAdd}
            className="shrink-0 rounded-full bg-pink-pale p-2.5 text-charcoal transition hover:bg-pink-blush"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[3/4] animate-pulse rounded-2xl bg-pink-pale/60" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-pink-pale/60" />
      <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-pink-pale/40" />
    </div>
  );
}
