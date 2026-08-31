import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import QuoteView from "@/components/QuoteView";
import { dividendsFor } from "@/lib/dividends";
import { fmtNum } from "@/lib/format";
import { LANGS, LANG_LABEL, languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { LOCAL_NAMES } from "@/lib/names.generated";
import { getQuoteDetail, isValidSymbol, type QuoteDetail } from "@/lib/quote";
import { QUOTE_COPY, type Dir } from "@/lib/quote-copy";
import { SITE_URL } from "@/lib/site";
import { byGroup, universeEntry, type UniverseGroup } from "@/lib/universe";

// One template renders /quote/[symbol] in every locale.

// JPX unified all domestic equity trading units to 100 shares on 2018-10-01
// (https://www.jpx.co.jp/equities/improvements/trading-unit/); a sourced
// constant, not a fetched field — data_j.xls carries no 単元株数 column.
const JP_UNIT_SHARE = 100;

export function displaySymbol(symbol: string): string {
  return symbol.replace(/^\^/, "").replace(/\.(KS|KQ|T|SS)$/, "").replace(/-USD$/i, "").replace(/=[XF]$/, "");
}

export function groupOf(symbol: string): UniverseGroup {
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

const dirOf = (v: number): Dir => (v > 0.005 ? "up" : v < -0.005 ? "down" : "flat");

/** Where this symbol's group hub lives. Market hubs exist in every locale. */
const MARKET_HUB: Partial<Record<UniverseGroup, string>> = {
  "us-stock": "/markets/us",
  "jp-stock": "/markets/japan",
  "kr-stock": "/markets/korea",
  crypto: "/markets/crypto",
};

function hubHref(lang: Lang, group: UniverseGroup): string {
  const p = prefix(lang);
  if (group === "fx") return `${p}/convert`;
  const hub = MARKET_HUB[group];
  return hub ? `${p}${hub}` : `${p}/quotes#${group}`;
}

function nameOf(lang: Lang, symbol: string, detail: QuoteDetail | null): string {
  const fallback = universeEntry(symbol)?.name ?? detail?.name ?? symbol;
  return localName(lang, symbol, fallback);
}

export async function quoteMetadata(lang: Lang, raw: string): Promise<Metadata> {
  const symbol = decodeURIComponent(raw);
  if (!isValidSymbol(symbol) || !universeEntry(symbol)) return { title: "PNL404" };
  const c = QUOTE_COPY[lang];
  const detail = await getQuoteDetail(symbol, "1d");
  const group = groupOf(symbol);
  const name = nameOf(lang, symbol, detail);
  const sym = displaySymbol(symbol);
  const p = pct(detail);
  const priced =
    detail && detail.price !== null && detail.source === "live"
      ? c.priceSentence(name, fmtNum(detail.price, currencyFor(group, detail.currency)), p === null ? "flat" : dirOf(p), Math.abs(p ?? 0).toFixed(2))
      : "";
  const title = c.title(group, name, sym);
  const description = c.description(group, name, sym, priced);
  const path = `/quote/${encodeURIComponent(symbol)}`;
  return {
    title,
    description,
    alternates: { canonical: `${prefix(lang)}${path}`, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: `${prefix(lang)}${path}` },
    twitter: { card: "summary_large_image", title, description },
    // Known symbol, but the upstream fetch failed — an unbounded soft-404
    // family otherwise dilutes crawl budget across the whole sitemap.
    ...(detail === null ? { robots: { index: false, follow: true } } : {}),
  };
}

function About({ lang, detail, group, name, sym }: { lang: Lang; detail: QuoteDetail; group: UniverseGroup; name: string; sym: string }) {
  const c = QUOTE_COPY[lang];
  const p = pct(detail);
  const cur = currencyFor(group, detail.currency);
  const live = detail.source === "live" && detail.price !== null;
  const lead = live
    ? c.aboutLead(group, name, sym, fmtNum(detail.price, cur), detail.exchange) +
      (p !== null ? c.aboutMove(dirOf(p), Math.abs(p).toFixed(2), fmtNum(detail.prevClose, cur)) : "") +
      (detail.fiftyTwoWeekLow !== null && detail.fiftyTwoWeekHigh !== null
        ? c.aboutRange52(fmtNum(detail.fiftyTwoWeekLow, cur), fmtNum(detail.fiftyTwoWeekHigh, cur))
        : "")
    : c.aboutQuoted(name, sym, detail.currency, detail.exchange);
  return (
    <section className="block prose">
      <div className="kicker">
        <h2 className="kicker-label">{c.aboutHeading(name)}</h2>
      </div>
      <p>{lead}</p>
      <p>{c.aboutWhat[group](name)}</p>
      {group === "jp-stock" && live && (
        <div className="board" style={{ marginTop: 12 }}>
          <div className="board-cell">
            <span className="b-name">{c.unitShareLabel}</span>
            <span className="b-value stat-value">{JP_UNIT_SHARE}</span>
          </div>
          <div className="board-cell">
            <span className="b-name">{c.minPurchaseLabel}</span>
            <span className="b-value stat-value">{fmtNum(detail.price! * JP_UNIT_SHARE, cur)}</span>
          </div>
        </div>
      )}
      {group === "jp-stock" && live && <p className="fineprint">{c.unitShareNote.replace("{N}", String(JP_UNIT_SHARE))}</p>}
    </section>
  );
}

function Related({ lang, symbol, group }: { lang: Lang; symbol: string; group: UniverseGroup }) {
  const c = QUOTE_COPY[lang];
  const peers = byGroup(group).filter((e) => e.symbol !== symbol).slice(0, 30);
  if (peers.length === 0) return null;
  const p = prefix(lang);
  return (
    <section className="block">
      <div className="kicker">
        <h2 className="kicker-label">{c.moreHeading(c.groupLabel[group])}</h2>
        <span className="kicker-note">
          <Link className="statline-link" href={hubHref(lang, group)}>{c.hubLink(c.hubLabel[group])}</Link>
        </span>
      </div>
      <div className="pair-grid">
        {peers.map((e) => (
          <Link className="pair-link" key={e.symbol} href={`${p}/quote/${encodeURIComponent(e.symbol)}`}>
            {localName(lang, e.symbol, e.name)}
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function QuotePage({ lang, symbol: raw }: { lang: Lang; symbol: string }) {
  const symbol = decodeURIComponent(raw);
  if (!isValidSymbol(symbol) || !universeEntry(symbol)) notFound();
  const c = QUOTE_COPY[lang];
  const p = prefix(lang);
  const initial = await getQuoteDetail(symbol, "1d");
  const group = groupOf(symbol);
  const name = nameOf(lang, symbol, initial);
  const sym = displaySymbol(symbol);
  const path = `/quote/${encodeURIComponent(symbol)}`;
  const pageUrl = `${SITE_URL}${p}${path}`;
  const entry = universeEntry(symbol);
  const isCrypto = symbol.toUpperCase().endsWith("-USD");

  return (
    <div className="paper">
      <header className="subhead">
        <span>
          <Link className="crumb" href={`${p}/`}>← PNL404</Link>
          {" · "}
          <Link className="crumb" href={hubHref(lang, group)}>{c.hubLabel[group]}</Link>
        </span>
        <span className="subhead-note">
          {LANGS.map((l, i) => (
            <span key={l}>
              {i > 0 && " · "}
              {l === lang ? <b>{LANG_LABEL[l]}</b> : <Link className="crumb" href={`${prefix(l)}${path}`} hrefLang={l}>{LANG_LABEL[l]}</Link>}
            </span>
          ))}
        </span>
      </header>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.hubLabel[group], item: `${SITE_URL}${hubHref(lang, group).replace(/#.*$/, "")}` },
            { "@type": "ListItem", position: 3, name: `${name} (${sym})`, item: pageUrl },
          ],
        }}
      />
      {(group === "us-stock" || group === "jp-stock" || group === "kr-stock") && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Corporation",
            name,
            tickerSymbol: sym,
            url: pageUrl,
            ...(() => {
              const alt = [entry?.name, ...(LOCAL_NAMES[symbol] ?? [])].filter((n): n is string => Boolean(n) && n !== name);
              return alt.length > 0 ? { alternateName: [...new Set(alt)] } : {};
            })(),
          }}
        />
      )}

      {initial ? (
        <>
          <QuoteView symbol={symbol} initial={{ ...initial, name }} t={c.labels(isCrypto)} />
          <About lang={lang} detail={initial} group={group} name={name} sym={sym} />
          {group === "fx" && entry && /^[A-Z]{3}\/[A-Z]{3}$/.test(entry.name) && (
            <p className="statline">
              <Link className="statline-link" href={`${p}/convert/${entry.name.slice(0, 3).toLowerCase()}-to-${entry.name.slice(4).toLowerCase()}`}>
                {c.converterLink(name)}
              </Link>
            </p>
          )}
          {dividendsFor(symbol.toUpperCase()) && (
            <p className="statline">
              <Link className="statline-link" href={`${p}/quote/${encodeURIComponent(symbol)}/dividends`}>
                {c.dividendsLink(name)}
              </Link>
            </p>
          )}
          <p className="statline">
            <Link className="statline-link" href={`${p}/quote/${encodeURIComponent(symbol)}/technicals`}>
              {c.technicalsLink(name)}
            </Link>
          </p>
          <p className="statline">
            <Link className="statline-link" href={`${p}/quote/${encodeURIComponent(symbol)}/seasonality`}>
              {c.seasonalityLink(name)}
            </Link>
          </p>
          <p className="statline">
            <Link className="statline-link" href={`${p}/dca/${encodeURIComponent(symbol)}`}>
              {c.dcaLink(name)}
            </Link>
          </p>
          <p className="statline">
            <Link className="statline-link" href={`${p}/tools/average?symbol=${encodeURIComponent(symbol)}`}>
              {c.averageLink(name)}
            </Link>
          </p>
          <Related lang={lang} symbol={symbol} group={group} />
        </>
      ) : (
        <div className="unavailable">
          <p className="wire-note">{c.unavailable(sym)}</p>
          <p>
            <Link className="crumb" href={`${p}/`}>{c.backHome}</Link>
          </p>
        </div>
      )}

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
