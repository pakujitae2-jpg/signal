import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { Footer, Header } from "./PairPage";
import { CURRENCIES, amountsFor, getFxRate, pairSlug } from "@/lib/fx";
import {
  fxRateOnDate,
  fxRateRange,
  historyYears,
  isValidHistoryYear,
  isWeekend,
  weekdaysOnly,
  yearRange,
  yearStats,
} from "@/lib/fx-history";
import { fill } from "@/lib/feature-copy";
import { fmtNum } from "@/lib/format";
import { curName, languageAlternates, numFmt, prefix, type Lang } from "@/lib/i18n";
import { fxHistoryCopy } from "@/lib/fx-history-copy";
import { SITE_URL } from "@/lib/site";

// /convert/<pair>/<period> — period is either a bare "YYYY" (year history)
// or "YYYY-MM-DD" (a specific date). One dynamic segment, dispatched by
// regex, so a single route file covers both per the roadmap's URL grammar.

const YEAR_RE = /^\d{4}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type PeriodKind = "year" | "date" | null;

export function periodKind(period: string): PeriodKind {
  if (YEAR_RE.test(period)) return "year";
  if (DATE_RE.test(period)) return "date";
  return null;
}

function parsePair(pairSlugStr: string): { base: string; quote: string } | null {
  const m = /^([a-z]{3})-to-([a-z]{3})$/.exec(pairSlugStr);
  if (!m) return null;
  const base = m[1].toUpperCase();
  const quote = m[2].toUpperCase();
  if (!CURRENCIES[base] || !CURRENCIES[quote] || base === quote) return null;
  return { base, quote };
}

function vars(base: string, quote: string, extra: Record<string, string>) {
  return { BASE: base, QUOTE: quote, ...extra };
}

// -------------------------------------------------------------- metadata --

