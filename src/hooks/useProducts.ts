import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductWithVariants = Product & { product_variants: ProductVariant[] };

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", category ?? "all"],
    queryFn: async (): Promise<ProductWithVariants[]> => {
      let query = supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("in_stock", true)
        .order("sort_order");
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as ProductWithVariants[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async (): Promise<ProductWithVariants> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as unknown as ProductWithVariants;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async (): Promise<ProductWithVariants[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("in_stock", true)
        .eq("featured", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as ProductWithVariants[];
    },
  });
}
