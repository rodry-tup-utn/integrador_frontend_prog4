import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartState } from "../types/cart.types";
import type { ProductPublic } from "../../products/types/product";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: ProductPublic) => {

        const existing = get().items.find((item) => item.product.id === product.id);

        if (existing) {
          set((state) => ({
            items: state.items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, { product, quantity: 1 }] }));
        }
      },

      removeItem: (productId: number) => {
        set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, item) => acc + item.product.base_price * item.quantity, 0),
    }),
    { name: "cart-storage" },
  ),
);
