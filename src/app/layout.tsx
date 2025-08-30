import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@/style/globals.css";
import "@/style/theme.css";
import "@/style/misc.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ebec.ensia.dz"),
  title: {
    default: "EBEC - ENSIA's Business & Entrepreneurship Club",
    template: "%s | EBEC",
  },
  description:
    "ENSIA's Business & Entrepreneurship Club - Empowering future entrepreneurs and business leaders through innovation, networking, and practical experience.",
  keywords: [
    "EBEC",
    "Business",
    "Entrepreneurship",
    "ENSIA",
    "Club",
    "Innovation",
    "Networking",
    "Algeria",
    "Business Club",
    "Student Organization",
  ],
  authors: [{ name: "EBEC Team" }],
  creator: "EBEC",
  publisher: "EBEC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ebec.ensia.dz",
    siteName: "EBEC",
    title: "EBEC - ENSIA's Business & Entrepreneurship Club",
    description:
      "ENSIA's Business & Entrepreneurship Club - Empowering future entrepreneurs and business leaders through innovation, networking, and practical experience.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EBEC Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EBEC - ENSIA's Business & Entrepreneurship Club",
    description:
      "ENSIA's Business & Entrepreneurship Club - Empowering future entrepreneurs and business leaders through innovation, networking, and practical experience.",
    images: ["/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://ebec.ensia.dz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`
      ${geistSans.variable} ${geistMono.variable} 
        antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
