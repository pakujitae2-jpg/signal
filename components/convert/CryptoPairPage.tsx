import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { Footer, Header } from "./PairPage";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { CRYPTO_CODES, CURRENCIES, MAJOR, amountSlug, isCryptoCode, pairSlug, parseSlug } from "@/lib/fx";
import { cryptoAmountLadder, fmtCryptoAmount, getCryptoFxRate, type CryptoFxRate } from "@/lib/crypto-fx";
import { cryptoConvertCopy } from "@/lib/crypto-fx-copy";
import { fmtTime } from "@/lib/format";
import { curName, languageAlternates, numFmt, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { SITE_URL } from "@/lib/site";
import { universeEntry } from "@/lib/universe";

// The crypto leg of /convert: /convert/btc-to-krw, /convert/0.1-btc-to-usd.
// A separate render path from PairPage.tsx (which stays fiat-only,
// untouched) because the data shape genuinely differs — no ECB/Frankfurter
// history, a method label instead of a trend chart, and prices sourced from
// lib/quote.ts / Upbit instead of lib/fx.ts's fiat chain.

function coinName(lang: Lang, coin: string): string {
  const fallback = universeEntry(`${coin}-USD`)?.name ?? coin;
  return localName(lang, `${coin}-USD`, fallback);
}

function splitPair(slug: string): { base: string; quote: string; amount: number | null; coin: string; fiat: string } | null {
  const parsed = parseSlug(slug);
  if (!parsed) return null;
  const { base, quote } = parsed;
  if (!isCryptoCode(base) && !isCryptoCode(quote)) return null; // not a crypto pair — caller routes elsewhere
  const coin = isCryptoCode(base) ? base : quote;
  const fiat = isCryptoCode(base) ? quote : base;
  return { ...parsed, coin, fiat };
}

export function isCryptoPairSlug(slug: string): boolean {
  return splitPair(slug) !== null;
}

export async function cryptoPairMetadata(lang: Lang, slug: string): Promise<Metadata> {
  const parsed = splitPair(slug);
  if (!parsed) return { title: "PNL404" };
  const { base, quote, amount, coin, fiat } = parsed;
  const fx = await getCryptoFxRate(base, quote);
  const path = `/convert/${slug}`;
  const canonical = `${prefix(lang)}${path}`;
  const cName = coinName(lang, coin);
  const fName = curName(lang, fiat);
  const baseIsCoin = isCryptoCode(base);
  const amt = amount ?? 1;
  const f = numFmt(lang);
  const amtLabel = baseIsCoin ? fmtCryptoAmount(amt, lang) : f.input(amt);
  const title = fx
    ? `${amtLabel} ${base} ${cName} → ${fName} (${f.rate(fx.rate * amt)} ${quote})`
    : `${cName} → ${fName}`;
  const description = fx
    ? `${amtLabel} ${base} = ${f.rate(fx.rate * amt)} ${quote}. ${cName} to ${fName} live converter with amount table.`
    : `Convert ${cName} to ${fName}.`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function CryptoPairPage({ lang, slug }: { lang: Lang; slug: string }) {
  const parsed = splitPair(slug);
  if (!parsed) notFound();
  const { base, quote, amount, coin, fiat } = parsed;
  const c = cryptoConvertCopy(lang);
  const f = numFmt(lang);
  const p = prefix(lang);
  const path = `/convert/${slug}`;
  const cName = coinName(lang, coin);
  const fName = curName(lang, fiat);
  const baseIsCoin = isCryptoCode(base);

  const fx: CryptoFxRate | null = await getCryptoFxRate(base, quote);
  const amt = amount ?? 1;
  const amtLabel = baseIsCoin ? fmtCryptoAmount(amt, lang) : f.input(amt);
  const result = fx ? amt * fx.rate : null;
  const dayPct = fx?.prevRate ? ((fx.rate - fx.prevRate) / fx.prevRate) * 100 : null;
  const dir = (v: number): "up" | "down" | "flat" => (v > 0.005 ? "up" : v < -0.005 ? "down" : "flat");
  const partners = AFFILIATES.filter((x) => x.category === "Crypto Exchanges").slice(0, 3);

  // The amount ladder is always a COIN quantity — 0.001/0.01/.../10 for a
  // BTC-tier coin — scaled to the coin's own USD price regardless of which
  // fiat this particular pair converts to, and regardless of whether the
  // coin happens to be the base or the quote on THIS page's URL.
  const ladder = fx ? cryptoAmountLadder(fx.coinUsdPrice) : [];
  // 1 coin = coinToFiatRate fiat, independent of the current page's base/quote order.
  const coinToFiatRate = fx ? (baseIsCoin ? fx.rate : 1 / fx.rate) : null;

  return (
    <div className="paper">
      <Header lang={lang} path={path} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: `${coin} → ${fiat}`, item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />
      {fx && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ExchangeRateSpecification",
            currency: base,
            currentExchangeRate: { "@type": "UnitPriceSpecification", price: Number(fx.rate.toPrecision(8)), priceCurrency: quote },
          }}
        />
      )}

      <div className="quote-head">
        <div>
          <h1 className="quote-name">
            {baseIsCoin ? `${cName} → ${fName}` : `${fName} → ${cName}`}
          </h1>
          <p className="quote-sub">
            {base}/{quote} · {c.updated} {fmtTime(new Date().toISOString())} UTC
          </p>
        </div>
        {result !== null && (
          <div className="quote-price-box">
            <span className="quote-price">
              {amtLabel} {base} = {f.amount(result)} {quote}
            </span>
            {dayPct !== null && (
              <span className="quote-chg">
                <span className={`chg ${dir(dayPct)}`}>
                  {dir(dayPct) === "up" ? "▲" : dir(dayPct) === "down" ? "▼" : "–"} {Math.abs(dayPct).toFixed(2)}%
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {!fx && <p className="wire-note">{c.unavailable}</p>}
      {fx?.source === "sample" && <p className="wire-note">{c.sampleNote}</p>}

      {fx && (
        <section className="block prose">
          <div className="kicker">
            <h2 className="kicker-label">{c.methodHeading}</h2>
          </div>
          <p>{fx.method === "upbit-krw" ? c.methodUpbit : c.methodCross.replace("{quote}", fiat)}</p>
          {fx.method === "cross-usd" && fiat === "KRW" && (
            <p>
              {c.kimchiNote} <Link className="statline-link" href={`${p}/kimchi-premium`}>{c.kimchiLinkText}</Link>
            </p>
          )}
        </section>
      )}

      {fx && ladder.length > 0 && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.popularAmounts}</h2>
          </div>
          <div className="pair-grid">
            {ladder.map((x) => {
              const s = amountSlug(x, coin, fiat);
              if (s === slug) return null;
              return (
                <Link className="pair-link" key={x} href={`${p}/convert/${s}`}>
                  {fmtCryptoAmount(x, lang)} {coin}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {fx && coinToFiatRate !== null && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.table}</h2>
          </div>
          <div className="table-scroll">
            <table className="mkt">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>{c.colAmount}</th>
                  <th>{c.colValue}</th>
                </tr>
              </thead>
              <tbody>
                {ladder.map((x) => (
                  <tr key={x}>
                    <td style={{ textAlign: "left" }}>
                      {fmtCryptoAmount(x, lang)} {coin}
                    </td>
                    <td>
                      {f.amount(x * coinToFiatRate)} {fiat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <AdSlot slot="0000000006" format="leaderboard" />

      {partners.length > 0 && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.tradeHeading}</h2>
            <span className="kicker-note">{c.partnerOffers}</span>
          </div>
          {partners.map((x) => (
            <a className="p-row" key={x.name} href={x.url} target="_blank" rel="noopener noreferrer sponsored">
              <span className="p-main">
                <span className="p-name">{x.name}</span>
                <span className="p-desc">{x.desc}</span>
              </span>
              <span className="p-arrow" aria-hidden="true">→</span>
            </a>
          ))}
          <p className="fineprint">{AFFILIATE_DISCLOSURE}</p>
        </section>
      )}

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutBody}</p>
        <p>
          <Link className="statline-link" href={`${p}/quote/${encodeURIComponent(`${coin}-USD`)}`}>
            {c.quoteLinkText}
          </Link>
        </p>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.otherFiatsHeading}</h2>
        </div>
        <div className="pair-grid">
          {MAJOR.filter((x) => x !== fiat).map((x) =>
            baseIsCoin ? (
              <Link className="pair-link" key={x} href={`${p}/convert/${pairSlug(coin, x)}`}>
                {coin} → {x}
              </Link>
            ) : (
              <Link className="pair-link" key={x} href={`${p}/convert/${pairSlug(x, coin)}`}>
                {x} → {coin}
              </Link>
            )
          )}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.otherCoinsHeading}</h2>
        </div>
        <div className="pair-grid">
          {CRYPTO_CODES.filter((x) => x !== coin)
            .slice(0, 20)
            .map((x) =>
              baseIsCoin ? (
                <Link className="pair-link" key={x} href={`${p}/convert/${pairSlug(x, fiat)}`}>
                  {x} → {fiat}
                </Link>
              ) : (
                <Link className="pair-link" key={x} href={`${p}/convert/${pairSlug(fiat, x)}`}>
                  {fiat} → {x}
                </Link>
              )
            )}
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
