import {
  NavItem,
  CategoryCard,
  ProductCard,
  ProcessStep,
  FeaturePillar,
  FooterLink,
  SocialLink,
} from '@/app/types';

export const BRAND_COLORS = {
  primaryBlue: '#123B5D',
  black: '#111111',
  orange: '#F28C28',
  lightBlueGray: '#EEF3F6',
  white: '#FFFFFF',
};

export const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Custom Tailoring', href: '/custom-order' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const FEATURED_CATEGORIES: CategoryCard[] = [
  {
    id: 'cat-1',
    name: 'School Uniforms',
    slug: 'school-uniforms',
    description: 'Durable, tailored primary and secondary school uniforms engineered for daily wear and maximum comfort.',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1682502690/samples/landscapes/beach-boat.jpg',
    itemCountText: '30+ Custom Designs',
  },
  {
    id: 'cat-2',
    name: "Men's Fashion",
    slug: 'mens-fashion',
    description: 'Bespoke two-piece suits, tailored trousers, blazer jackets, and luxury formalwear crafted with high precision fit.',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1682502684/samples/people/smiling-man.jpg',
    itemCountText: 'Ready-to-wear & Custom',
  },
  {
    id: 'cat-3',
    name: 'Engineering & Workwear',
    slug: 'engineering-workwear',
    description: 'Heavy-duty industrial overalls, high-visibility reflective vests, and protective apparel built for safety.',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1682502680/samples/architecture/buildings.jpg',
    itemCountText: 'Industrial Grade Standard',
  },
];

export const MOCK_FEATURED_PRODUCTS: ProductCard[] = [
  {
    id: 'prod-1',
    name: 'Executive Bespoke Two-Piece Suit',
    description: 'Tailored executive wool blend suit engineered for perfect fit and professional presentation.',
    price: 95000,
    currency: 'RWF',
    categoryName: "Men's Fashion",
    isCustomizable: true,
    tag: 'Bespoke',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1682502684/samples/people/smiling-man.jpg',
  },
  {
    id: 'prod-2',
    name: 'Heavy-Duty Reflective Work Coverall',
    description: 'Reinforced industrial overall with multi-pocket utility design and high-visibility safety tape.',
    price: 38000,
    currency: 'RWF',
    categoryName: 'Engineering & Workwear',
    isCustomizable: true,
    tag: 'Workwear',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1682502680/samples/architecture/buildings.jpg',
  },
  {
    id: 'prod-3',
    name: 'Academy Blazer & Trouser Uniform Set',
    description: 'Breathable, fade-resistant institutional blazer and pants set designed for Rwandan schools.',
    price: 26000,
    currency: 'RWF',
    categoryName: 'School Uniforms',
    isCustomizable: false,
    tag: 'Ready-To-Wear',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1682502690/samples/landscapes/beach-boat.jpg',
  },
  {
    id: 'prod-4',
    name: 'Custom Tailored Cotton Dress Shirt',
    description: 'Pure Egyptian cotton custom-fitted dress shirt with double-button barrel cuffs.',
    price: 30000,
    currency: 'RWF',
    categoryName: "Men's Fashion",
    isCustomizable: true,
    tag: 'Bespoke',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1682502684/samples/people/smiling-man.jpg',
  },
];

export const TAILORING_STEPS: ProcessStep[] = [
  {
    stepNumber: 1,
    title: 'Select Garment Type',
    description: 'Pick your desired category—from luxury suits and formalwear to institutional uniforms.',
  },
  {
    stepNumber: 2,
    title: 'Submit Precise Measurements',
    description: 'Provide custom body measurements online or book a tailoring appointment in Kigali.',
  },
  {
    stepNumber: 3,
    title: 'Customize Fabric & Details',
    description: 'Choose your premium textile, collar style, linings, and customized embroidery details.',
  },
  {
    stepNumber: 4,
    title: 'Master Crafting & Delivery',
    description: 'Our tailors craft your garment with precision, followed by rapid doorstep delivery.',
  },
];

export const WHY_CHOOSE_US: FeaturePillar[] = [
  {
    id: 'f1',
    title: 'Master Craftsmanship',
    description: 'Every seam, lapel, and stitch is executed by experienced master tailors using top-grade equipment.',
    iconType: 'craft',
  },
  {
    id: 'f2',
    title: 'Precision Custom Fit',
    description: 'We eliminate guesswork through custom fitting options tailored to your exact measurements.',
    iconType: 'fit',
  },
  {
    id: 'f3',
    title: 'Industrial & Durable Fabrics',
    description: 'Tested materials selected for high comfort, color retention, and severe daily wear resistance.',
    iconType: 'fabric',
  },
  {
    id: 'f4',
    title: 'Enterprise Bulk Capacity',
    description: 'Reliable high-volume production lines capable of supplying schools and corporate clients on time.',
    iconType: 'bulk',
  },
];

export const FOOTER_COLLECTIONS: FooterLink[] = [
  { label: 'School Uniforms', href: '/shop?category=school-uniforms' },
  { label: "Men's Fashion", href: '/shop?category=mens-fashion' },
  { label: 'Engineering & Workwear', href: '/shop?category=engineering-workwear' },
];

export const FOOTER_PAGES: FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Custom Tailoring', href: '/custom-order' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Wishlist', href: '/wishlist' },
];

export const FOOTER_CUSTOMER: FooterLink[] = [
  { label: 'My Account / Login', href: '/account' },
  { label: 'My Orders', href: '/account/orders' },
  { label: 'Cart', href: '/cart' },
  { label: 'Wishlist', href: '/wishlist' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Facebook', href: 'https://www.Facebook.com/', platform: 'facebook' },
  { name: 'Instagram', href: 'https://www.instagram.com/nagarmentss/', platform: 'instagram' },
  { name: 'TikTok', href: 'https://tiktok.com', platform: 'tiktok' },
  { name: 'WhatsApp', href: 'https://wa.me/250788000000', platform: 'whatsapp' },
];

export const CONTACT_INFO = {
  phoneDisplay: '+250 788 000 000',
  phoneHref: 'tel:+250788000000',
  emailDisplay: 'nagarmentss@gmail.com',
  emailHref: 'mailto:nagarmentss@gmail.com',
  locationDisplay: 'Batsinda Bus Park, Batsinda-Kagugu, Kigali, Rwanda',
  locationMapHref: 'https://www.google.com/maps/search/?api=1&query=Batsinda+Bus+Park%2C+Batsinda-Kagugu%2C+Kigali%2C+Rwanda',
};