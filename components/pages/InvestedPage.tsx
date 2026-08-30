import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import LangNav from "@/components/LangNav";
import { fill, investedCopy } from "@/lib/feature-copy";
import { fmtNum } from "@/lib/format";
import { getHistory } from "@/lib/history";
import { computeInvested, type InvestedResult } from "@/lib/invested-math";
import { languageAlternates, LOCALE_TAG, prefix, type Lang } from "@/lib/i18n";
import {
  DEFAULT_AMOUNT,
  DEFAULT_SYMBOL,
  INVEST_ASSETS,
  INVEST_YEARS,
  assetBySlug,
  parseAmount,
  parseYears,
} from "@/lib/invested";
import { localName } from "@/lib/names";
import { symbolSlug } from "@/lib/slug";

// A plain GET form drives this page, so every result is a shareable URL and
// the calculator works with no client JavaScript at all.

const PATH = "/tools/invested";

export type InvestedParams = { asset?: string; amount?: string; years?: string };

export function investedMetadata(lang: Lang): Metadata {
  const c = investedCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

function ValueChart({ result }: { result: InvestedResult }) {
  const pts = result.path.map((p) => ({ t: p.t, v: (p.c / result.startPrice) * result.invested }));
  if (pts.length < 2) return null;
  const w = 720;
  const h = 200;
  const padT = 10;
  const padB = 20;
  const min = Math.min(...pts.map((p) => p.v));
  const max = Math.max(...pts.map((p) => p.v));
  const span = max - min || 1;
  const x = (i: number) => (i / (pts.length - 1)) * w;
  const y = (v: number) => padT + (1 - (v - min) / span) * (h - padT - padB);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join("");
  const up = pts[pts.length - 1].v >= pts[0].v;
  return (
    <div className="chart-wrap">
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="value over time">
        <line x1={0} x2={w} y1={y(result.invested)} y2={y(result.invested)} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 4" />
        <path d={d} fill="none" stroke={up ? "var(--up)" : "var(--down)"} strokeWidth="2" strokeLinejoin="round" />
        <text x={2} y={y(max) + 10} className="axis-label">{fmtNum(max, result.currency)}</text>
        <text x={2} y={y(min) - 3} className="axis-label">{fmtNum(min, result.currency)}</text>
      </svg>
    </div>
  );
}

export async function InvestedPage({ lang, params }: { lang: Lang; params: InvestedParams }) {
  const c = investedCopy(lang);
  const p = prefix(lang);
  const tag = LOCALE_TAG[lang];

  const asset = assetBySlug(params.asset ?? "") ?? assetBySlug(symbolSlug(DEFAULT_SYMBOL))!;
  const amount = parseAmount(params.amount);
  const years = parseYears(params.years);

  const history = await getHistory(asset.symbol);
  const now = history.points.length ? history.points[history.points.length - 1].t : Date.now();
  const startMs = now - years * 365.25 * 86400_000;
  const result = computeInvested(history.points, history.currency, amount, startMs);

  // The same amount over the other horizons, for the comparison table.
  const horizons = INVEST_YEARS.map((y) => ({
    years: y,
    result: computeInvested(history.points, history.currency, amount, now - y * 365.25 * 86400_000),
  }));

  const name = localName(lang, asset.symbol, asset.name);
  const fmtDate = (t: number) => new Date(t).toLocaleDateString(tag, { year: "numeric", month: "short", timeZone: "UTC" });
  const href = (a: string, amt: number, y: number) => `${p}${PATH}?asset=${a}&amount=${amt}&years=${y}`;

  const stats: { label: string; value: string; strong?: boolean }[] = result
    ? [
        { label: c.valueLabel, value: fmtNum(result.value, result.currency), strong: true },
        { label: c.profitLabel, value: `${result.profit >= 0 ? "+" : "−"}${fmtNum(Math.abs(result.profit), result.currency)}` },
        { label: c.multipleLabel, value: `${result.multiple.toFixed(2)}×` },
        { label: c.cagrLabel, value: result.cagrPct === null ? "—" : `${result.cagrPct >= 0 ? "+" : "−"}${Math.abs(result.cagrPct).toFixed(1)}%` },
        { label: c.boughtLabel, value: `${fmtNum(result.startPrice, result.currency)} · ${fmtDate(result.startedAt)}` },
        { label: c.nowLabel, value: `${fmtNum(result.endPrice, result.currency)} · ${fmtDate(result.endAt)}` },
      ]
    : [];

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.h1}</h1>
          <p className="quote-sub">{c.sub}</p>
        </div>
      </div>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.formHeading}</h2>
        </div>
        <form className="fx-converter" action={`${p}${PATH}`} method="get">
          <label className="fx-field">
            <span className="fx-cur">{c.assetLabel}</span>
            <select name="asset" defaultValue={asset.slug} aria-label={c.assetLabel}>
              {INVEST_ASSETS.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {localName(lang, a.symbol, a.name)}
                </option>
              ))}
            </select>
          </label>
          <label className="fx-field">
            <span className="fx-cur">{c.amountLabel}</span>
            <input name="amount" inputMode="numeric" defaultValue={String(amount)} aria-label={c.amountLabel} />
          </label>
          <label className="fx-field">
            <span className="fx-cur">{c.startLabel}</span>
            <select name="years" defaultValue={String(years)} aria-label={c.startLabel}>
              {INVEST_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}Y
                </option>
              ))}
            </select>
          </label>
          <button className="range-btn active" type="submit">
            {c.formHeading}
          </button>
        </form>
      </section>

      {result ? (
        <>
          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.resultHeading}</h2>
              <span className="kicker-note">
                {name} · {fmtNum(amount, result.currency)} · {years}Y
              </span>
            </div>
            <div className="board stats-board">
              {stats.map((s) => (
                <div className="board-cell" key={s.label}>
                  <span className="b-name">{s.label}</span>
                  <span className={`b-value${s.strong ? " quote-price" : " stat-value"}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.chartHeading}</h2>
            </div>
            <ValueChart result={result} />
          </section>

          <AdSlot slot="0000000010" format="leaderboard" />

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.tableHeading}</h2>
            </div>
            <div className="table-scroll">
              <table className="mkt">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>{c.colHorizon}</th>
                    <th>{c.colValue}</th>
                    <th>{c.colMultiple}</th>
                  </tr>
                </thead>
                <tbody>
                  {horizons.map((h) => (
                    <tr key={h.years}>
                      <td style={{ textAlign: "left" }}>
                        <Link className="qlink" href={href(asset.slug, amount, h.years)}>
                          {h.years}Y
                        </Link>
                      </td>
                      <td>{h.result ? fmtNum(h.result.value, h.result.currency) : "—"}</td>
                      <td>{h.result ? `${h.result.multiple.toFixed(2)}×` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <p className="wire-note">{c.unavailable}</p>
      )}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.presetHeading}</h2>
        </div>
        <div className="pair-grid">
          {INVEST_ASSETS.slice(0, 10).map((a) =>
            [1000, 10000].map((amt) => (
              <Link className="pair-link" key={`${a.slug}-${amt}`} href={href(a.slug, amt, 5)}>
                {fmtNum(amt)} · {localName(lang, a.symbol, a.name)} · 5Y
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP1}</p>
        <p>{c.aboutP2}</p>
      </section>

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}

export { DEFAULT_AMOUNT, fill };
