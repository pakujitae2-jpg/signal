import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import QuoteView from "@/components/QuoteView";
import { fmtNum } from "@/lib/format";
import { getQuoteDetail, isValidSymbol, type QuoteDetail } from "@/lib/quote";
import { SITE_URL } from "@/lib/site";
import { GROUP_LABEL, byGroup, universeEntry, type UniverseGroup } from "@/lib/universe";

export const dynamic = "force-dynamic";

function displaySymbol(symbol: string): string {
  return symbol.replace(/^\^/, "").replace(/\.(KS|KQ|T|SS)$/, "").replace(/-USD$/i, "").replace(/=[XF]$/, "");
}

function groupOf(symbol: string): UniverseGroup {
  const known = universeEntry(symbol)?.group;
  if (known) return known;
  const s = symbol.toUpperCase();
  if (s.startsWith("^")) return "index";
  if (s.endsWith("-USD")) return "crypto";
  if (s.endsWith("=X")) return "fx";
  if (s.endsWith("=F")) return "commodity";
  if (s.endsWith(".T")) return "jp-stock";
  if (s.endsWith(".KS") || s.endsWith(".KQ")) return "kr-stock";
  return "us-stock";
}

// Index levels and yields are unitless; everything else carries its currency.
function currencyFor(group: UniverseGroup, currency: string): string | undefined {
  return group === "index" ? undefined : currency;
}

function pct(detail: QuoteDetail | null): number | null {
  if (!detail || detail.price === null || !detail.prevClose) return null;
  return ((detail.price - detail.prevClose) / detail.prevClose) * 100;
}

function titleFor(group: UniverseGroup, name: string, sym: string): string {
  switch (group) {
    case "crypto":
      return `${name} (${sym}) Price Today, Chart & Market Data`;
    case "index":
      return `${name} Index Today — Live Chart & Level`;
    case "fx":
      return `${name} Exchange Rate — Live Chart`;
    case "commodity":
      return `${name} Price Today — Live Chart`;
    case "etf":
      return `${name} (${sym}) ETF Price, Chart & Stats`;
    default:
      return `${name} (${sym}) Stock Price, Chart & Stats`;
  }
}

