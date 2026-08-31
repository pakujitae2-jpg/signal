import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { fill } from "@/lib/feature-copy";
import { getHistory } from "@/lib/history";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { isValidSymbol } from "@/lib/quote";
import { annualReturns, buildSeasonality, hasEnoughForSeasonality } from "@/lib/seasonality";
import { seasonalityCopy } from "@/lib/seasonality-copy";
import { SITE_URL } from "@/lib/site";
import { universeEntry } from "@/lib/universe";
import { displaySymbol } from "./QuotePage";

const PATH = (symbol: string) => `/quote/${encodeURIComponent(symbol)}/seasonality`;

function Pct({ v }: { v: number }) {
  const dir = v > 0.05 ? "up" : v < -0.05 ? "down" : "flat";
  return (
    <span className={`chg ${dir}`}>
      {dir === "up" ? "+" : dir === "down" ? "−" : ""}{Math.abs(v).toFixed(1)}%
    </span>
  );
}

export async function seasonalityMetadata(lang: Lang, symbol: string): Promise<Metadata> {
  if (!isValidSymbol(symbol)) return { title: "PNL404" };
  const t = seasonalityCopy(lang);
  const name = localName(lang, symbol, universeEntry(symbol)?.name ?? displaySymbol(symbol));
  const title = `${name} ${t.h1Suffix}`;
  const description = `${name} — ${t.sub}`;
  const path = PATH(symbol);
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function SeasonalityPage({ lang, symbol }: { lang: Lang; symbol: string }) {
  if (!isValidSymbol(symbol)) notFound();
  const sym = symbol.toUpperCase();
  const t = seasonalityCopy(lang);
  const p = prefix(lang);
  const path = PATH(symbol);
  const entry = universeEntry(sym);
  const name = localName(lang, sym, entry?.name ?? displaySymbol(sym));

  const history = await getHistory(sym);
  const ready = history.source === "live" && hasEnoughForSeasonality(history.points);
  const matrix = ready ? buildSeasonality(history.points) : null;
  const annual = ready ? annualReturns(history.points) : [];

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}/quote/${encodeURIComponent(sym)}`, label: name }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${p}/quote/${encodeURIComponent(sym)}` },
            { "@type": "ListItem", position: 3, name: t.h1Suffix, item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{name} {t.h1Suffix}</h1>
          <p className="quote-sub">{t.sub}</p>
        </div>
      </div>

      {matrix ? (
        <>
          <p className="fineprint">{fill(t.sampleNote, { N: String(matrix.yearsOfHistory), YEAR: String(matrix.startYear) })}</p>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{t.matrixHeading}</h2>
            </div>
            <div className="table-scroll">
              <table className="mkt">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>{t.colMonth}</th>
                    <th>{t.avgLabel}</th>
                    <th>{t.medianLabel}</th>
                    <th>{t.hitRateLabel}</th>
                    <th>{t.bestLabel}</th>
                    <th>{t.worstLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.monthStats.map((m) => (
                    <tr key={m.month}>
                      <td style={{ textAlign: "left" }}>{t.months[m.month]}</td>
                      <td>{m.n === 0 ? "—" : <Pct v={m.avg} />}</td>
                      <td>{m.n === 0 ? "—" : <Pct v={m.median} />}</td>
                      <td>{m.n === 0 ? "—" : `${m.hitRate.toFixed(0)}%`}</td>
                      <td>{m.n === 0 ? "—" : <Pct v={m.best} />}</td>
                      <td>{m.n === 0 ? "—" : <Pct v={m.worst} />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {annual.length > 0 && (
            <section className="block">
              <div className="kicker">
                <h2 className="kicker-label">{t.annualHeading}</h2>
              </div>
              <div className="table-scroll">
                <table className="mkt">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>{t.colYear}</th>
                      <th>{t.colReturn}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {annual.map((y) => (
                      <tr key={y.year}>
                        <td style={{ textAlign: "left" }}>{y.year}</td>
                        <td><Pct v={y.pct} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="block prose">
            <p>{t.disclaimer}</p>
          </section>
        </>
      ) : (
        <p className="wire-note">{t.unavailable}</p>
      )}

      <section className="block">
        <div className="pair-grid">
          <Link className="pair-link" href={`${p}/quote/${encodeURIComponent(sym)}`}>
            {t.quoteLinkText}
          </Link>
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{t.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
