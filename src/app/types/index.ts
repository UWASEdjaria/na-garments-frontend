/**
 * Navigation items used across Navbar and Footer
 */
export interface NavItem {
  label: string;
  href: string;
}

/**
 * Featured category items displayed on the homepage
 */
export interface CategoryCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCountText: string;
}

/**
 * Product structure for ready-to-wear and customizable garments
 */
export interface ProductCard {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  categoryName: string;
  imageUrl: string;
  tag?: string;
}

/**
 * Steps in the custom tailoring workflow
 */
export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
}

/**
 * Brand benefit pillars highlighting core selling propositions
 */
export interface FeaturePillar {
  id: string;
  title: string;
  description: string;
}
export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  ariaLabel: string;
}
// Backend Domain API Types
export type StockStatus = 'low' | 'medium' | 'overstock';

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  productId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  minimumStockLevel: number;
  isAvailable: boolean;
  stockStatus?: StockStatus;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  sizes: string[];
  colors: string[];
  createdAt: string;
  updatedAt: string;
}
export interface CartItem {
  id: string;
  cartId?: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string | null;
  color?: string | null;
}
export interface ProductQueryParams {
  name?: string;
  categoryId?: string;
  slug?: string;
  page?: number;
  limit?: number;
}