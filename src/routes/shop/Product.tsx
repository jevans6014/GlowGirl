import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShieldCheck, Droplet, Sparkles as SparklesIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { gradientFor } from "@/lib/gradients";
import { ROUTES } from "@/lib/site";

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug ?? "");
  const { addItem } = useCart();

  const [variantId, setVariantId] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-pink-deep" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-display text-4xl">Product not found</h1>
          <p className="mt-3 text-mid-gray">It may be out of stock or the database isn't seeded yet.</p>
          <Link to="/shop" className="btn-primary mt-6 inline-block">Back to Shop</Link>
        </div>
      </section>
    );
  }

  const variants = product.product_variants ?? [];
  const selectedVariant = variants.find((v) => v.id === variantId) ?? null;
  const priceModifier = selectedVariant ? Number(selectedVariant.price_modifier) : 0;
  const unitPrice = Number(product.base_price) + priceModifier;
  const grad = gradientFor(product.slug);
  const needsVariant = variants.length > 0;
  const needsCustom = product.customizable;

  function addToCart() {
    if (needsVariant && !selectedVariant) {
      toast.error("Please choose an option first");
      return;
    }
    if (needsCustom && !customText.trim()) {
      toast.error("Please enter your personalization");
      return;
    }
    addItem({
      productId: product!.id,
      name: product!.name,
      slug: product!.slug,
      unitPrice,
      priceModifier,
      quantity: qty,
      variantLabel: selectedVariant?.label,
      customizationText: needsCustom ? customText.trim() : undefined,
      gradient: grad,
    });
    toast.success(`${product!.name} added to cart ✨`);
  }

  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="mb-8 text-sm text-mid-gray">
          <Link to="/shop" className="story-link">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className={`relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br ${grad}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <SparklesIcon className="h-16 w-16 text-white/80" />
            </div>
            <span className="absolute bottom-4 left-4 font-display text-2xl text-white/90">
              {product.name}
            </span>
          </div>

          <div>
            <h1 className="font-display text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-2xl text-charcoal">${unitPrice.toFixed(2)}</p>

            {needsVariant && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-charcoal/80">Choose an option</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        variantId === v.id
                          ? "border-pink-deep bg-pink-pale text-charcoal"
                          : "border-border bg-white text-mid-gray hover:border-pink-blush"
                      }`}
                    >
                      {v.label}
                      {Number(v.price_modifier) > 0 ? ` (+$${Number(v.price_modifier).toFixed(0)})` : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {needsCustom && (
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-charcoal/80">
                  Personalization (name, word, or initials)
                </label>
                <input
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  maxLength={20}
                  placeholder="e.g. Jordyn"
                  className="w-full rounded-2xl border border-border bg-white px-5 py-3.5 outline-none focus:border-pink-deep"
                />
                <p className="mt-1 text-xs text-mid-gray">Up to 20 characters · 5–7 business days to produce</p>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg" aria-label="Decrease quantity">−</button>
                <span className="w-8 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-lg" aria-label="Increase quantity">+</button>
              </div>
              <button onClick={addToCart} className="btn-primary flex-1">Add to Cart</button>
            </div>

            <div className="mt-6 rounded-2xl bg-pink-pale/50 p-5">
              <p className="font-display text-lg">Want it welded on permanently?</p>
              <p className="mt-1 text-sm text-mid-gray">Book the in-studio Keep Glowing Girl experience.</p>
              <Link to={ROUTES.book} className="btn-secondary mt-3 inline-block">Book Permanent Jewelry</Link>
            </div>

            {product.description && (
              <p className="mt-8 leading-relaxed text-mid-gray">{product.description}</p>
            )}

            <ul className="mt-6 space-y-2 text-sm text-charcoal">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Tarnish-free & hypoallergenic</li>
              <li className="flex items-center gap-2"><Droplet className="h-4 w-4 text-gold" /> Waterproof — shower & swim safe</li>
              <li className="flex items-center gap-2"><SparklesIcon className="h-4 w-4 text-gold" /> Designed in Charlotte since 2018</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
