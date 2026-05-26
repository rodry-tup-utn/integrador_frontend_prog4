import type { ProductPublic } from "../../products/types/product";

export interface CartItem {
  product: ProductPublic;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: ProductPublic) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