type Props = { params: Promise<{ symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol: raw } = await params;
  const symbol = decodeURIComponent(raw);
  if (!isValidSymbol(symbol)) return { title: "PNL404" };
  const detail = await getQuoteDetail(symbol, "1d");
  const entry = universeEntry(symbol);
  const name = entry?.name ?? detail?.name ?? symbol;
  const sym = displaySymbol(symbol);
  const group = groupOf(symbol);
  const title = titleFor(group, name, sym);
  const p = pct(detail);
  const priceBit =
    detail && detail.price !== null && detail.source === "live"
      ? `${name} is at ${fmtNum(detail.price, currencyFor(group, detail.currency))}${p !== null ? `, ${p >= 0 ? "up" : "down"} ${Math.abs(p).toFixed(2)}% today` : ""}. `
      : "";
  const isStock = group === "us-stock" || group === "etf" || group === "jp-stock" || group === "kr-stock";
  const description = `${priceBit}Live ${isStock ? sym : name} ${group === "index" ? "level" : group === "fx" ? "rate" : "price"} and interactive chart (1D to 1Y), previous close, day change and 52-week range on PNL404 — global markets, one page.`;
  const canonical = `/quote/${encodeURIComponent(symbol)}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

const GROUP_HUB: Record<UniverseGroup, { href: string; label: string }> = {
  index: { href: "/quotes#index", label: "Indices" },
  "us-stock": { href: "/markets/us", label: "U.S. Markets" },
  etf: { href: "/quotes#etf", label: "ETFs" },
  "jp-stock": { href: "/markets/japan", label: "Japan Markets" },
  "kr-stock": { href: "/markets/korea", label: "Korea Markets" },
  crypto: { href: "/markets/crypto", label: "Crypto Markets" },
  fx: { href: "/convert", label: "Currencies" },
  commodity: { href: "/quotes#commodity", label: "Commodities" },
};

function About({ detail, group, name, sym }: { detail: QuoteDetail; group: UniverseGroup; name: string; sym: string }) {
  const p = pct(detail);
  const live = detail.source === "live" && detail.price !== null;
  const cur = currencyFor(group, detail.currency);
  const where = detail.exchange ? ` on ${detail.exchange}` : "";
  const move =
    live && p !== null
      ? ` It is ${p > 0.005 ? "up" : p < -0.005 ? "down" : "flat"} ${Math.abs(p).toFixed(2)}% from the previous close of ${fmtNum(detail.prevClose, cur)}.`
      : "";
  const range52 =
    detail.fiftyTwoWeekLow !== null && detail.fiftyTwoWeekHigh !== null
      ? ` Over the past 52 weeks it has ranged between ${fmtNum(detail.fiftyTwoWeekLow, cur)} and ${fmtNum(detail.fiftyTwoWeekHigh, cur)}.`
      : "";
  const lead = live
    ? `${name} (${sym}) ${group === "index" ? "stands at" : "last traded at"} ${fmtNum(detail.price, cur)}${where}.${move}${range52}`
    : `${name} (${sym}) is quoted in ${detail.currency}${where}.`;
  const what: Record<UniverseGroup, string> = {
    index: `${name} is a market index, so the level shown is a weighted average of its constituents rather than something you buy directly; index funds and ETFs track it.`,
    "us-stock": `${name} is listed in the United States. The regular session runs 9:30 a.m. to 4:00 p.m. Eastern Time; the chart above covers regular hours, with extended-hours trades excluded.`,
    etf: `${name} is an exchange-traded fund, priced continuously during US market hours like a stock while holding a basket of underlying assets.`,
    "jp-stock": `${name} trades on the Tokyo Stock Exchange in Japanese yen. The session runs 9:00 to 11:30 a.m. and 12:30 to 3:30 p.m. Japan Standard Time.`,
    "kr-stock": `${name} trades on the Korea Exchange in Korean won, 9:00 a.m. to 3:30 p.m. Korea Standard Time.`,
    crypto: `${name} trades around the clock, so the daily change is measured against the price 24 hours ago rather than a session close.`,
    fx: `This is the mid-market rate for ${name} — the midpoint between global buy and sell prices, refreshed continuously during FX trading hours. Banks and transfer services add a margin on top of it.`,
    commodity: `${name} is quoted from the front-month futures contract, the benchmark most news reports refer to when they cite the "${name.toLowerCase()} price".`,
  };
  return (
    <section className="block prose">
      <div className="kicker">
        <h2 className="kicker-label">About {name}</h2>
      </div>
      <p>{lead}</p>
      <p>{what[group]}</p>
    </section>
  );
}

function Related({ symbol, group }: { symbol: string; group: UniverseGroup }) {
  const peers = byGroup(group).filter((e) => e.symbol !== symbol).slice(0, 30);
  if (peers.length === 0) return null;
  const hub = GROUP_HUB[group];
  return (
    <section className="block">
      <div className="kicker">
        <h2 className="kicker-label">More {GROUP_LABEL[group]}</h2>
        <span className="kicker-note">
          <Link className="statline-link" href={hub.href}>{hub.label} →</Link>
        </span>
      </div>
      <div className="pair-grid">
        {peers.map((e) => (
          <Link className="pair-link" key={e.symbol} href={`/quote/${encodeURIComponent(e.symbol)}`}>
            {e.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function QuotePage({ params }: Props) {
  const { symbol: raw } = await params;
  const symbol = decodeURIComponent(raw);
  if (!isValidSymbol(symbol)) notFound();
  const initial = await getQuoteDetail(symbol, "1d");
  const entry = universeEntry(symbol);
  const group = groupOf(symbol);
  const name = entry?.name ?? initial?.name ?? symbol;
  const sym = displaySymbol(symbol);
  const hub = GROUP_HUB[group];
  const pageUrl = `${SITE_URL}/quote/${encodeURIComponent(symbol)}`;

  return (
    <div className="paper">
      <header className="subhead">
        <Link className="crumb" href="/">
          ← PNL404
        </Link>
        <span className="subhead-note">
          <Link className="crumb" href={hub.href}>{hub.label}</Link>
        </span>
      </header>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: hub.label, item: `${SITE_URL}${hub.href.replace(/#.*$/, "")}` },
            { "@type": "ListItem", position: 3, name: `${name} (${sym})`, item: pageUrl },
          ],
        }}
      />
      {(group === "us-stock" || group === "jp-stock" || group === "kr-stock") && (
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Corporation", name, tickerSymbol: sym, url: pageUrl }} />
      )}

      {initial ? (
        <>
          <QuoteView symbol={symbol} initial={initial} />
          <About detail={initial} group={group} name={name} sym={sym} />
          {group === "fx" && entry && /^[A-Z]{3}\/[A-Z]{3}$/.test(entry.name) && (
            <p className="statline">
              <Link className="statline-link" href={`/convert/${entry.name.slice(0, 3).toLowerCase()}-to-${entry.name.slice(4).toLowerCase()}`}>
                {entry.name.replace("/", " to ")} converter →
              </Link>
            </p>
          )}
          <Related symbol={symbol} group={group} />
        </>
      ) : (
        <div className="unavailable">
          <p className="wire-note">
            No data is available for “{sym}” right now. The symbol may be unknown, or the data provider may be unreachable.
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
          Market data may be delayed and is provided for information only, not investment advice. © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
