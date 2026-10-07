import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "바이탈케어 (VitalCare) | 프리미엄 건강기능식품 전문몰",
  description:
    "신뢰할 수 있는 엄선된 성분과 과학적인 맞춤 설계. 활력 넘치는 일상을 위한 프리미엄 건강기능식품 플랫폼입니다.",
  keywords: [
    "건강기능식품",
    "영양제",
    "비타민",
    "유산균",
    "오메가3",
    "밀크씨슬",
    "건강몰",
  ],
  authors: [{ name: "VitalCare" }],
  openGraph: {
    title: "바이탈케어 (VitalCare) | 프리미엄 건강기능식품 전문몰",
    description: "신뢰할 수 있는 엄선된 성분과 과학적인 맞춤 설계.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
