import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import { ChatAssistant } from "@/components/layout/ChatAssistant";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShopEase | Premium Artisanal E-commerce",
    template: "%s | ShopEase"
  },
  description: "Advanced AI-powered e-commerce ecosystem for high performance and personalized shopping.",
  keywords: ["e-commerce", "artisanal", "AI shopping", "premium fashion", "smart recommendations"],
  authors: [{ name: "ShopEase Team" }],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shopease-ai.vercel.app",
    siteName: "ShopEase",
    title: "ShopEase | Premium Artisanal E-commerce",
    description: "Discover curated artisanal pieces powered by AI.",
    images: [{ url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopEase | Premium AI E-commerce",
    description: "The future of artisanal shopping is here.",
    images: ["https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200"],
    creator: "@shopease"
  },
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/favicon.svg" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", inter.variable, outfit.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
        <ChatAssistant />
      </body>
    </html>
  );
}
