import type { Metadata } from "next";
import { fmtNum } from "@/lib/format";
import { getTickerQuotes, parseSymbols } from "@/lib/ticker";

// Bare ticker strip for publishers to iframe. No site chrome, no indexing.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // Framed by other sites, so no " · PNL404" suffix from the layout template.
  title: { absolute: "PNL404 ticker" },
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ s?: string }> };

export default async function EmbedPage({ searchParams }: Props) {
  const { s } = await searchParams;
  const symbols = parseSymbols(s);
  const quotes = await getTickerQuotes(symbols);

  return (
    <div className="embed-strip">
      {quotes.map((q) => {
        const dir = q.changePct === null ? "flat" : q.changePct > 0.005 ? "up" : q.changePct < -0.005 ? "down" : "flat";
        return (
          <span className="ticker-item" key={q.symbol}>
            <span className="t-name">{q.name}</span>
            <span>{fmtNum(q.price, q.currency || undefined)}</span>
            <span className={`chg ${dir}`}>
              {dir === "up" ? "▲" : dir === "down" ? "▼" : "–"} {q.changePct === null ? "—" : `${Math.abs(q.changePct).toFixed(2)}%`}
            </span>
          </span>
        );
      })}
      <a className="embed-brand" href="https://pnl404.com" target="_blank" rel="noopener">
        PNL404
      </a>
    </div>
  );
}
