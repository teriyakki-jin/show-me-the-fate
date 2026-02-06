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
  title: "사주팔자 | 당신의 운명을 알아보세요",
  description: "생년월일과 시간을 입력하여 사주팔자를 분석하고, 타고난 성격과 운세를 확인하세요. 한국 전통 사주명리학 기반의 무료 운세 서비스입니다.",
  keywords: "사주, 사주팔자, 운세, 사주풀이, 무료사주, 생년월일 운세, 오행, 사주명리",
  openGraph: {
    title: "사주팔자 | 당신의 운명을 알아보세요",
    description: "생년월일과 시간을 입력하여 사주팔자를 분석하고, 타고난 성격과 운세를 확인하세요.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
