import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from '@/app/components/ToastProvider';
import { CurrencyProvider } from '@/app/components/CurrencyProvider';
import "./globals.css";

import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nagarments.com"),

  verification: {
    google: "Yz1NIcyTZcDQqkS5kM2Zbjh2m_ShnXZ15QLFZzdUcq8",
  },

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  title: {
    template: "%s | nagarments",
    default: "Tailor in Kigali, Rwanda | nagarments",
  },

  description:
    "Discover nagarments in Kigali, Rwanda, for custom clothing, school uniforms, medical and healthcare wear, corporate shirts, safety workwear, Kitenge and African print, dresses, traditional wear, and more.",

  keywords: [
    "nagarments",
    "tailor in Kigali",
    "custom clothing Kigali",
    "medical and healthcare wear Rwanda",
    "T-shirts and polo shirts Rwanda",
    "Kitenge and African print clothing",
    "safety vests and field jackets",
    "safety overalls and workwear",
    "men's corporate and casual shirts",
    "hoodies and sweaters",
    "kids' clothing Rwanda",
    "evening and party dresses",
    "women's corporate and formal wear",
    "graduation and ceremony dresses",
    "caps and headwear",
    "hospitality and culinary uniforms",
    "engineering workwear",
    "men's traditional wear and senator suits",
    "school uniforms Rwanda",
    "clothing in Kigali",
  ],

  openGraph: {
    title: "Tailor in Kigali, Rwanda | nagarments",
    description:
      "Explore custom clothing, school uniforms, healthcare apparel, corporate clothing, safety workwear, African print fashion, dresses, and traditional wear from nagarments in Kigali, Rwanda.",
    url: "https://nagarments.com",
    siteName: "nagarments",
    type: "website",
    locale: "en_RW",
    images: [
      {
        url: "/nagarments-logo.png",
        width: 1503,
        height: 670,
        alt: "nagarments clothing and tailoring in Kigali, Rwanda",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tailor in Kigali, Rwanda | nagarments",
    description:
      "Custom clothing, uniforms, healthcare apparel, safety workwear, African print fashion, and more in Kigali, Rwanda.",
    images: ["/nagarments-logo.png"],
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <CurrencyProvider>{children}</CurrencyProvider>
        </ToastProvider>
      </body>
      <GoogleAnalytics gaId="G-94ZJDRSGXZ" />
    </html>
  );
}
