import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import {
  dividendsFor,
  dividendsByYear,
  kenritsukiSaishubi,
  payoutFrequency,
  ttmSum,
  yoyGrowthPct,
  type PayoutFrequency,
} from "@/lib/dividends";
import { dividendsCopy } from "@/lib/dividends-copy";
import { fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { getQuoteDetail, isValidSymbol } from "@/lib/quote";
import { SITE_URL } from "@/lib/site";
import { universeEntry } from "@/lib/universe";
import { displaySymbol } from "./QuotePage";

const PATH = (symbol: string) => `/quote/${encodeURIComponent(symbol)}/dividends`;

function freqLabel(t: ReturnType<typeof dividendsCopy>, f: PayoutFrequency): string {
  return { monthly: t.freqMonthly, quarterly: t.freqQuarterly, semiannual: t.freqSemiannual, annual: t.freqAnnual, irregular: t.freqIrregular }[f];
}

export async function dividendsMetadata(lang: Lang, symbol: string): Promise<Metadata> {
  if (!isValidSymbol(symbol)) return { title: "PNL404" };
  const record = dividendsFor(symbol.toUpperCase());
  if (!record) return { title: "PNL404" };
  const t = dividendsCopy(lang);
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

export async function DividendsPage({ lang, symbol }: { lang: Lang; symbol: string }) {
  if (!isValidSymbol(symbol)) notFound();
  const sym = symbol.toUpperCase();
  const record = dividendsFor(sym);
  if (!record) notFound();

  const t = dividendsCopy(lang);
  const p = prefix(lang);
  const path = PATH(symbol);
  const entry = universeEntry(sym);
  const name = localName(lang, sym, entry?.name ?? displaySymbol(sym));

  const detail = await getQuoteDetail(sym, "1d");
  const ttm = ttmSum(record);
  const price = detail && detail.source === "live" ? detail.price : null;
  const yieldPct = price && price > 0 ? (ttm / price) * 100 : null;
  const freq = payoutFrequency(record);
  const yoy = yoyGrowthPct(record);
  const byYear = dividendsByYear(record);
  const maxYearTotal = Math.max(...byYear.map((y) => y.total), 1);
  const isJp = sym.endsWith(".T");
  const currency = entry?.group === "kr-stock" ? "KRW" : isJp ? "JPY" : "USD";

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

      <section className="block">
        <div className="board">
          <div className="board-cell">
            <span className="b-name">{t.ttmLabel}</span>
            <span className="b-value quote-price">{fmtNum(ttm, currency)}</span>
          </div>
          <div className="board-cell">
            <span className="b-name">{t.yieldLabel}</span>
            <span className="b-value quote-price">{yieldPct === null ? "—" : `${yieldPct.toFixed(2)}%`}</span>
          </div>
          <div className="board-cell">
            <span className="b-name">{t.frequencyLabel}</span>
            <span className="b-value stat-value">{freqLabel(t, freq)}</span>
          </div>
          <div className="board-cell">
            <span className="b-name">{t.yoyLabel}</span>
            <span className={`b-value ${yoy === null ? "stat-value" : yoy >= 0 ? "chg up" : "chg down"}`}>
              {yoy === null ? "—" : `${yoy >= 0 ? "+" : "−"}${Math.abs(yoy).toFixed(1)}%`}
            </span>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.yearlyHeading}</h2>
        </div>
        <div className="table-scroll">
          <table className="mkt">
            <tbody>
              {byYear.map((y) => (
                <tr key={y.year}>
                  <td style={{ textAlign: "left", width: 70 }}>{y.year}</td>
                  <td style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, background: "var(--rule)", height: 10 }}>
                        <div style={{ width: `${(y.total / maxYearTotal) * 100}%`, background: "var(--ink)", height: "100%" }} />
                      </div>
                      <span className="stat-value" style={{ whiteSpace: "nowrap" }}>{fmtNum(y.total, currency)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isJp && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{t.kenriHeading}</h2>
          </div>
          <p className="fineprint">{t.kenriNote}</p>
          <div className="table-scroll">
            <table className="mkt">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>{t.colExDate}</th>
                  <th style={{ textAlign: "left" }}>{t.colKenritsuki}</th>
                </tr>
              </thead>
              <tbody>
                {record.dividends
                  .slice(-6)
                  .reverse()
                  .map((d) => (
                    <tr key={d.exDate}>
                      <td style={{ textAlign: "left" }}>{d.exDate}</td>
                      <td style={{ textAlign: "left" }}>{kenritsukiSaishubi(d.exDate)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.historyHeading}</h2>
        </div>
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>{t.colExDate}</th>
                <th style={{ textAlign: "left" }}>{t.colRecordDate}</th>
                <th>{t.colAmount}</th>
              </tr>
            </thead>
            <tbody>
              {record.dividends
                .slice()
                .reverse()
                .map((d) => (
                  <tr key={d.exDate}>
                    <td style={{ textAlign: "left" }}>{d.exDate}</td>
                    <td style={{ textAlign: "left" }}>{d.recordDate ?? "—"}</td>
                    <td>{fmtNum(d.amount, currency)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="fineprint">{t.splitAdjustedNote}</p>
      </section>

      {record.splits.length > 0 && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{t.splitsHeading}</h2>
          </div>
          <div className="table-scroll">
            <table className="mkt">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>{t.colSplitDate}</th>
                  <th style={{ textAlign: "left" }}>{t.colSplitRatio}</th>
                </tr>
              </thead>
              <tbody>
                {record.splits
                  .slice()
                  .reverse()
                  .map((s) => (
                    <tr key={s.exDate}>
                      <td style={{ textAlign: "left" }}>{s.exDate}</td>
                      <td style={{ textAlign: "left" }}>{s.ratio}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
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
