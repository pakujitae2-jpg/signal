import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import {
  CPI_CONVERSION_LADDER,
  CPI_COUNTRIES,
  CPI_CURRENCY,
  computeInflation,
  cpiYearRange,
  isCpiCountry,
  isValidCpiYear,
  type CpiCountry,
} from "@/lib/cpi";
import { cpiCopy } from "@/lib/cpi-copy";
import { fill } from "@/lib/feature-copy";
import { fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const HUB_PATH = "/inflation";
const PATH = (country: string, year: number | string) => `/inflation/${country}/${year}`;

const DEFAULT_AMOUNT: Record<CpiCountry, number> = { us: 100, kr: 10000, jp: 10000 };

function num(v: string | undefined, fallback: number): number {
  const n = Number(String(v ?? "").replace(/[, ]/g, ""));
  return isFinite(n) && n > 0 ? n : fallback;
}

export function inflationHubMetadata(lang: Lang): Metadata {
  const c = cpiCopy(lang);
  const canonical = `${prefix(lang)}${HUB_PATH}`;
  return {
    title: c.hubTitle,
    description: c.hubDescription,
    alternates: { canonical, languages: languageAlternates(HUB_PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.hubTitle, description: c.hubDescription, url: canonical },
    twitter: { card: "summary_large_image", title: c.hubTitle, description: c.hubDescription },
  };
}

export function InflationHub({ lang }: { lang: Lang }) {
  const c = cpiCopy(lang);
  const p = prefix(lang);
  const spans = [10, 20, 30, 50];

  return (
    <div className="paper">
      <LangNav lang={lang} path={HUB_PATH} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.hubH1, item: `${SITE_URL}${p}${HUB_PATH}` },
          ],
        }}
      />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.hubH1}</h1>
          <p className="quote-sub">{c.hubSub}</p>
        </div>
      </div>
      {CPI_COUNTRIES.map((country) => {
        const { max } = cpiYearRange(country);
        return (
          <section className="block" key={country}>
            <div className="kicker">
              <h2 className="kicker-label">{c.countryLabels[country]}</h2>
            </div>
            <div className="pair-grid">
              {spans.map((span) => {
                const year = max - span;
                return isValidCpiYear(country, year) ? (
                  <Link className="pair-link" key={span} href={`${p}${PATH(country, year)}`}>
                    {year}
                  </Link>
                ) : null;
              })}
            </div>
          </section>
        );
      })}
      <footer className="colophon">
        <p className="fine">
          {c.footer} © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}

