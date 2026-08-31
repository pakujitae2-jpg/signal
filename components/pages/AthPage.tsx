import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { getCryptoAth, getCryptoAthFor, type AthEntry } from "@/lib/ath";
import { fill } from "@/lib/feature-copy";
import { fmtDate, fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { athCopy } from "@/lib/page-copy";
import { SITE_URL } from "@/lib/site";

// /ath (ranked table) and /ath/[symbol] (per-coin), crypto only — see
// lib/ath.ts for why this deliberately does not extend to stocks/indices.

const PATH = "/ath";

export function athHubMetadata(lang: Lang): Metadata {
  const c = athCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

function daysSince(dateIso: string, now: number): number {
  return Math.max(0, Math.floor((now - Date.parse(`${dateIso}T00:00:00Z`)) / 86400_000));
}

function PctFromAth({ v }: { v: number }) {
  const pct = v * 100;
  return <span className="chg down">▼ {Math.abs(pct).toFixed(1)}%</span>;
}

export async function AthHub({ lang }: { lang: Lang }) {
  const c = athCopy(lang);
  const p = prefix(lang);
  const data = await getCryptoAth();

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.h1}</h1>
          <p className="quote-sub">{c.sub}</p>
        </div>
      </div>

      {data ? (
        <section className="block">
          <div className="table-scroll">
            <table className="mkt">
              <thead>
                <tr>
                  <th>{c.colRank}</th>
                  <th style={{ textAlign: "left" }}>{c.colName}</th>
                  <th>{c.colPrice}</th>
                  <th>{c.colAth}</th>
                  <th>{c.colFromAth}</th>
                  <th>{c.colAthDate}</th>
                  <th>{c.colRecovery}</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((e, i) => (
                  <tr key={e.symbol}>
                    <td>{e.marketCapRank ?? i + 1}</td>
                    <td style={{ textAlign: "left" }}>
                      <Link className="qlink" href={`${p}/ath/${e.coinSymbol.toLowerCase()}`}>
                        {localName(lang, e.symbol, e.name)}
                      </Link>
                    </td>
                    <td>{fmtNum(e.price, "USD")}</td>
                    <td>{fmtNum(e.ath, "USD")}</td>
                    <td>
                      <PctFromAth v={e.pctFromAth} />
                    </td>
                    <td>{e.athDate}</td>
                    <td>{e.recoveryMultiple.toFixed(2)}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fineprint">
            {c.attribution} · {c.asOf} {fmtDate(data.asOf)}
          </p>
        </section>
      ) : (
        <p className="wire-note">{c.unavailable}</p>
      )}

      <AdSlot slot="0000000017" format="leaderboard" />

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

export async function athSymbolMetadata(lang: Lang, coinSymbol: string): Promise<Metadata> {
  const c = athCopy(lang);
  const entry = await getCryptoAthFor(`${coinSymbol.toUpperCase()}-USD`);
  if (!entry) return { title: "PNL404" };
  const name = localName(lang, entry.symbol, entry.name);
  const title = fill(c.detailTitle, { NAME: name });
  const description = fill(c.detailDescription, { NAME: name, DATE: entry.athDate });
  const path = `${PATH}/${coinSymbol.toLowerCase()}`;
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function AthSymbolPage({ lang, coinSymbol }: { lang: Lang; coinSymbol: string }) {
  const c = athCopy(lang);
  const p = prefix(lang);
  const entry = await getCryptoAthFor(`${coinSymbol.toUpperCase()}-USD`);
  if (!entry) notFound();

  const name = localName(lang, entry.symbol, entry.name);
  const now = Date.now();
  const path = `${PATH}/${coinSymbol.toLowerCase()}`;

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}${PATH}`, label: c.h1 }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.h1, item: `${SITE_URL}${p}${PATH}` },
            { "@type": "ListItem", position: 3, name, item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{name}</h1>
          <p className="quote-sub">{fill(c.athOnLabel, { DATE: entry.athDate })}</p>
        </div>
      </div>

      <section className="block">
        <div className="board">
          <div className="board-cell">
            <span className="b-name">{c.colPrice}</span>
            <span className="b-value quote-price">{fmtNum(entry.price, "USD")}</span>
          </div>
          <div className="board-cell">
            <span className="b-name">{c.colAth}</span>
            <span className="b-value quote-price">{fmtNum(entry.ath, "USD")}</span>
          </div>
          <div className="board-cell">
            <span className="b-name">{c.colFromAth}</span>
            <span className="b-value">
              <PctFromAth v={entry.pctFromAth} />
            </span>
          </div>
          <div className="board-cell">
            <span className="b-name">{c.colDaysSince}</span>
            <span className="b-value stat-value">{fill(c.daysSinceAth, { N: String(daysSince(entry.athDate, now)) })}</span>
          </div>
        </div>
        <p className="wire-note">{fill(c.recoveryNote, { X: entry.recoveryMultiple.toFixed(2) })}</p>
      </section>

      <AdSlot slot="0000000018" format="leaderboard" />

      <section className="block">
        <div className="pair-grid">
          <Link className="pair-link" href={`${p}/quote/${encodeURIComponent(entry.symbol)}`}>
            {entry.symbol}
          </Link>
          <Link className="pair-link" href={`${p}${PATH}`}>
            {c.h1}
          </Link>
        </div>
      </section>

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP}</p>
        <p className="fineprint">{c.attribution}</p>
      </section>

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
