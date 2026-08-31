import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE } from "@/components/OgCard";
import { getCryptoFxRate } from "@/lib/crypto-fx";
import { CURRENCIES, MAJOR, getFxRate, isCryptoCode, parseSlug } from "@/lib/fx";
import { fxTable } from "@/lib/fx-history";
import { curName } from "@/lib/i18n";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Currency converter";

function Fallback({ text }: { text: string }) {
  return new ImageResponse(<OgFrame asOf="" tagline="Currency converter">{text}</OgFrame>, size);
}

const isHubCode = (s: string) => /^[a-z]{3}$/.test(s) && Boolean(CURRENCIES[s.toUpperCase()]);

export default async function OgImage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;

  if (isHubCode(pair)) {
    const code = pair.toUpperCase();
    const table = await fxTable(code);
    const top = (table ?? []).filter((r) => MAJOR.includes(r.code)).slice(0, 4);
    return new ImageResponse(
      (
        <OgFrame asOf="Live" tagline={`${curName("en", code)} exchange rates`}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 48, fontWeight: 700, marginBottom: 30 }}>
              {curName("en", code)} ({code})
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
  if (!parsed) return Fallback({ text: "PNL404" });
  const { base, quote, amount } = parsed;
  const amt = amount ?? 1;

  if (isCryptoCode(base) || isCryptoCode(quote)) {
    const fx = await getCryptoFxRate(base, quote);
    if (!fx) return Fallback({ text: `${base} / ${quote}` });
    return new ImageResponse(
      (
        <OgFrame asOf="Live" tagline={fx.method === "upbit-krw" ? "Upbit market price" : "Cross rate via USD"}>
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
  if (fx.source !== "live") return Fallback({ text: `${base} / ${quote}` });
  const result = amt * fx.rate;

  return new ImageResponse(
    (
      <OgFrame asOf="Live mid-market rate" tagline={`${curName("en", base)} to ${curName("en", quote)}`}>
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
