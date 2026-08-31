import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE } from "@/components/OgCard";
import { getCryptoFxRate } from "@/lib/crypto-fx";
import { CURRENCIES, MAJOR, getFxRate, isCryptoCode, parseSlug } from "@/lib/fx";
import { fxTable } from "@/lib/fx-history";
import { curName, isLang, type Lang } from "@/lib/i18n";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Currency converter";

const LABELS = {
  ko: { rates: (n: string) => `${n} 환율`, cross: "업비트 시세", via: "USD 경유 환산", mid: "실시간 기준 환율" },
  ja: { rates: (n: string) => `${n}の為替レート`, cross: "Upbit相場", via: "USD経由の換算", mid: "リアルタイム仲値" },
};

const isHubCode = (s: string) => /^[a-z]{3}$/.test(s) && Boolean(CURRENCIES[s.toUpperCase()]);

export default async function OgImage({ params }: { params: Promise<{ lang: string; pair: string }> }) {
  const { lang: rawLang, pair } = await params;
  const lang = (isLang(rawLang) && rawLang !== "en" ? rawLang : "ko") as "ko" | "ja";
  const t = LABELS[lang];

  if (isHubCode(pair)) {
    const code = pair.toUpperCase();
    const table = await fxTable(code);
    const top = (table ?? []).filter((r) => MAJOR.includes(r.code)).slice(0, 4);
    return new ImageResponse(
      (
        <OgFrame asOf="Live" tagline={t.rates(curName(lang as Lang, code))}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 48, fontWeight: 700, marginBottom: 30 }}>
              {curName(lang as Lang, code)} ({code})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {top.map((r) => (
                <div key={r.code} style={{ display: "flex", justifyContent: "space-between", width: 500, fontSize: 30 }}>
                  <span style={{ display: "flex" }}>{code}/{r.code}</span>
                  <span style={{ fontWeight: 700 }}>{r.rate.toLocaleString("en-US", { maximumFractionDigits: 4 })}</span>
                </div>
              ))}
            </div>
          </div>
        </OgFrame>
      ),
      size
    );
  }

  const parsed = parseSlug(pair);
  if (!parsed) return new ImageResponse(<OgFrame asOf="" tagline="PNL404">{pair}</OgFrame>, size);
  const { base, quote, amount } = parsed;
  const amt = amount ?? 1;

  if (isCryptoCode(base) || isCryptoCode(quote)) {
    const fx = await getCryptoFxRate(base, quote);
    if (!fx) return new ImageResponse(<OgFrame asOf="" tagline="PNL404"><div style={{ display: "flex" }}>{base} / {quote}</div></OgFrame>, size);
    return new ImageResponse(
      (
        <OgFrame asOf="Live" tagline={fx.method === "upbit-krw" ? t.cross : t.via}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 700, marginBottom: 24 }}>{base} → {quote}</div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700 }}>
              {amt.toLocaleString("en-US")} {base} = {(amt * fx.rate).toLocaleString("en-US", { maximumFractionDigits: 2 })} {quote}
            </div>
          </div>
        </OgFrame>
      ),
      size
    );
  }

  const fx = await getFxRate(base, quote, "1d");
  if (fx.source !== "live") return new ImageResponse(<OgFrame asOf="" tagline="PNL404"><div style={{ display: "flex" }}>{base} / {quote}</div></OgFrame>, size);
  const result = amt * fx.rate;

  return new ImageResponse(
    (
      <OgFrame asOf={t.mid} tagline={`${curName(lang as Lang, base)} → ${curName(lang as Lang, quote)}`}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, marginBottom: 24 }}>{base} → {quote}</div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700 }}>
            {amt.toLocaleString("en-US")} {base} = {result.toLocaleString("en-US", { maximumFractionDigits: 2 })} {quote}
          </div>
        </div>
      </OgFrame>
    ),
    size
  );
}
