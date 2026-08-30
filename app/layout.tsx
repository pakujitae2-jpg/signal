import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  title: "시그널 — 암호화폐·미국·일본·한국 마켓을 한눈에",
  description:
    "암호화폐, 미국·일본·한국 주식, 환율, 원자재, 실시간 뉴스까지. 전 세계 시장 정보를 한 화면에서 가장 빠르게 확인하세요.",
  keywords: ["암호화폐", "비트코인", "코스피", "나스닥", "닛케이", "환율", "주식", "시세"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0e12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        {ADSENSE_CLIENT && (
          <Script
            id="adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
