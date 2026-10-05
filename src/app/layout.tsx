import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

  title: {
    template: "%s | NA-GARMENTS",
    default: "NA-GARMENTS | Clothing Made for Work, School & Everyday Life",
  },

  description:
    "NA-GARMENTS makes school uniforms, workwear, men’s clothing, ready-to-wear garments, and custom clothing in Kigali, Rwanda.",

  keywords: [
    "NA-GARMENTS",
    "tailoring in Kigali",
    "clothing in Kigali",
    "school uniforms Rwanda",
    "workwear Rwanda",
    "men's clothing Rwanda",
    "custom clothing Kigali",
    "ready-to-wear clothing Rwanda",
  ],

  openGraph: {
    title: "NA-GARMENTS | Clothing Made for Work, School & Everyday Life",
    description:
      "School uniforms, workwear, men’s clothing, ready-to-wear garments, and custom clothing made in Kigali, Rwanda.",
    url: "https://nagarments.com",
    siteName: "NA-GARMENTS",
    type: "website",
    locale: "en_RW",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
