import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import LangNav from "@/components/LangNav";
import { dcaCopy, fill } from "@/lib/feature-copy";
import { DCA_POPULAR_SYMBOLS, DCA_YEARS, parseDcaAmount, parseDcaYears } from "@/lib/dca";
import { fmtNum } from "@/lib/format";
import { getHistory } from "@/lib/history";
import { computeDca, computeInvested, type DcaResult } from "@/lib/invested-math";
import { languageAlternates, LOCALE_TAG, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { universeEntry } from "@/lib/universe";

// /dca/<symbol> — recurring-contribution sibling of /tools/invested, open to
// any universe symbol via a path segment rather than the lump-sum page's
// 16-asset ?asset= dropdown.

const PATH = (symbol: string) => `/dca/${encodeURIComponent(symbol)}`;

export type DcaParams = { amount?: string; years?: string };

export async function dcaMetadata(lang: Lang, symbol: string): Promise<Metadata> {
  const entry = universeEntry(symbol);
  if (!entry) return { title: "PNL404" };
  const c = dcaCopy(lang);
  const name = localName(lang, entry.symbol, entry.name);
  const title = fill(c.title, { NAME: name });
  const description = fill(c.description, { NAME: name });
  const path = PATH(entry.symbol);
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

function ValueChart({ result }: { result: DcaResult }) {
  if (result.path.length < 2) return null;
  const w = 720;
  const h = 200;
  const padT = 10;
  const padB = 20;
  const allVals = [...result.path.map((p) => p.c), ...result.contributedPath.map((p) => p.c)];
  const min = Math.min(...allVals, 0);
  const max = Math.max(...allVals);
  const span = max - min || 1;
  const n = result.path.length;
  const x = (i: number) => (i / (n - 1)) * w;
  const y = (v: number) => padT + (1 - (v - min) / span) * (h - padT - padB);
  const line = (pts: { c: number }[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.c).toFixed(1)}`).join("");
  const up = result.value >= result.contributed;
  return (
    <div className="chart-wrap">
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="value and contributions over time">
        <path d={line(result.contributedPath)} fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="3 4" />
        <path d={line(result.path)} fill="none" stroke={up ? "var(--up)" : "var(--down)"} strokeWidth="2" strokeLinejoin="round" />
        <text x={2} y={y(max) + 10} className="axis-label">{fmtNum(max, result.currency)}</text>
        <text x={2} y={y(min) - 3 < 12 ? 12 : y(min) - 3} className="axis-label">{fmtNum(min, result.currency)}</text>
      </svg>
    </div>
  );
}

export async function DcaPage({ lang, symbol, params }: { lang: Lang; symbol: string; params: DcaParams }) {
  const entry = universeEntry(symbol);
  if (!entry) notFound();
  const sym = entry.symbol;
  const c = dcaCopy(lang);
  const p = prefix(lang);
  const tag = LOCALE_TAG[lang];
  const path = PATH(sym);

  const amount = parseDcaAmount(params.amount);
  const years = parseDcaYears(params.years);

  const history = await getHistory(sym);
  const now = history.points.length ? history.points[history.points.length - 1].t : Date.now();
  const startMs = now - years * 365.25 * 86400_000;
  const result = computeDca(history.points, history.currency, amount, startMs);
  const lump = result ? computeInvested(history.points, history.currency, result.contributed, result.startedAt) : null;

  const horizons = DCA_YEARS.map((y) => ({
    years: y,
    result: computeDca(history.points, history.currency, amount, now - y * 365.25 * 86400_000),
  }));

  const name = localName(lang, sym, entry.name);
  const href = (y: number) => `${p}${path}?amount=${amount}&years=${y}`;
  const pctStr = (pct: number) => `${pct >= 0 ? "+" : "−"}${Math.abs(pct).toFixed(1)}%`;

  const stats: { label: string; value: string; strong?: boolean }[] = result
    ? [
        { label: c.contributedLabel, value: fmtNum(result.contributed, result.currency) },
        { label: c.valueLabel, value: fmtNum(result.value, result.currency), strong: true },
        { label: c.profitLabel, value: `${result.profit >= 0 ? "+" : "−"}${fmtNum(Math.abs(result.profit), result.currency)}` },
        { label: c.totalPctLabel, value: pctStr(result.totalPct) },
        { label: c.avgCostLabel, value: fmtNum(result.avgCost, result.currency) },
        { label: c.annualizedLabel, value: result.annualizedPct === null ? "—" : pctStr(result.annualizedPct) },
      ]
    : [];

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{fill(c.h1, { NAME: name })}</h1>
          <p className="quote-sub">{c.sub}</p>
        </div>
      </div>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.formHeading}</h2>
        </div>
        <form className="fx-converter" action={`${p}${path}`} method="get">
          <label className="fx-field">
            <span className="fx-cur">{c.amountLabel}</span>
            <input name="amount" inputMode="numeric" defaultValue={String(amount)} aria-label={c.amountLabel} />
          </label>
          <label className="fx-field">
            <span className="fx-cur">{c.startLabel}</span>
            <select name="years" defaultValue={String(years)} aria-label={c.startLabel}>
              {DCA_YEARS.map((y) => (
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
                {name} · {fmtNum(amount, result.currency)}/mo · {fill(c.monthsNote, { N: String(result.months) })}
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

          {lump ? (
            <section className="block">
              <div className="kicker">
                <h2 className="kicker-label">{c.vsLumpHeading}</h2>
              </div>
              <p className="wire-note">
                {fill(c.vsLumpNote, { LUMP: fmtNum(lump.value, lump.currency), DCA: fmtNum(result.value, result.currency) })}
              </p>
            </section>
          ) : null}

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.chartHeading}</h2>
            </div>
            <ValueChart result={result} />
          </section>

          <AdSlot slot="0000000023" format="leaderboard" />

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
                    <th>{c.colReturn}</th>
                  </tr>
                </thead>
                <tbody>
                  {horizons.map((h) => (
                    <tr key={h.years}>
                      <td style={{ textAlign: "left" }}>
                        <Link className="qlink" href={href(h.years)}>
                          {h.years}Y
                        </Link>
                      </td>
                      <td>{h.result ? fmtNum(h.result.value, h.result.currency) : "—"}</td>
                      <td>{h.result ? pctStr(h.result.totalPct) : "—"}</td>
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
          {DCA_POPULAR_SYMBOLS.filter((s) => s !== sym).map((s) => {
            const e = universeEntry(s);
            return e ? (
              <Link className="pair-link" key={s} href={`${p}${PATH(s)}`}>
                {localName(lang, s, e.name)}
              </Link>
            ) : null;
          })}
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
        <p className="fine">
          {c.footer} © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}

export { PATH as dcaPath };
