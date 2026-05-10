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
  title: "ShopEase | Premium E-commerce Experience",
  description: "Advanced e-commerce ecosystem for high performance and personalized shopping.",
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
