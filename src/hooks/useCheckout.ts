import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/context/CartContext";

export async function initiateCheckout(
  cart: CartItem[],
  customerEmail: string,
  customerName: string,
) {
  const { data, error } = await supabase.functions.invoke("create-checkout-session", {
    body: {
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        variantLabel: item.variantLabel,
        customizationText: item.customizationText,
        priceModifier: item.priceModifier || 0,
      })),
      customerEmail,
      customerName,
    },
  });
  if (error) throw error;
  if (!data?.url) throw new Error("No checkout URL returned");
  window.location.href = data.url; // redirect to Stripe hosted checkout
}
