import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE, OG_DOWN, OG_MUTED, OG_UP } from "@/components/OgCard";
import { parseCompare } from "@/lib/compare";
import { fmtNum } from "@/lib/format";
import { isLang, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { getQuoteDetail } from "@/lib/quote";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Head-to-head comparison";

const LABELS = { ko: { heading: "종목 비교", vs: "vs", tagline: "30일 수익률 비교", period: "· 30일" }, ja: { heading: "銘柄比較", vs: "vs", tagline: "30日間の比較", period: "· 30日" } };

async function side(lang: Lang, symbol: string, name: string) {
  const d = await getQuoteDetail(symbol, "1mo");
  const pct = d && d.price !== null && d.points[0] ? ((d.price - d.points[0].c) / d.points[0].c) * 100 : null;
  return { name: localName(lang, symbol, name), price: d?.price ?? null, currency: d?.currency, pct };
}

export default async function OgImage({ params }: { params: Promise<{ lang: string; pair: string }> }) {
  const { lang: rawLang, pair } = await params;
  const lang = (isLang(rawLang) && rawLang !== "en" ? rawLang : "ko") as "ko" | "ja";
  const t = LABELS[lang];
  const parsed = parseCompare(pair);
  if (!parsed) {
    return new ImageResponse(<OgFrame asOf="" tagline={t.heading}>PNL404</OgFrame>, size);
  }
  const [left, right] = await Promise.all([side(lang, parsed.left.symbol, parsed.left.name), side(lang, parsed.right.symbol, parsed.right.name)]);

  const Side = ({ s }: { s: Awaited<ReturnType<typeof side>> }) => (
    <div style={{ display: "flex", flexDirection: "column", width: 460 }}>
      <div style={{ fontSize: 34, fontWeight: 700 }}>{s.name}</div>
      <div style={{ fontSize: 30, marginTop: 8 }}>{fmtNum(s.price, s.currency)}</div>
      <div style={{ fontSize: 26, marginTop: 6, fontWeight: 700, color: s.pct === null ? OG_MUTED : s.pct >= 0 ? OG_UP : OG_DOWN }}>
        {s.pct === null ? "—" : `${s.pct >= 0 ? "+" : "−"}${Math.abs(s.pct).toFixed(1)}% ${t.period}`}
      </div>
    </div>
  );

  return new ImageResponse(
    (
      <OgFrame asOf="Live" tagline={t.tagline}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#8b877c", letterSpacing: "0.08em", marginBottom: 20 }}>{t.heading}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <Side s={left} />
            <div style={{ fontSize: 44, color: "#8b877c" }}>{t.vs}</div>
            <Side s={right} />
          </div>
        </div>
      </OgFrame>
    ),
    size
  );
}
