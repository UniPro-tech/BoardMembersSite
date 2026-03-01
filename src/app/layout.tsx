import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MiniDrawer from "@/components/Sidebar";
import CustomBreadcrumbs from "@/components/Sidebar/CustomBreadcrumbs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UniPro役員選挙管理システム",
    template: "%s - UniPro役員選挙管理システム",
  },
  description: "UniPro役員選挙管理システムへようこそ！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MiniDrawer>
          <CustomBreadcrumbs />
          {children}
        </MiniDrawer>
      </body>
    </html>
  );
}
