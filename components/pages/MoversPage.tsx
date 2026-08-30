import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import LangNav from "@/components/LangNav";
import { moversCopy } from "@/lib/feature-copy";
import { fmtNum, fmtTime } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { getMovers, type Mover } from "@/lib/movers";
import { localName } from "@/lib/names";

const PATH = "/movers";

export function moversMetadata(lang: Lang): Metadata {
  const c = moversCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
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

function Table({
  rows,
  lang,
  cols,
  withSpark,
}: {
  rows: Mover[];
  lang: Lang;
  cols: { name: string; last: string; pct: string };
  withSpark?: boolean;
}) {
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

export async function MoversPage({ lang }: { lang: Lang }) {
  const c = moversCopy(lang);
  const p = prefix(lang);
  const data = await getMovers();
  const cols = { name: c.colName, last: c.colLast, pct: c.colPct };

  const gainers = data.equities.slice(0, 10);
  const losers = data.equities.slice(-10).reverse();
  const heat = [...gainers.slice(0, 6), ...losers.slice(0, 6)];

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.h1}</h1>
          <p className="quote-sub">{c.sub} · {fmtTime(data.updatedAt)} UTC</p>
        </div>
      </div>

      {data.source === "unavailable" ? (
        <p className="wire-note">{c.unavailable}</p>
      ) : (
        <>
          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.heatmapHeading}</h2>
            </div>
            <div className="pair-grid">
              {heat.map((m) => (
                <Link
                  className={`pair-link ${m.changePct > 0.005 ? "heat-up" : m.changePct < -0.005 ? "heat-down" : ""}`}
                  key={m.symbol}
                  href={`${p}/quote/${encodeURIComponent(m.symbol)}`}
                >
                  {localName(lang, m.symbol, m.name)} {m.changePct > 0 ? "+" : "−"}
                  {Math.abs(m.changePct).toFixed(2)}%
                </Link>
              ))}
            </div>
          </section>

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

          <AdSlot slot="0000000009" format="leaderboard" />

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.cryptoHeading}</h2>
            </div>
            <Table rows={data.crypto.slice(0, 20)} lang={lang} cols={cols} />
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
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
