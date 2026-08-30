import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import FxConverter from "@/components/FxConverter";
import JsonLd from "@/components/JsonLd";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { fmtTime } from "@/lib/format";
import {
  AMOUNTS,
  CURRENCIES,
  CURRENCY_CODES,
  MAJOR,
  amountSlug,
  fxSymbol,
  getFxRate,
  pairSlug,
  parseSlug,
  type FxRate,
} from "@/lib/fx";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

function fmtRate(v: number): string {
  if (!isFinite(v)) return "—";
  const digits = Math.abs(v) >= 100 ? 2 : Math.abs(v) >= 1 ? 4 : 6;
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: digits });
}

function fmtAmount(v: number): string {
  if (!isFinite(v)) return "—";
  const digits = Math.abs(v) >= 1000 ? 2 : Math.abs(v) >= 1 ? 4 : 6;
  return v.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function fmtInput(v: number): string {
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

type Props = { params: Promise<{ pair: string }> };

const isHub = (slug: string) => /^[a-z]{3}$/.test(slug) && !!CURRENCIES[slug.toUpperCase()];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  if (isHub(pair)) {
    const cur = CURRENCIES[pair.toUpperCase()];
    const title = `${cur.name} (${cur.code}) Exchange Rates`;
    const description = `Live ${cur.name} exchange rates against ${CURRENCY_CODES.length - 1} currencies, with converters, conversion tables and 30-day trends.`;
    const canonical = `/convert/${pair}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
      twitter: { card: "summary_large_image", title, description },
    };
  }
  const parsed = parseSlug(pair);
  if (!parsed) return { title: "PNL404" };
  const { base, quote, amount } = parsed;
  const b = CURRENCIES[base];
  const q = CURRENCIES[quote];
  const fx = await getFxRate(base, quote, "1mo");
  const canonical = `/convert/${pair}`;
  const title =
    amount === null
      ? `${base} to ${quote} Exchange Rate — 1 ${base} = ${fmtRate(fx.rate)} ${quote}`
      : `${fmtInput(amount)} ${base} to ${quote} — ${fmtInput(amount)} ${b.plural} in ${q.plural}`;
  const description =
    amount === null
      ? `1 ${b.name} = ${fmtRate(fx.rate)} ${q.plural} right now. Live ${base}/${quote} rate with converter, conversion table and 30-day trend.`
      : `${fmtInput(amount)} ${b.plural} = ${fmtAmount(amount * fx.rate)} ${q.plural} at today's rate (1 ${base} = ${fmtRate(fx.rate)} ${quote}). Live converter, conversion table and 30-day trend.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

function TrendChart({ fx }: { fx: FxRate }) {
  const values = fx.points.map((p) => p.c);
  if (values.length < 2) return null;
  const w = 720;
  const h = 180;
  const pad = 6;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || min * 0.001 || 1;
  const pts = values
    .map((v, i) => `${(pad + (i / (values.length - 1)) * (w - pad * 2)).toFixed(1)},${(pad + (1 - (v - min) / range) * (h - pad * 2 - 16)).toFixed(1)}`)
    .join(" ");
  const up = values[values.length - 1] >= values[0];
  return (
    <div className="chart-wrap">
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${fx.base}/${fx.quote} 30-day trend`}>
        <polyline points={pts} fill="none" stroke={up ? "var(--up)" : "var(--down)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x={2} y={h - 4} className="axis-label">30 days ago</text>
        <text x={w - 2} y={h - 4} className="axis-label" textAnchor="end">today</text>
        <text x={w - 2} y={12} className="axis-label" textAnchor="end">high {fmtRate(max)} · low {fmtRate(min)}</text>
      </svg>
    </div>
  );
}

function Header() {
  return (
    <header className="subhead">
      <Link className="crumb" href="/">← PNL404</Link>
      <span className="subhead-note">
        <Link className="crumb" href="/convert">Currencies</Link>
      </span>
    </header>
  );
}

function Footer({ note }: { note: string }) {
  return (
    <footer className="colophon">
      <p className="fine">{note} © {new Date().getFullYear()} PNL404</p>
    </footer>
  );
}

/** /convert/usd — one currency against every other. */
function CurrencyHub({ code }: { code: string }) {
  const cur = CURRENCIES[code];
  const others = CURRENCY_CODES.filter((c) => c !== code);
  const majors = MAJOR.filter((c) => c !== code);
  return (
    <div className="paper">
      <Header />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Currencies", item: `${SITE_URL}/convert` },
            { "@type": "ListItem", position: 3, name: `${cur.name} (${code})`, item: `${SITE_URL}/convert/${code.toLowerCase()}` },
          ],
        }}
      />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{cur.name} ({code})</h1>
          <p className="quote-sub">{cur.symbol} · used in {cur.countries}</p>
        </div>
      </div>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{code} to Other Currencies</h2>
        </div>
        <div className="pair-grid">
          {others.map((q) => (
            <Link className="pair-link" key={q} href={`/convert/${pairSlug(code, q)}`}>
              {code} → {q}
            </Link>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Other Currencies to {code}</h2>
        </div>
        <div className="pair-grid">
          {others.map((b) => (
            <Link className="pair-link" key={b} href={`/convert/${pairSlug(b, code)}`}>
              {b} → {code}
            </Link>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Popular Amounts</h2>
        </div>
        <div className="pair-grid">
          {majors.slice(0, 6).flatMap((q) =>
            [1, 100, 1000].map((a) => (
              <Link className="pair-link" key={`${a}-${q}`} href={`/convert/${amountSlug(a, code, q)}`}>
                {a.toLocaleString("en-US")} {code} to {q}
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">About the {cur.name}</h2>
        </div>
        <p>
          The {cur.name} ({code}, {cur.symbol}) is the currency of {cur.countries}. Every page linked above shows the live
          mid-market rate — the midpoint between global buy and sell prices — along with a two-way converter, a conversion
          table for common amounts and a 30-day trend.
        </p>
      </section>

      <Footer note="Rates are mid-market, may be delayed, and are provided for information only." />
    </div>
  );
}

export default async function ConvertPage({ params }: Props) {
  const { pair } = await params;
  if (isHub(pair)) return <CurrencyHub code={pair.toUpperCase()} />;

  const parsed = parseSlug(pair);
  if (!parsed) notFound();
  const { base, quote, amount } = parsed;
  const b = CURRENCIES[base];
  const q = CURRENCIES[quote];
  const fx = await getFxRate(base, quote, "1mo");
  const amt = amount ?? 1;
  const result = amt * fx.rate;
  const dayPct = fx.prevRate ? ((fx.rate - fx.prevRate) / fx.prevRate) * 100 : null;
  const first = fx.points[0];
  const monthPct = first ? ((fx.rate - first.c) / first.c) * 100 : null;
  const partners = AFFILIATES.filter((p) => p.category === "Money Transfer").slice(0, 3);
  const pageUrl = `${SITE_URL}/convert/${pair}`;
  const pairUrl = `${SITE_URL}/convert/${pairSlug(base, quote)}`;
  const majorsQuote = MAJOR.includes(quote);
  const majorsBase = MAJOR.includes(base);

  const crumbs = [
    { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Currencies", item: `${SITE_URL}/convert` },
    { "@type": "ListItem", position: 3, name: `${base} to ${quote}`, item: pairUrl },
    ...(amount !== null ? [{ "@type": "ListItem", position: 4, name: `${fmtInput(amount)} ${base} to ${quote}`, item: pageUrl }] : []),
  ];

  return (
    <div className="paper">
      <Header />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ExchangeRateSpecification",
          currency: base,
          currentExchangeRate: { "@type": "UnitPriceSpecification", price: Number(fx.rate.toPrecision(8)), priceCurrency: quote },
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">
            {amount === null ? `${b.name} → ${q.name}` : `${fmtInput(amount)} ${b.plural} to ${q.name}`}
          </h1>
          <p className="quote-sub">
            {base}/{quote} · updated {fmtTime(new Date().toISOString())} UTC
          </p>
        </div>
        <div className="quote-price-box">
          <span className="quote-price">
            {fmtInput(amt)} {base} = {amount === null ? fmtRate(result) : fmtAmount(result)} {quote}
          </span>
          {dayPct !== null && (
            <span className="quote-chg">
              <span className={`chg ${dayPct > 0.005 ? "up" : dayPct < -0.005 ? "down" : "flat"}`}>
                {dayPct > 0.005 ? "▲" : dayPct < -0.005 ? "▼" : "–"} {Math.abs(dayPct).toFixed(2)}% today
              </span>
            </span>
          )}
        </div>
      </div>

      {fx.source === "sample" && (
        <p className="wire-note">Note: sample figures shown — the live rate for this pair is temporarily unavailable.</p>
      )}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Convert</h2>
          <span className="kicker-note">
            <Link className="statline-link" href={`/convert/${amount === null ? pairSlug(quote, base) : amountSlug(amount, quote, base)}`}>
              {quote} → {base} ⇄
            </Link>
          </span>
        </div>
        <FxConverter base={base} quote={quote} rate={fx.rate} initialAmount={amt} />
        <p className="statline">
          1 {base} = <b>{fmtRate(fx.rate)} {quote}</b> · 1 {quote} = <b>{fmtRate(1 / fx.rate)} {base}</b>
        </p>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Popular Amounts</h2>
        </div>
        <div className="pair-grid">
          {AMOUNTS.map((a) => {
            const slug = amountSlug(a, base, quote);
            if (slug === pair) return null;
            return (
              <Link className="pair-link" key={slug} href={`/convert/${slug}`}>
                {a.toLocaleString("en-US")} {base} to {quote}
              </Link>
            );
          })}
          {amount !== null && (
            <Link className="pair-link" href={`/convert/${pairSlug(base, quote)}`}>
              {base} to {quote} rate
            </Link>
          )}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">30-Day Trend</h2>
          <span className="kicker-note">
            <Link className="statline-link" href={`/quote/${encodeURIComponent(fxSymbol(base, quote).symbol)}`}>
              Interactive chart →
            </Link>
          </span>
        </div>
        <TrendChart fx={fx} />
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Conversion Table</h2>
        </div>
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>{b.name} ({base})</th>
                <th>{q.name} ({quote})</th>
                <th style={{ textAlign: "left" }}>{q.name} ({quote})</th>
                <th>{b.name} ({base})</th>
              </tr>
            </thead>
            <tbody>
              {AMOUNTS.map((a) => (
                <tr key={a}>
                  <td style={{ textAlign: "left" }}>
                    <Link className="qlink" href={`/convert/${amountSlug(a, base, quote)}`}>{b.symbol}{a.toLocaleString("en-US")}</Link>
                  </td>
                  <td>{q.symbol}{fmtAmount(a * fx.rate)}</td>
                  <td style={{ textAlign: "left" }}>
                    <Link className="qlink" href={`/convert/${amountSlug(a, quote, base)}`}>{q.symbol}{a.toLocaleString("en-US")}</Link>
                  </td>
                  <td>{b.symbol}{fmtAmount(a / fx.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot slot="0000000006" format="leaderboard" />

      {partners.length > 0 && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">Send Money Abroad</h2>
            <span className="kicker-note">Partner offers</span>
          </div>
          {partners.map((p) => (
            <a className="p-row" key={p.name} href={p.url} target="_blank" rel="noopener noreferrer sponsored">
              <span className="p-main">
                <span className="p-name">{p.name}</span>
                <span className="p-desc">{p.desc}</span>
              </span>
              <span className="p-arrow" aria-hidden="true">→</span>
            </a>
          ))}
          <p className="fineprint">{AFFILIATE_DISCLOSURE}</p>
        </section>
      )}

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{amount === null ? "About This Rate" : `${fmtInput(amount)} ${base} in ${quote}`}</h2>
        </div>
        <p>
          {amount === null ? (
            <>
              One {b.name} currently buys <b>{fmtRate(fx.rate)} {q.plural}</b>; one {q.name} is worth{" "}
              <b>{fmtRate(1 / fx.rate)} {b.plural}</b>.
            </>
          ) : (
            <>
              {fmtInput(amount)} {b.plural} converts to <b>{fmtAmount(result)} {q.plural}</b> at the current mid-market rate of{" "}
              {fmtRate(fx.rate)} {quote} per {base}. Going the other way, {fmtInput(amount)} {q.plural} is worth{" "}
              <b>{fmtAmount(amount / fx.rate)} {b.plural}</b>.
            </>
          )}
          {dayPct !== null && (
            <>
              {" "}The rate is {dayPct > 0.005 ? "up" : dayPct < -0.005 ? "down" : "flat"} {Math.abs(dayPct).toFixed(2)}% against the previous close
            </>
          )}
          {monthPct !== null && first && (
            <>
              {dayPct !== null ? " and " : " The rate is "}
              {monthPct > 0.005 ? "up" : monthPct < -0.005 ? "down" : "unchanged"} {Math.abs(monthPct).toFixed(2)}% over the past 30 days,
              when 1 {base} bought {fmtRate(first.c)} {quote}
            </>
          )}
          .
        </p>
        <p>
          This page converts the {b.name} ({base}), used in {b.countries}, into the {q.name} ({quote}), used in {q.countries}.
          The rate shown is the live mid-market rate — the midpoint between global buy and sell prices — refreshed continuously
          during FX trading hours. Banks and transfer services typically add a margin on top of this rate, so the amount you
          receive when exchanging money will usually be slightly less favorable.
        </p>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{base} to Other Currencies</h2>
          <span className="kicker-note">
            <Link className="statline-link" href={`/convert/${base.toLowerCase()}`}>All {base} rates →</Link>
          </span>
        </div>
        <div className="pair-grid">
          {(majorsBase ? CURRENCY_CODES : MAJOR).filter((c) => c !== base && c !== quote).map((c) => (
            <Link className="pair-link" key={c} href={`/convert/${pairSlug(base, c)}`}>
              {base} → {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Other Currencies to {quote}</h2>
          <span className="kicker-note">
            <Link className="statline-link" href={`/convert/${quote.toLowerCase()}`}>All {quote} rates →</Link>
          </span>
        </div>
        <div className="pair-grid">
          {(majorsQuote ? CURRENCY_CODES : MAJOR).filter((c) => c !== base && c !== quote).map((c) => (
            <Link className="pair-link" key={c} href={`/convert/${pairSlug(c, quote)}`}>
              {c} → {quote}
            </Link>
          ))}
        </div>
      </section>

      <Footer note="Rates are mid-market, may be delayed, and are provided for information only." />
    </div>
  );
}
