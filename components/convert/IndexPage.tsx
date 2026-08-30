import type { Metadata } from "next";
import Link from "next/link";
import { AMOUNTS, CURRENCIES, CURRENCY_CODES, MAJOR, amountSlug, pairSlug } from "@/lib/fx";
import { COPY, curCountry, curName, languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { Footer, Header } from "./PairPage";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

// Directory of currencies at /convert, /ko/convert and /ja/convert.

export function indexMetadata(lang: Lang): Metadata {
  const c = COPY[lang];
  const canonical = `${prefix(lang)}/convert`;
  const description = c.indexDesc(CURRENCY_CODES.length);
  return {
    title: c.indexTitle,
    description,
    alternates: { canonical, languages: languageAlternates("/convert") },
    openGraph: { type: "website", siteName: "PNL404", title: c.indexTitle, description, url: canonical },
    twitter: { card: "summary_large_image", title: c.indexTitle, description },
  };
}

const POPULAR: Record<Lang, [string, string][]> = {
  en: [
    ["USD", "KRW"], ["USD", "JPY"], ["USD", "EUR"], ["USD", "GBP"], ["USD", "CNY"], ["USD", "INR"], ["USD", "CAD"], ["USD", "AUD"],
    ["EUR", "USD"], ["GBP", "USD"], ["JPY", "KRW"], ["KRW", "USD"], ["JPY", "USD"], ["EUR", "GBP"], ["EUR", "JPY"], ["CNY", "KRW"],
    ["USD", "MXN"], ["USD", "BRL"], ["USD", "TRY"], ["USD", "VND"], ["USD", "PHP"], ["USD", "THB"], ["USD", "IDR"], ["USD", "TWD"],
  ],
  ko: [
    ["USD", "KRW"], ["JPY", "KRW"], ["EUR", "KRW"], ["CNY", "KRW"], ["GBP", "KRW"], ["HKD", "KRW"], ["TWD", "KRW"], ["VND", "KRW"],
    ["THB", "KRW"], ["PHP", "KRW"], ["AUD", "KRW"], ["CAD", "KRW"], ["SGD", "KRW"], ["CHF", "KRW"], ["IDR", "KRW"], ["MYR", "KRW"],
    ["KRW", "USD"], ["KRW", "JPY"], ["KRW", "EUR"], ["KRW", "CNY"], ["USD", "JPY"], ["EUR", "USD"], ["USD", "CNY"], ["USD", "TWD"],
  ],
  ja: [
    ["USD", "JPY"], ["EUR", "JPY"], ["KRW", "JPY"], ["CNY", "JPY"], ["GBP", "JPY"], ["AUD", "JPY"], ["TWD", "JPY"], ["HKD", "JPY"],
    ["THB", "JPY"], ["SGD", "JPY"], ["CHF", "JPY"], ["CAD", "JPY"], ["VND", "JPY"], ["PHP", "JPY"], ["IDR", "JPY"], ["NZD", "JPY"],
    ["JPY", "USD"], ["JPY", "KRW"], ["JPY", "EUR"], ["JPY", "CNY"], ["USD", "KRW"], ["EUR", "USD"], ["USD", "CNY"], ["USD", "TWD"],
  ],
};

const AMOUNT_PAIRS: Record<Lang, [string, string][]> = {
  en: [["USD", "KRW"], ["USD", "JPY"], ["USD", "EUR"], ["JPY", "KRW"], ["KRW", "USD"], ["EUR", "USD"]],
  ko: [["USD", "KRW"], ["JPY", "KRW"], ["EUR", "KRW"], ["CNY", "KRW"], ["KRW", "USD"], ["KRW", "JPY"]],
  ja: [["USD", "JPY"], ["KRW", "JPY"], ["EUR", "JPY"], ["CNY", "JPY"], ["JPY", "USD"], ["JPY", "KRW"]],
};

export function IndexPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const p = prefix(lang);
  return (
    <div className="paper">
      <Header lang={lang} path="/convert" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.currencies, item: `${SITE_URL}${p}/convert` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.indexH1}</h1>
          <p className="quote-sub">{c.indexSub(CURRENCY_CODES.length)}</p>
        </div>
      </div>

      <section className="block">
        <div className="kicker"><h2 className="kicker-label">{c.popularPairs}</h2></div>
        <div className="pair-grid">
          {POPULAR[lang].map(([b, q]) => (
            <Link className="pair-link" key={`${b}${q}`} href={`${p}/convert/${pairSlug(b, q)}`}>
              {lang === "en" ? `${b} → ${q}` : `${curName(lang, b)} → ${curName(lang, q)}`}
            </Link>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="kicker"><h2 className="kicker-label">{c.popularAmounts}</h2></div>
        <div className="pair-grid">
          {AMOUNT_PAIRS[lang].flatMap(([b, q]) =>
            [100, 1000, 10000].map((a) => (
              <Link className="pair-link" key={`${a}${b}${q}`} href={`${p}/convert/${amountSlug(a, b, q)}`}>
                {c.amountLink(a.toLocaleString("en-US"), b, q)}
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.allCurrencies}</h2>
          <span className="kicker-note">{c.allCurrenciesNote}</span>
        </div>
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>{c.colCurrency}</th>
                <th style={{ textAlign: "left" }}>{c.colCode}</th>
                <th style={{ textAlign: "left" }}>{c.colUsedIn}</th>
                <th style={{ textAlign: "left" }}>{c.colRates}</th>
              </tr>
            </thead>
            <tbody>
              {CURRENCY_CODES.map((code) => (
                <tr key={code}>
                  <td style={{ textAlign: "left" }}>
                    <Link className="qlink" href={`${p}/convert/${code.toLowerCase()}`}>
                      <span className="cell-name">{curName(lang, code)}</span>
                    </Link>
                  </td>
                  <td style={{ textAlign: "left" }}>{code} · {CURRENCIES[code].symbol}</td>
                  <td style={{ textAlign: "left" }}>{curCountry(lang, code)}</td>
                  <td style={{ textAlign: "left" }}>
                    {MAJOR.filter((q) => q !== code).slice(0, 4).map((q, i) => (
                      <span key={q}>
                        {i > 0 && " · "}
                        <Link className="statline-link" href={`${p}/convert/${pairSlug(code, q)}`}>{code}/{q}</Link>
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="block prose">
        <div className="kicker"><h2 className="kicker-label">{c.aboutRates}</h2></div>
        <p>{c.aboutRatesBody(AMOUNTS.length, String(AMOUNTS[0]), AMOUNTS[AMOUNTS.length - 1].toLocaleString("en-US"))}</p>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