export async function fxHistoryMetadata(lang: Lang, pairSlugStr: string, period: string): Promise<Metadata> {
  const pair = parsePair(pairSlugStr);
  const kind = periodKind(period);
  if (!pair || !kind) return { title: "PNL404" };
  const t = fxHistoryCopy(lang);
  const path = `/convert/${pairSlugStr}/${period}`;
  const canonical = `${prefix(lang)}${path}`;
  const v = kind === "year" ? vars(pair.base, pair.quote, { YEAR: period }) : vars(pair.base, pair.quote, { DATE: period });
  const title = fill(kind === "year" ? t.yearTitle : t.dateTitle, v);
  const description = fill(kind === "year" ? t.yearDescription : t.dateDescription, v);
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "article", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ------------------------------------------------------------------ page --

export async function FxHistoryPage({ lang, pairSlug: pairSlugStr, period }: { lang: Lang; pairSlug: string; period: string }) {
  const pair = parsePair(pairSlugStr);
  const kind = periodKind(period);
  if (!pair || !kind) notFound();
  if (kind === "year" && !isValidHistoryYear(Number(period))) notFound();

  return kind === "year" ? (
    <FxYearBody lang={lang} pairSlugStr={pairSlugStr} pair={pair} year={Number(period)} />
  ) : (
    <FxDateBody lang={lang} pairSlugStr={pairSlugStr} pair={pair} date={period} />
  );
}

async function FxYearBody({
  lang,
  pairSlugStr,
  pair,
  year,
}: {
  lang: Lang;
  pairSlugStr: string;
  pair: { base: string; quote: string };
  year: number;
}) {
  const { base, quote } = pair;
  const t = fxHistoryCopy(lang);
  const f = numFmt(lang);
  const p = prefix(lang);
  const path = `/convert/${pairSlugStr}/${year}`;
  const v = vars(base, quote, { YEAR: String(year) });

  const { from, to } = yearRange(year);
  const rows = await fxRateRange(base, quote, from, to);
  const stats = yearStats(rows);
  const weekdayRows = weekdaysOnly(rows).slice().reverse();

  return (
    <div className="paper">
      <Header lang={lang} path={path} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: `${base} → ${quote}`, item: `${SITE_URL}${p}/convert/${pairSlugStr}` },
            { "@type": "ListItem", position: 3, name: String(year), item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{fill(t.yearH1, v)}</h1>
        </div>
      </div>

      {stats ? (
        <>
          <section className="block">
            <div className="board">
              <div className="board-cell">
                <span className="b-name">{t.highLabel}</span>
                <span className="b-value quote-price">{f.rate(stats.high.rate)}</span>
                <div className="b-foot"><span className="chg flat">{stats.high.date}</span></div>
              </div>
              <div className="board-cell">
                <span className="b-name">{t.lowLabel}</span>
                <span className="b-value quote-price">{f.rate(stats.low.rate)}</span>
                <div className="b-foot"><span className="chg flat">{stats.low.date}</span></div>
              </div>
              <div className="board-cell">
                <span className="b-name">{t.averageLabel}</span>
                <span className="b-value quote-price">{f.rate(stats.average)}</span>
              </div>
              <div className="board-cell">
                <span className="b-name">{t.changeLabel}</span>
                <span className={`b-value ${stats.changePct >= 0 ? "chg up" : "chg down"}`}>
                  {stats.changePct >= 0 ? "+" : "−"}{Math.abs(stats.changePct).toFixed(2)}%
                </span>
              </div>
            </div>
            <p className="fineprint">{t.basisNote}</p>
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{t.dailyTableHeading}</h2>
            </div>
            <div className="table-scroll">
              <table className="mkt">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>{t.colDate}</th>
                    <th>{t.colRate}</th>
                  </tr>
                </thead>
                <tbody>
                  {weekdayRows.map((r) => (
                    <tr key={r.date}>
                      <td style={{ textAlign: "left" }}>
                        <Link className="qlink" href={`${p}/convert/${pairSlugStr}/${r.date}`}>{r.date}</Link>
                      </td>
                      <td>{f.rate(r.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <p className="wire-note">{t.unavailable}</p>
      )}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.otherYearsHeading}</h2>
        </div>
        <div className="pair-grid">
          <Link className="pair-link" href={`${p}/convert/${pairSlugStr}`}>{t.liveConverterLinkText}</Link>
          <Link className="pair-link" href={`${p}/convert/${pairSlug(quote, base)}/${year}`}>{quote} → {base}</Link>
          {historyYears().filter((y) => y !== year).map((y) => (
            <Link className="pair-link" key={y} href={`${p}/convert/${pairSlugStr}/${y}`}>{y}</Link>
          ))}
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{t.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}

async function FxDateBody({
  lang,
  pairSlugStr,
  pair,
  date,
}: {
  lang: Lang;
  pairSlugStr: string;
  pair: { base: string; quote: string };
  date: string;
}) {
  const { base, quote } = pair;
  const t = fxHistoryCopy(lang);
  const f = numFmt(lang);
  const p = prefix(lang);
  const path = `/convert/${pairSlugStr}/${date}`;
  const v = vars(base, quote, { DATE: date });

  const [point, live] = await Promise.all([fxRateOnDate(base, quote, date), getFxRate(base, quote, "1d")]);

  const requestedIsWeekend = isWeekend(date);
  const deltaPct = point && live.rate ? ((live.rate - point.rate) / point.rate) * 100 : null;
  const ladder = amountsFor(base);

  // ±3 surrounding days for context.
  const around =
    point &&
    (await fxRateRange(
      base,
      quote,
      new Date(Date.parse(date) - 4 * 86400_000).toISOString().slice(0, 10),
      new Date(Date.parse(date) + 4 * 86400_000).toISOString().slice(0, 10)
    ));

  return (
    <div className="paper">
      <Header lang={lang} path={path} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: `${base} → ${quote}`, item: `${SITE_URL}${p}/convert/${pairSlugStr}` },
            { "@type": "ListItem", position: 3, name: date, item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{fill(t.dateH1, v)}</h1>
        </div>
      </div>

      {point ? (
        <>
          {point.date !== date && (
            <p className="wire-note">{fill(t.beforeStartNote, { DATE: point.date })}</p>
          )}
          {requestedIsWeekend && point.date === date && <p className="wire-note">{t.weekendNote}</p>}

          <section className="block">
            <div className="board">
              <div className="board-cell">
                <span className="b-name">1 {base} =</span>
                <span className="b-value quote-price">{f.rate(point.rate)} {quote}</span>
              </div>
              {deltaPct !== null && (
                <div className="board-cell">
                  <span className="b-name">{t.deltaToTodayLabel}</span>
                  <span className={`b-value ${deltaPct >= 0 ? "chg up" : "chg down"}`}>
                    {deltaPct >= 0 ? "+" : "−"}{Math.abs(deltaPct).toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
            <p className="fineprint">{t.basisNote}</p>
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{t.amountAtRateHeading}</h2>
            </div>
            <div className="table-scroll">
              <table className="mkt">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>{t.colAmount}</th>
                    <th>{t.colValue}</th>
                  </tr>
                </thead>
                <tbody>
                  {ladder.map((x) => (
                    <tr key={x}>
                      <td style={{ textAlign: "left" }}>{f.input(x)} {base}</td>
                      <td>{fmtNum(x * point.rate, quote)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {around && around.length > 1 && (
            <section className="block">
              <div className="kicker">
                <h2 className="kicker-label">{t.surroundingHeading}</h2>
              </div>
              <div className="table-scroll">
                <table className="mkt">
                  <tbody>
                    {around.map((r) => (
                      <tr key={r.date}>
                        <td style={{ textAlign: "left", fontWeight: r.date === point.date ? 700 : 400 }}>
                          {r.date === date ? (
                            r.date
                          ) : (
                            <Link className="qlink" href={`${p}/convert/${pairSlugStr}/${r.date}`}>{r.date}</Link>
                          )}
                        </td>
                        <td>{f.rate(r.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="wire-note">{t.unavailable}</p>
      )}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.otherDatesHeading}</h2>
        </div>
        <div className="pair-grid">
          <Link className="pair-link" href={`${p}/convert/${pairSlugStr}`}>{t.liveConverterLinkText}</Link>
          <Link className="pair-link" href={`${p}/convert/${pairSlugStr}/${date.slice(0, 4)}`}>{date.slice(0, 4)}</Link>
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{t.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
