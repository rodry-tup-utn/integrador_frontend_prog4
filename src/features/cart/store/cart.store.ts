import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartState } from "../types/cart.types";
import type { ProductPublic } from "../../products/types/product";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: ProductPublic): boolean => {
        const itemInCart = get().items.find((item) => item.product.id === product.id);

        if (itemInCart) {
          if (itemInCart.quantity < itemInCart.product.stock) {
            set((state) => ({
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            }));
            return true;
          } else {
            return false;
          }
        } else {
          set((state) => ({ items: [...state.items, { product, quantity: 1 }] }));
          return true;
        }
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number): boolean => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return false;
        }

        const itemInCart = get().items.find((item) => item.product.id === productId);

        if (itemInCart) {
          if (quantity <= itemInCart.product.stock) {
            set((state) => ({
              items: state.items.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item,
              ),
            }));
            return true;
          }
          return false;
        }
        return false;
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, item) => acc + item.product.base_price * item.quantity, 0),
    }),
    { name: "cart-storage" },
  ),
);
