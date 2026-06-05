import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  unitPrice: number; // base price + variant modifier
  priceModifier?: number;
  quantity: number;
  variantLabel?: string;
  customizationText?: string;
  gradient: string; // placeholder image gradient
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  keyFor: (item: Pick<CartItem, "productId" | "variantLabel" | "customizationText">) => string;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "glowgirl_cart";

function makeKey(item: Pick<CartItem, "productId" | "variantLabel" | "customizationText">) {
  return [item.productId, item.variantLabel ?? "", item.customizationText ?? ""].join("|");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const key = makeKey(item);
      const existing = prev.find((p) => makeKey(p) === key);
      if (existing) {
        return prev.map((p) =>
          makeKey(p) === key ? { ...p, quantity: p.quantity + item.quantity } : p,
        );
      }
      return [...prev, item];
    });
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((p) => makeKey(p) !== key));
  }

  function updateQuantity(key: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(key);
      return;
    }
    setItems((prev) => prev.map((p) => (makeKey(p) === key ? { ...p, quantity } : p)));
  }

  function clearCart() {
    setItems([]);
  }

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  );
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    count,
    keyFor: makeKey,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
