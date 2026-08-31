import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE, OG_DOWN, OG_MUTED, OG_UP } from "@/components/OgCard";
import { fmtCompactUsd, fmtNum, fmtTime } from "@/lib/format";
import { getMarketData } from "@/lib/market";
import type { Quote } from "@/lib/types";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Markets";

const TITLES: Record<string, string> = { us: "US Markets", japan: "Japan Markets", korea: "Korea Markets", crypto: "Crypto Markets" };

function Row({ q }: { q: Quote }) {
  const up = (q.changePct ?? 0) >= 0;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: 480, fontSize: 28 }}>
      <span style={{ fontWeight: 700 }}>{q.name}</span>
      <span style={{ display: "flex", gap: 16 }}>
        <span>{fmtNum(q.price, undefined)}</span>
        <span style={{ color: q.changePct === null ? OG_MUTED : up ? OG_UP : OG_DOWN, fontWeight: 700 }}>
          {q.changePct === null ? "—" : `${up ? "+" : "−"}${Math.abs(q.changePct).toFixed(2)}%`}
        </span>
      </span>
    </div>
  );
}

export default async function OgImage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  const data = await getMarketData();
  const title = TITLES[region] ?? "Markets";

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
      <OgFrame asOf={`${fmtTime(data.updatedAt)} UTC`} tagline={region === "crypto" ? `Total cap ${fmtCompactUsd(data.cryptoGlobal?.totalMarketCapUsd ?? 0)}` : "Live index board"}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 30 }}>{title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rows.slice(0, 4).map((q) => (
              <Row key={q.symbol} q={q} />
            ))}
          </div>
        </div>
      </OgFrame>
    ),
    size
  );
}
