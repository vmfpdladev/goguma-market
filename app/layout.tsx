import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "고구마마켓",
  description: "고구마마켓 - 당신의 쇼핑 파트너",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />

        {/* 메인 컨텐츠 */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* 푸터 */}
        <footer className="w-full border-t border-gray-200 bg-white mt-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-600">
              © 2025 Yeonju AI. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
