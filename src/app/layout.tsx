import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "사주팔자 | 절기 기준 명리 계산",
  description: "양력·음력 생년월일시를 절기 기준으로 계산하고 전통 명리 해석을 재미와 자기 성찰을 위한 참고 콘텐츠로 제공합니다.",
  keywords: "사주, 사주팔자, 운세, 사주풀이, 무료사주, 생년월일 운세, 오행, 사주명리",
  openGraph: {
    title: "사주팔자 | 절기 기준 명리 계산",
    description: "생년월일시의 사주 원국과 대운을 계산하고, 계산 관법을 함께 확인하세요.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
