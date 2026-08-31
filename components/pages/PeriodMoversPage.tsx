import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import LangNav from "@/components/LangNav";
import { fill, moversCopy } from "@/lib/feature-copy";
import { fmtNum, fmtTime } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { MOVERS_PERIODS, getPeriodMovers, isMoversPeriod, type PeriodMover } from "@/lib/movers-period";
import { localName } from "@/lib/names";

const PATH = (period: string) => `/movers/${period}`;

export async function periodMoversMetadata(lang: Lang, period: string): Promise<Metadata> {
  if (!isMoversPeriod(period)) return { title: "PNL404" };
  const c = moversCopy(lang);
  const label = c.periodLabels[period];
  const title = fill(c.periodH1, { PERIOD: label });
  const description = fill(c.periodDescription, { PERIOD: label });
  const path = PATH(period);
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

function Pct({ v }: { v: number }) {
  const dir = v > 0.005 ? "up" : v < -0.005 ? "down" : "flat";
  return (
    <span className={`chg ${dir}`}>
      {dir === "up" ? "▲" : dir === "down" ? "▼" : "–"} {Math.abs(v).toFixed(2)}%
    </span>
  );
}

function Sparkline({ data, pct }: { data: number[]; pct: number }) {
  if (!data || data.length < 2) return null;
  const w = 64;
  const h = 22;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(2 + (i / (data.length - 1)) * (w - 4)).toFixed(1)},${(2 + (1 - (v - min) / range) * (h - 4)).toFixed(1)}`)
    .join(" ");
  const color = Math.abs(pct) <= 0.005 ? "var(--flat)" : pct > 0 ? "var(--up)" : "var(--down)";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Table({ rows, lang, cols, withSpark }: { rows: PeriodMover[]; lang: Lang; cols: { name: string; last: string; pct: string }; withSpark?: boolean }) {
  const p = prefix(lang);
  return (
    <div className="table-scroll">
      <table className="mkt">
        <thead>
          <tr>
            <th>{cols.name}</th>
            <th>{cols.last}</th>
            <th>{cols.pct}</th>
            {withSpark && <th />}
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.symbol}>
              <td>
                <Link className="qlink" href={`${p}/quote/${encodeURIComponent(m.symbol)}`}>
                  <span className="cell-name">{localName(lang, m.symbol, m.name)}</span>
                  <span className="sym">{m.symbol.replace(/\.(KS|KQ|T)$/, "").replace(/-USD$/, "")}</span>
                </Link>
              </td>
              <td>{fmtNum(m.price, m.group === "crypto" ? "USD" : undefined)}</td>
              <td>
                <Pct v={m.changePct} />
              </td>
              {withSpark && (
                <td>
                  <Sparkline data={m.spark} pct={m.changePct} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function PeriodMoversPage({ lang, period }: { lang: Lang; period: string }) {
  if (!isMoversPeriod(period)) notFound();
  const c = moversCopy(lang);
  const p = prefix(lang);
  const path = PATH(period);
  const label = c.periodLabels[period];
  const data = await getPeriodMovers(period);
  const cols = { name: c.colName, last: c.colLast, pct: c.colPct };

  const gainers = data.equities.slice(0, 15);
  const losers = data.equities.slice(-15).reverse();
  const cryptoGainers = data.crypto.slice(0, 10);
  const cryptoLosers = data.crypto.slice(-10).reverse();

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}/movers`, label: c.h1 }} />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{fill(c.periodH1, { PERIOD: label })}</h1>
          <p className="quote-sub">
            {fill(c.periodDescription, { PERIOD: label })} · {fmtTime(data.updatedAt)} UTC
          </p>
        </div>
      </div>

      <section className="block">
        <div className="kicker">
          <div className="range-row" role="tablist" aria-label={c.periodNavHeading}>
            {MOVERS_PERIODS.map((per) => (
              <Link key={per} href={`${p}${PATH(per)}`} role="tab" aria-selected={per === period} className={`range-btn${per === period ? " active" : ""}`}>
                {c.periodLabels[per]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {data.source === "unavailable" ? (
        <p className="wire-note">{c.unavailable}</p>
      ) : (
        <>
          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.gainersHeading}</h2>
            </div>
            <Table rows={gainers} lang={lang} cols={cols} withSpark />
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.losersHeading}</h2>
            </div>
            <Table rows={losers} lang={lang} cols={cols} withSpark />
          </section>

          <AdSlot slot="0000000025" format="leaderboard" />

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">
                {c.cryptoHeading} · {c.gainersHeading}
              </h2>
            </div>
            <Table rows={cryptoGainers} lang={lang} cols={cols} />
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">
                {c.cryptoHeading} · {c.losersHeading}
              </h2>
            </div>
            <Table rows={cryptoLosers} lang={lang} cols={cols} />
          </section>
        </>
      )}

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP}</p>
      </section>

      <footer className="colophon">
        <p className="fine">
          {c.footer} © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
