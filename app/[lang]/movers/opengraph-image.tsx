import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE, OG_DOWN, OG_UP } from "@/components/OgCard";
import { fmtTime } from "@/lib/format";
import { isLang } from "@/lib/i18n";
import { getMovers, type Mover } from "@/lib/movers";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Daily Movers";

const LABELS = {
  ko: { title: "오늘의 급등락 종목", gainers: "상승률 상위", losers: "하락률 상위", tagline: "미국·일본·한국 증시 및 암호화폐" },
  ja: { title: "本日の値動きランキング", gainers: "値上がり率上位", losers: "値下がり率上位", tagline: "米国・日本・韓国株と暗号資産" },
};

function Row({ m }: { m: Mover }) {
  const up = m.changePct >= 0;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: 460, fontSize: 26 }}>
      <span style={{ fontWeight: 700 }}>{m.symbol.replace(/-USD$/, "")}</span>
      <span style={{ color: up ? OG_UP : OG_DOWN, fontWeight: 700 }}>
        {up ? "+" : "−"}{Math.abs(m.changePct).toFixed(2)}%
      </span>
    </div>
  );
}

export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = isLang(rawLang) && rawLang !== "en" ? rawLang : "ko";
  const t = LABELS[lang as "ko" | "ja"];
  const data = await getMovers();
  const all = [...data.equities, ...data.crypto].sort((a, b) => b.changePct - a.changePct);
  const gainers = all.slice(0, 4);
  const losers = all.slice(-4).reverse();

  return new ImageResponse(
    (
      <OgFrame asOf={`${fmtTime(data.updatedAt)} UTC`} tagline={t.tagline}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 44, fontWeight: 700, marginBottom: 30 }}>{t.title}</div>
          <div style={{ display: "flex", gap: 60 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 22, color: "#8b877c", letterSpacing: "0.08em" }}>{t.gainers}</div>
              {gainers.map((m) => (
                <Row key={m.symbol} m={m} />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 22, color: "#8b877c", letterSpacing: "0.08em" }}>{t.losers}</div>
              {losers.map((m) => (
                <Row key={m.symbol} m={m} />
              ))}
            </div>
          </div>
        </div>
      </OgFrame>
    ),
    size
  );
}
