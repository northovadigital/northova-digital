"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { CartItem } from "@/types/cart";

type AddCartItem = Omit<CartItem, "key" | "quantity">;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: AddCartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "fk-cart-v2";
const LEGACY_STORAGE_KEY = "fk-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

function createCartKey(item: AddCartItem): string {
  return `${item.productId}:${item.variantId}`;
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      try {
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);

        const storedCart =
          window.localStorage.getItem(STORAGE_KEY);

        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);

          if (Array.isArray(parsedCart)) {
            setItems(parsedCart as CartItem[]);
          }
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }

      setReady(true);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    );
  }, [items, ready]);

  function addItem(item: AddCartItem) {
    const key = createCartKey(item);

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (currentItem) => currentItem.key === key,
      );

      if (existingItem) {
        return currentItems.map((currentItem) =>
          currentItem.key === key
            ? {
                ...currentItem,
                quantity: Math.min(
                  currentItem.quantity + 1,
                  currentItem.maxStock,
                ),
              }
            : currentItem,
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          key,
          quantity: 1,
        },
      ];
    });
  }

  function removeItem(key: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.key !== key),
    );
  }

  function updateQuantity(
    key: string,
    quantity: number,
  ) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.key !== key) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(
            1,
            Math.min(quantity, item.maxStock),
          ),
        };
      }),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = items.reduce(
    (total, item) =>
      total + item.unitPrice * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider.",
    );
  }

  return context;
}
