import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ROUTES } from "@/lib/site";
import { productPath } from "@/lib/shop";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, keyFor, count } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-xl px-6 text-center">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-pink-pale">
            <ShoppingBag className="h-7 w-7 text-charcoal" />
          </span>
          <h1 className="mt-6 font-display text-4xl">Your cart is empty</h1>
          <p className="mt-3 text-mid-gray">Let's find something that makes you glow ✨</p>
          <Link to={ROUTES.shopAll} className="btn-primary mt-6 inline-block">Shop the Collections</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad bg-cream">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="font-display text-4xl sm:text-5xl">Your Cart</h1>
        <p className="mt-2 text-mid-gray">{count} item{count === 1 ? "" : "s"}</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {items.map((item) => {
              const key = keyFor(item);
              return (
                <div key={key} className="flex gap-4 rounded-3xl bg-white p-4 shadow-[var(--shadow-card)]">
                  <div className={`h-24 w-24 shrink-0 rounded-2xl bg-gradient-to-br ${item.gradient}`} />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={productPath(item.slug)} className="font-display text-lg leading-tight">
                          {item.name}
                        </Link>
                        {item.variantLabel && (
                          <p className="text-sm text-mid-gray">{item.variantLabel}</p>
                        )}
                        {item.customizationText && (
                          <p className="text-sm text-mid-gray">"{item.customizationText}"</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(key)}
                        className="text-mid-gray transition hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border">
                        <button onClick={() => updateQuantity(key, item.quantity - 1)} className="px-3 py-1.5" aria-label="Decrease">−</button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(key, item.quantity + 1)} className="px-3 py-1.5" aria-label="Increase">+</button>
                      </div>
                      <span className="font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-2xl">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-mid-gray">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mid-gray">Shipping</span>
                <span className="text-gold">Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-xl">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button onClick={() => navigate(ROUTES.checkout)} className="btn-primary mt-6 w-full">
              Proceed to Checkout
            </button>
            <Link to={ROUTES.shopAll} className="mt-3 block text-center text-sm text-mid-gray story-link">
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
