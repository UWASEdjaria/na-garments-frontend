import { Product } from ".";

export interface CartItem {
  id?: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string | null;
  color?: string | null;
}