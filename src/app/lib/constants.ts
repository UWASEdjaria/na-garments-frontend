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
  { label: "Men's Traditional & Senator Suits", href: '/shop?category=mens-traditional-wear-senator-suits' },
  { label: "Men's Corporate & Casual Shirts", href: '/shop?category=mens-shirts-corporate-casual-wear' },
  { label: 'Workwear & Safety Overalls', href: '/shop?category=safety-overalls-workwear' },
  { label: 'Safety Vests & Field Jackets', href: '/shop?category=safety-vests-field-jackets' },
  { label: 'Medical & Healthcare Wear', href: '/shop?category=medical-healthcare-wear' },
  { label: 'T-Shirts & Polo Shirts', href: '/shop?category=t-shirts-polo-shirts-lacoste' },
  { label: 'Kitenge & African Print', href: '/shop?category=kitenge-african-print' },
  { label: 'Hospitality & Culinary', href: '/shop?category=hospitality-culinary' },
  { label: "Women's Corporate & Formal Wear", href: '/shop?category=womens-corporate-formal-wear' },
  { label: 'Evening & Party Dresses', href: '/shop?category=evening-party-dresses' },
  { label: 'Graduation & Ceremony Dresses', href: '/shop?category=graduation-ceremony-dresses' },
  { label: 'Hoodies & Sweaters', href: '/shop?category=hoodies-sweaters' },
  { label: 'Caps & Headwear', href: '/shop?category=caps-headwear' },
  { label: "Kids' Clothing", href: '/shop?category=kids-clothing' },
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
    href: 'https://www.facebook.com/Nagarmentss',
    ariaLabel: 'Facebook',
  },
  {
    platform: 'Instagram',
    href: 'https://www.instagram.com/nagarmentss/',
    ariaLabel: 'Instagram',
  },
  {
    platform: 'TikTok',
    href: 'https://www.tiktok.com/@nagarmentss',
    ariaLabel: 'TikTok',
  },
  {
    platform: 'WhatsApp',
    href: 'https://wa.me/250781070569',
    ariaLabel: 'WhatsApp',
  },
];
export const CONTACT_INFO = {
  phoneDisplay: '0781070569 / 0785069455',
  phoneHref: 'tel:+250781070569',
  phoneNumbers: [
    { display: '0781070569', href: 'tel:+250781070569' },
    { display: '0785069455', href: 'tel:+250785069455' },
  ],
  emailDisplay: 'nagarmentss@gmail.com',
  emailHref: 'mailto:nagarmentss@gmail.com',
  locationDisplay: 'Batsinda Bus Park, Batsinda-Kagugu, Kigali, Rwanda',
  locationMapHref: 'https://www.google.com/maps/search/?api=1&query=Batsinda+Bus+Park%2C+Batsinda-Kagugu%2C+Kigali%2C+Rwanda',
};
