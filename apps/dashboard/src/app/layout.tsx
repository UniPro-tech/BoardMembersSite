import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/libs/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "UniPro役員選挙管理システム",
    template: "%s - UniPro役員選挙管理システム",
  },
  description: "UniPro役員選挙管理システムへようこそ！",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cn("font-sans", inter.variable)}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
