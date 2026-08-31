import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import LangNav from "@/components/LangNav";
import { fill, goldCopy, goldDonDescription, goldDonTitle } from "@/lib/feature-copy";
import { fmtNum } from "@/lib/format";
import {
  DON_PRESETS,
  DON_TO_GRAM,
  KARATS,
  donSlug,
  getGoldPriceKrw,
  parseDon,
  parseGrams,
  priceForGrams,
  type GoldPrice,
} from "@/lib/gold";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";

// A plain GET form drives the calculator, so every weight is a shareable URL
// (?g=grams or ?don=don). Fixed pages for 1-10 don reuse this same component
// with `fixedDon` set, giving each a canonical path-based URL.

const PATH = "/tools/gold-calculator";

export type GoldParams = { g?: string; don?: string };

export function goldMetadata(lang: Lang): Metadata {
  const c = goldCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

export function goldDonMetadata(lang: Lang, don: number): Metadata {
  const title = goldDonTitle(lang, String(don));
  const description = goldDonDescription(lang, String(don));
  const path = `${PATH}/${donSlug(don)}`;
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

function KaratTable({ price, grams, karatLabel }: { price: GoldPrice; grams: number; karatLabel: string }) {
  return (
    <div className="table-scroll">
      <table className="mkt">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>{karatLabel}</th>
            <th>₩</th>
          </tr>
        </thead>
        <tbody>
          {KARATS.map((k) => (
            <tr key={k}>
              <td style={{ textAlign: "left" }}>{k}K</td>
              <td>{fmtNum(priceForGrams(price, grams, k), "KRW")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function GoldPage({ lang, params, fixedDon }: { lang: Lang; params: GoldParams; fixedDon?: number }) {
  const c = goldCopy(lang);
  const p = prefix(lang);

  const don = fixedDon ?? (params.g === undefined ? parseDon(params.don) : null);
  const grams = don !== null ? don * DON_TO_GRAM : parseGrams(params.g);
  const displayDon = Math.round((grams / DON_TO_GRAM) * 100) / 100;

  const price = await getGoldPriceKrw();
  const path = fixedDon ? `${PATH}/${donSlug(fixedDon)}` : PATH;
  const h1 = fixedDon ? goldDonTitle(lang, String(fixedDon)).split(" — ")[0] : c.h1;

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={fixedDon ? { href: `${p}${PATH}`, label: c.h1 } : undefined} />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{h1}</h1>
          <p className="quote-sub">{c.sub}</p>
        </div>
      </div>

      {!fixedDon && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.formHeading}</h2>
          </div>
          <form className="fx-converter" action={`${p}${PATH}`} method="get">
            <label className="fx-field">
              <span className="fx-cur">{c.donLabel}</span>
              <input name="don" inputMode="decimal" defaultValue={String(displayDon)} aria-label={c.donLabel} />
            </label>
            <button className="range-btn active" type="submit">
              {c.formHeading}
            </button>
          </form>
        </section>
      )}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.resultHeading}</h2>
          <span className="kicker-note">{fill(c.forWeight, { N: `${displayDon}돈 (${fmtNum(grams)}g)` })}</span>
        </div>
        {price ? (
          <>
            <div className="board">
              <div className="board-cell">
                <span className="b-name">{c.perGramLabel}</span>
                <span className="b-value quote-price">{fmtNum(price.krwPerGram, "KRW")}</span>
              </div>
              <div className="board-cell">
                <span className="b-name">{c.perDonLabel}</span>
                <span className="b-value quote-price">{fmtNum(price.krwPerDon, "KRW")}</span>
              </div>
            </div>
            <KaratTable price={price} grams={grams} karatLabel={c.karatLabel} />
          </>
        ) : (
          <p className="wire-note">{c.unavailable}</p>
        )}
      </section>

      {price && (
        <section className="block prose">
          <div className="kicker">
            <h2 className="kicker-label">{c.basisHeading}</h2>
          </div>
          <p>{c.basisNote}</p>
        </section>
      )}

      <AdSlot slot="0000000012" format="leaderboard" />

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.presetHeading}</h2>
        </div>
        <div className="pair-grid">
          {DON_PRESETS.map((n) => (
            <Link className="pair-link" key={n} href={`${p}${PATH}/${donSlug(n)}`}>
              {fill(c.presetLink, { N: String(n) })}
            </Link>
          ))}
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
