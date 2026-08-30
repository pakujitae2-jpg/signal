import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import FxConverter from "@/components/FxConverter";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { fmtTime } from "@/lib/format";
import { CURRENCIES, FX_PAIRS, getFxRate, parseSlug, type FxRate } from "@/lib/fx";

export const dynamic = "force-dynamic";

const AMOUNTS = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];

function fmtRate(v: number): string {
  if (!isFinite(v)) return "—";
  const digits = Math.abs(v) >= 100 ? 2 : Math.abs(v) >= 1 ? 4 : 6;
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: digits });
}

type Props = { params: Promise<{ pair: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parseSlug(pair);
  if (!parsed) return { title: "Signal" };
  const { base, quote } = parsed;
  const fx = await getFxRate(base, quote, "1mo");
  const title = `${base} to ${quote} Exchange Rate`;
  const description = `1 ${CURRENCIES[base].name} = ${fmtRate(fx.rate)} ${CURRENCIES[quote].name} right now. Live ${base}/${quote} rate with converter, conversion table and 30-day trend.`;
  const canonical = `/convert/${pair}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", siteName: "Signal", title, description, url: canonical },
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

export default async function ConvertPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parseSlug(pair);
  if (!parsed) notFound();
  const { base, quote } = parsed;
  const b = CURRENCIES[base];
  const q = CURRENCIES[quote];
  const fx = await getFxRate(base, quote, "1mo");
  const dayPct = fx.prevRate ? ((fx.rate - fx.prevRate) / fx.prevRate) * 100 : null;
  const partners = AFFILIATES.filter((p) => p.category === "Money Transfer").slice(0, 3);

  return (
    <div className="paper">
      <header className="subhead">
        <Link className="crumb" href="/">← SIGNAL</Link>
        <span className="subhead-note">Global markets, one page</span>
      </header>

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{b.name} → {q.name}</h1>
          <p className="quote-sub">
            {base}/{quote} · updated {fmtTime(new Date().toISOString())} UTC
          </p>
        </div>
        <div className="quote-price-box">
          <span className="quote-price">
            1 {base} = {fmtRate(fx.rate)} {quote}
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
        <p className="wire-note">Note: sample figures shown — live data connects automatically in production deployments.</p>
      )}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Convert</h2>
          <span className="kicker-note">
            <Link className="statline-link" href={`/convert/${quote.toLowerCase()}-to-${base.toLowerCase()}`}>
              {quote} → {base} ⇄
            </Link>
          </span>
        </div>
        <FxConverter base={base} quote={quote} rate={fx.rate} />
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">30-Day Trend</h2>
          <span className="kicker-note">
            <Link className="statline-link" href={`/quote/${encodeURIComponent(base === "USD" ? `${quote}=X` : quote === "USD" ? `${base}=X` : `${base}${quote}=X`)}`}>
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
              </tr>
            </thead>
            <tbody>
              {AMOUNTS.map((a) => (
                <tr key={a}>
                  <td style={{ textAlign: "left" }}>
                    {b.symbol}{a.toLocaleString("en-US")}
                  </td>
                  <td>
                    {q.symbol}{fmtRate(a * fx.rate)}
                  </td>
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
          <h2 className="kicker-label">About This Rate</h2>
        </div>
        <p>
          This page converts the {b.name} ({base}), used in {b.countries}, into the {q.name} ({quote}), used in {q.countries}.
          The rate shown is the live mid-market rate — the midpoint between global buy and sell prices — refreshed continuously
          during FX trading hours. Banks and transfer services typically add a margin on top of this rate, so the amount you
          receive when exchanging money will usually be slightly less favorable.
        </p>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Popular Conversions</h2>
        </div>
        <div className="pair-grid">
          {FX_PAIRS.map(([pb, pq]) => {
            const slug = `${pb.toLowerCase()}-to-${pq.toLowerCase()}`;
            if (slug === pair) return null;
            return (
              <Link className="pair-link" key={slug} href={`/convert/${slug}`}>
                {pb} → {pq}
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">
          Rates are mid-market, may be delayed, and are provided for information only. © {new Date().getFullYear()} Signal
        </p>
      </footer>
    </div>
  );
}
