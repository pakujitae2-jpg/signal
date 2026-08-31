import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE, OG_DOWN, OG_MUTED, OG_UP } from "@/components/OgCard";
import { fmtCompactUsd, fmtNum, fmtTime } from "@/lib/format";
import { isLang } from "@/lib/i18n";
import { getMarketData } from "@/lib/market";
import { localName } from "@/lib/names";
import type { Lang } from "@/lib/i18n";
import type { Quote } from "@/lib/types";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Markets";

const TITLES = {
  ko: { us: "미국 증시", japan: "일본 증시", korea: "한국 증시", crypto: "암호화폐 시장", tagline: "실시간 지수 현황", cap: "시가총액" },
  ja: { us: "米国株式市場", japan: "日本株式市場", korea: "韓国株式市場", crypto: "暗号資産市場", tagline: "リアルタイム指数", cap: "時価総額" },
};

function Row({ q, lang }: { q: Quote; lang: Lang }) {
  const up = (q.changePct ?? 0) >= 0;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: 480, fontSize: 28 }}>
      <span style={{ fontWeight: 700 }}>{localName(lang, q.symbol, q.name)}</span>
      <span style={{ display: "flex", gap: 16 }}>
        <span>{fmtNum(q.price, undefined)}</span>
        <span style={{ color: q.changePct === null ? OG_MUTED : up ? OG_UP : OG_DOWN, fontWeight: 700 }}>
          {q.changePct === null ? "—" : `${up ? "+" : "−"}${Math.abs(q.changePct).toFixed(2)}%`}
        </span>
      </span>
    </div>
  );
}

export default async function OgImage({ params }: { params: Promise<{ lang: string; region: string }> }) {
  const { lang: rawLang, region } = await params;
  const lang = (isLang(rawLang) && rawLang !== "en" ? rawLang : "ko") as "ko" | "ja";
  const t = TITLES[lang];
  const data = await getMarketData();
  const title = (t as Record<string, string>)[region] ?? "Markets";

  const rows: Quote[] =
    region === "us"
      ? data.regions.us.indices
      : region === "japan"
        ? data.regions.jp.indices
        : region === "korea"
          ? data.regions.kr.indices
          : data.crypto.slice(0, 4).map((c) => ({ symbol: c.symbol, name: c.name, price: c.price, change: null, changePct: c.changePct24h, currency: "USD" }));

  return new ImageResponse(
    (
      <OgFrame asOf={`${fmtTime(data.updatedAt)} UTC`} tagline={region === "crypto" ? `${t.cap} ${fmtCompactUsd(data.cryptoGlobal?.totalMarketCapUsd ?? 0)}` : t.tagline}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 30 }}>{title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rows.slice(0, 4).map((q) => (
              <Row key={q.symbol} q={q} lang={lang} />
            ))}
          </div>
        </div>
      </OgFrame>
    ),
    size
  );
}
