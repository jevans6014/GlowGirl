import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { ProductCard, ProductCardSkeleton } from "@/components/shop/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { categoryBySlug } from "@/lib/shop";

type SortKey = "featured" | "price-asc" | "price-desc";

export default function Collection() {
  const { category: slug } = useParams<{ category: string }>();
  const meta = slug ? categoryBySlug(slug) : undefined;
  const { data, isLoading, error } = useProducts(meta?.category);
  const [sort, setSort] = useState<SortKey>("featured");

  if (!meta) {
    return (
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-display text-4xl">Collection not found</h1>
          <Link to="/shop" className="btn-primary mt-6 inline-block">Back to Shop</Link>
        </div>
      </section>
    );
  }

  const products = [...(data ?? [])].sort((a, b) => {
    if (sort === "price-asc") return Number(a.base_price) - Number(b.base_price);
    if (sort === "price-desc") return Number(b.base_price) - Number(a.base_price);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.sort_order - b.sort_order;
  });

  return (
    <>
      <section className={`bg-gradient-to-br ${meta.gradient} py-20`}>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-display text-5xl text-balance sm:text-6xl">{meta.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-charcoal/75">{meta.blurb}</p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center justify-between gap-4">
            <p className="text-sm text-mid-gray">
              {isLoading ? "Loading…" : `${products.length} item${products.length === 1 ? "" : "s"}`}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-border bg-cream px-4 py-2 text-sm outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {error && (
            <div className="rounded-2xl bg-pink-pale/50 p-8 text-center text-mid-gray">
              <p>We couldn't load these products. The shop database may not be set up yet.</p>
              <p className="mt-2 text-xs">Run the SQL migration in Supabase to seed products.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((p, i) => (
                  <Reveal key={p.id} delay={i % 4}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
          </div>

          {!isLoading && !error && products.length === 0 && (
            <div className="py-16 text-center text-mid-gray">
              <p>No items in this collection yet — check back soon ✨</p>
              <Link to="/shop" className="btn-secondary mt-6 inline-block">Browse other collections</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
