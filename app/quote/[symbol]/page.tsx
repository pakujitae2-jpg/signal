import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QuoteView from "@/components/QuoteView";
import { getQuoteDetail, isValidSymbol } from "@/lib/quote";

export const dynamic = "force-dynamic";

function displaySymbol(symbol: string): string {
  return symbol.replace(/^\^/, "").replace(/\.(KS|T)$/, "");
}

type Props = { params: Promise<{ symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol: raw } = await params;
  const symbol = decodeURIComponent(raw);
  if (!isValidSymbol(symbol)) return { title: "Signal" };
  const detail = await getQuoteDetail(symbol, "1d");
  const name = detail?.name ?? symbol;
  const sym = displaySymbol(symbol);
  const isCrypto = symbol.toUpperCase().endsWith("-USD");
  const title = isCrypto ? `${name} (${sym.replace(/-USD$/i, "")}) Price & Live Chart` : `${name} (${sym}) Stock Price & Live Chart`;
  const description = `${name} live price, interactive chart, daily change and key stats — updated continuously on Signal, global markets on one page.`;
  const canonical = `/quote/${encodeURIComponent(symbol)}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", siteName: "Signal", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function QuotePage({ params }: Props) {
  const { symbol: raw } = await params;
  const symbol = decodeURIComponent(raw);
  if (!isValidSymbol(symbol)) notFound();
  const initial = await getQuoteDetail(symbol, "1d");

  return (
    <div className="paper">
      <header className="subhead">
        <Link className="crumb" href="/">
          ← SIGNAL
        </Link>
        <span className="subhead-note">Global markets, one page</span>
      </header>

      {initial ? (
        <QuoteView symbol={symbol} initial={initial} />
      ) : (
        <div className="unavailable">
          <p className="wire-note">
            No data is available for “{displaySymbol(symbol)}” right now. The symbol may be unknown, or the data
            provider may be unreachable.
          </p>
          <p>
            <Link className="crumb" href="/">
              ← Back to the front page
            </Link>
          </p>
        </div>
      )}

      <footer className="colophon">
        <p className="fine">
          Market data may be delayed and is provided for information only, not investment advice. © {new Date().getFullYear()} Signal
        </p>
      </footer>
    </div>
  );
}
