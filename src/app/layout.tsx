import type { Metadata, Viewport } from "next";
import { Public_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travelama — Digital Property Guides That Delight Your Guests",
  description:
    "94% of hosts save 5+ hours per booking with instant WiFi access, house rules, and local recommendations. Start free for 1 property.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Travelama — Digital Property Guides That Delight Your Guests",
    description:
      "94% of hosts save 5+ hours per booking with instant WiFi access, house rules, and local recommendations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travelama — Digital Property Guides That Delight Your Guests",
    description:
      "94% of hosts save 5+ hours per booking with instant WiFi access, house rules, and local recommendations.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0E7490",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
