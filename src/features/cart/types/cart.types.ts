import type { ProductPublic } from "../../products/types/product";

export interface CartItem {
  product: ProductPublic;
  quantity: number;
  personalization: number[];
}

export interface CartState {
  items: CartItem[];
  addItem: (product: ProductPublic, personalization?: number[]) => boolean;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => boolean;
  setItemPersonalization: (productId: number, personalization: number[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
