import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE, ogColor } from "@/components/OgCard";
import { fmtTime } from "@/lib/format";
import { getKimchiData } from "@/lib/kimchi";
import { isLang } from "@/lib/i18n";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Kimchi Premium";

const LABELS = {
  ko: { title: "김치프리미엄", sub: "업비트(원화) vs 해외 시세", premium: "비트코인 프리미엄", coins: "개 코인 추적 중", tagline: "한국 암호화폐 가격 차이" },
  ja: { title: "キムチプレミアム", sub: "Upbit(ウォン) vs 海外価格", premium: "ビットコインプレミアム", coins: "銘柄を追跡中", tagline: "韓国の暗号資産価格差" },
};

export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = isLang(rawLang) && rawLang !== "en" ? rawLang : "ko";
  const t = LABELS[lang as "ko" | "ja"];
  const data = await getKimchiData();
  const btc = data.rows.find((r) => r.symbol === "BTC");
  const avg = data.rows.length ? data.rows.reduce((s, r) => s + r.premiumPct, 0) / data.rows.length : 0;
  const pct = btc?.premiumPct ?? avg;
  const color = ogColor(pct);

  return new ImageResponse(
    (
      <OgFrame asOf={`${fmtTime(data.updatedAt)} UTC`} tagline={t.tagline}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 44, fontWeight: 700 }}>{t.title}</div>
          <div style={{ fontSize: 26, color: "#8b877c", marginTop: 10 }}>{t.sub}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 36 }}>
            <div style={{ display: "flex", fontSize: 130, fontWeight: 700, color }}>
              {pct >= 0 ? "+" : "−"}{Math.abs(pct).toFixed(2)}%
            </div>
            <div style={{ fontSize: 30, color: "#8b877c" }}>{t.premium}</div>
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: 30, fontSize: 26, color: "#55524a" }}>
            <span style={{ display: "flex" }}>USD/KRW {data.usdKrw.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
            <span style={{ display: "flex" }}>{data.rows.length}{t.coins}</span>
          </div>
        </div>
      </OgFrame>
    ),
    size
  );
}