export async function inflationMetadata(lang: Lang, countryRaw: string, yearRaw: string): Promise<Metadata> {
  const country = countryRaw as CpiCountry;
  const year = Number(yearRaw);
  if (!isCpiCountry(country) || !isValidCpiYear(country, year)) return { title: "PNL404" };
  const c = cpiCopy(lang);
  const amount = DEFAULT_AMOUNT[country];
  const vars = { AMOUNT: fmtNum(amount, CPI_CURRENCY[country]), COUNTRY: c.countryLabels[country], FROMYEAR: String(year) };
  const title = fill(c.title, vars);
  const description = fill(c.description, vars);
  const path = PATH(country, year);
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function InflationPage({ lang, country: countryRaw, year: yearRaw, amount: amountRaw }: { lang: Lang; country: string; year: string; amount?: string }) {
  const country = countryRaw as CpiCountry;
  const year = Number(yearRaw);
  if (!isCpiCountry(country) || !isValidCpiYear(country, year)) notFound();

  const c = cpiCopy(lang);
  const p = prefix(lang);
  const path = PATH(country, year);
  const currency = CPI_CURRENCY[country];
  const amount = num(amountRaw, DEFAULT_AMOUNT[country]);
  const result = computeInflation(country, year, amount);
  const { min, max } = cpiYearRange(country);

  const vars = { AMOUNT: fmtNum(amount, currency), COUNTRY: c.countryLabels[country], FROMYEAR: String(year) };
  const headlineVars = result ? { ...vars, RESULT: fmtNum(result.result, currency), TOYEAR: String(result.toYear) } : vars;
  const headline = result ? fill(result.toYearPartial ? c.headlineToday : c.headlineLagged, headlineVars) : c.unavailable;

  const otherYears = [year - 30, year - 10, year + 10, year + 30].filter((y) => isValidCpiYear(country, y) && y !== year);

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}${HUB_PATH}`, label: c.hubH1 }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.hubH1, item: `${SITE_URL}${p}${HUB_PATH}` },
            { "@type": "ListItem", position: 3, name: fill(c.h1, vars), item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{fill(c.h1, vars)}</h1>
          <p className="quote-sub">{headline}</p>
        </div>
      </div>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.formHeading}</h2>
        </div>
        <form className="fx-converter" action={`${p}${path}`} method="get">
          <label className="fx-field">
            <span className="fx-cur">{c.amountLabel}</span>
            <input name="amount" inputMode="decimal" defaultValue={amount} aria-label={c.amountLabel} />
          </label>
          <button className="range-btn active" type="submit">
            {c.formHeading}
          </button>
        </form>
      </section>

      {result ? (
        <>
          <section className="block">
            <div className="board stats-board">
              <div className="board-cell">
                <span className="b-name">{c.cumulativeLabel}</span>
                <span className="b-value stat-value">
                  {result.cumulativePct >= 0 ? "+" : "−"}
                  {Math.abs(result.cumulativePct).toFixed(1)}%
                </span>
              </div>
              <div className="board-cell">
                <span className="b-name">{c.annualLabel}</span>
                <span className="b-value stat-value">
                  {result.annualPct >= 0 ? "+" : "−"}
                  {Math.abs(result.annualPct).toFixed(2)}%
                </span>
              </div>
            </div>
            {result.toYearPartial && <p className="wire-note">{fill(c.partialYearNote, { YEAR: String(result.toYear) })}</p>}
            {!result.toYearPartial && <p className="wire-note">{c.laggedNote}</p>}
            {lang === "ja" && c.jaIndexNote && <p className="wire-note">{c.jaIndexNote}</p>}
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.ladderHeading}</h2>
            </div>
            <div className="table-scroll">
              <table className="mkt">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>{country.toUpperCase()}</th>
                    <th>{c.colValue}</th>
                  </tr>
                </thead>
                <tbody>
                  {CPI_CONVERSION_LADDER.map((base) => (
                    <tr key={base}>
                      <td style={{ textAlign: "left" }}>{fmtNum(base, currency)}</td>
                      <td>{fmtNum(base * (result.toCpi / result.fromCpi), currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <AdSlot slot="0000000027" format="leaderboard" />

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.yearByYearHeading}</h2>
            </div>
            <div className="table-scroll">
              <table className="mkt">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>{c.colYear}</th>
                    <th>{c.colCpi}</th>
                    <th>{c.colValue}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearByYear.map((row) => (
                    <tr key={row.year}>
                      <td style={{ textAlign: "left" }}>{row.year}</td>
                      <td>{row.cpi.toFixed(1)}</td>
                      <td>{fmtNum(row.value, currency)}</td>
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
          <h2 className="kicker-label">{c.otherStartYearsHeading}</h2>
        </div>
        <div className="pair-grid">
          {otherYears.map((y) => (
            <Link className="pair-link" key={y} href={`${p}${PATH(country, y)}?amount=${amount}`}>
              {y}
            </Link>
          ))}
          {CPI_COUNTRIES.filter((cc) => cc !== country).map((cc) => (
            <Link className="pair-link" key={cc} href={`${p}${PATH(cc, Math.min(Math.max(year, cpiYearRange(cc).min), cpiYearRange(cc).max - 1))}`}>
              {c.countryLabels[cc]}
            </Link>
          ))}
        </div>
      </section>

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP}</p>
        <p className="fineprint">
          {country.toUpperCase()}: {min}–{max}
        </p>
      </section>

      <footer className="colophon">
        <p className="fine">
          {c.footer} © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
