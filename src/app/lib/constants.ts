import {
  NavItem,
  FeaturePillar,
  FooterLink,
  SocialLink,
  ProcessStep,
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
export const TAILORING_STEPS: ProcessStep[] = [
  {
    stepNumber: 1,
    title: 'Choose Your Style',
    description: 'Tell us what garment you need and the style you prefer.',
  },
  {
    stepNumber: 2,
    title: 'Share Your Measurements',
    description: 'Provide your measurements so we can plan the right fit.',
  },
  {
    stepNumber: 3,
    title: 'Fitting & Adjustments',
    description: 'We prepare your garment and make adjustments where needed.',
  },
  {
    stepNumber: 4,
    title: 'Final Garment',
    description: 'Receive your finished garment according to your requirements.',
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
  {
    platform: 'Facebook',
    href: 'https://www.Facebook.com/',
    ariaLabel: 'Facebook',
  },
  {
    platform: 'Instagram',
    href: 'https://www.instagram.com/nagarmentss/',
    ariaLabel: 'Instagram',
  },
  {
    platform: 'TikTok',
    href: 'https://tiktok.com',
    ariaLabel: 'TikTok',
  },
  {
    platform: 'WhatsApp',
    href: 'https://wa.me/250788000000',
    ariaLabel: 'WhatsApp',
  },
];
export const CONTACT_INFO = {
  phoneDisplay: '+250781070569',
  phoneHref: 'tel:+250781070569',
  emailDisplay: 'nagarmentss@gmail.com',
  emailHref: 'mailto:nagarmentss@gmail.com',
  locationDisplay: 'Batsinda Bus Park, Batsinda-Kagugu, Kigali, Rwanda',
  locationMapHref: 'https://www.google.com/maps/search/?api=1&query=Batsinda+Bus+Park%2C+Batsinda-Kagugu%2C+Kigali%2C+Rwanda',
};