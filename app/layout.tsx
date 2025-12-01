import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
        <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* 로고 */}
              <Link
                href="/"
                className="flex items-center text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
              >
                <span className="text-2xl mr-2">🍠</span>
                <span className="hidden sm:inline">고구마마켓</span>
                <span className="sm:hidden">고구마</span>
              </Link>

              {/* 로그인/회원가입 버튼 */}
              <nav className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  회원가입
                </Link>
              </nav>
            </div>
          </div>
        </header>

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
