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
  return {
    title: `${name} (${displaySymbol(symbol)}) Price & Chart · Signal`,
    description: `Live ${name} price, chart and key stats on Signal — global markets on a single page.`,
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
