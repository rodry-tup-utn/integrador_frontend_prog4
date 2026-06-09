import type { ProductPublic } from "../../products/types/product";

export interface CartItem {
  product: ProductPublic;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: ProductPublic) => boolean;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => boolean;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
