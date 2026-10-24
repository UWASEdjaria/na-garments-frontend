import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from '@/app/components/ToastProvider';
import { CurrencyProvider } from '@/app/components/CurrencyProvider';
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

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  title: {
    template: "%s | nagarments",
    default: "nagarments | Clothing Made for Work, School & Everyday Life",
  },

  description:
    "nagarments makes school uniforms, workwear, menâ€™s clothing, ready-to-wear garments, and custom clothing in Kigali, Rwanda.",

  keywords: [
    "nagarments",
    "tailoring in Kigali",
    "clothing in Kigali",
    "school uniforms Rwanda",
    "workwear Rwanda",
    "men's clothing Rwanda",
    "custom clothing Kigali",
    "ready-to-wear clothing Rwanda",
  ],

  openGraph: {
    title: "nagarments | Clothing Made for Work, School & Everyday Life",
    description:
      "School uniforms, workwear, menâ€™s clothing, ready-to-wear garments, and custom clothing made in Kigali, Rwanda.",
    url: "https://nagarments.com",
    siteName: "nagarments",
    type: "website",
    locale: "en_RW",
    images: [
      {
        url: "/nagarments-logo.png",
        width: 1503,
        height: 670,
        alt: "nagarments logo",
      },
    ],
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
    </html>
  );
}
