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
  isCustomizable: boolean;
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
  iconType: 'craft' | 'fit' | 'fabric' | 'bulk';
}
export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp';
}