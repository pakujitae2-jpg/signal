import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import LangNav from "@/components/LangNav";
import { fill } from "@/lib/feature-copy";
import { fmtCompactUsd } from "@/lib/format";
import { getAltcoinSeason, getBitcoinDominance, seasonLabel } from "@/lib/crypto-indices";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { altseasonCopy, dominanceCopy } from "@/lib/page-copy";

// Two small named-index pages: /bitcoin-dominance and /altcoin-season. Both
// cross-link each other and /markets/crypto, and both render an explicit
// unavailable state rather than a number derived from sample data.

const DOMINANCE_PATH = "/bitcoin-dominance";
const ALTSEASON_PATH = "/altcoin-season";

export function dominanceMetadata(lang: Lang): Metadata {
  const c = dominanceCopy(lang);
  const canonical = `${prefix(lang)}${DOMINANCE_PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(DOMINANCE_PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

export async function DominancePage({ lang }: { lang: Lang }) {
  const c = dominanceCopy(lang);
  const p = prefix(lang);
  const data = await getBitcoinDominance();

  return (
    <div className="paper">
      <LangNav lang={lang} path={DOMINANCE_PATH} />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.h1}</h1>
          <p className="quote-sub">{c.sub}</p>
        </div>
      </div>

      {data ? (
        <section className="block">
          <div className="board">
            <div className="board-cell">
              <span className="b-name">{c.btcDominanceLabel}</span>
              <span className="b-value quote-price">{data.btcDominance.toFixed(1)}%</span>
            </div>
            <div className="board-cell">
              <span className="b-name">{c.totalMarketCapLabel}</span>
              <span className="b-value quote-price">{fmtCompactUsd(data.totalMarketCapUsd)}</span>
            </div>
          </div>
        </section>
      ) : (
        <p className="wire-note">{c.unavailable}</p>
      )}

      <AdSlot slot="0000000019" format="leaderboard" />

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP}</p>
        <p>
          {c.relatedPrefix}
          <Link className="statline-link" href={`${p}${ALTSEASON_PATH}`}>{c.altseasonLinkText}</Link>
          {c.relatedSuffix}
        </p>
      </section>

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}

export function altseasonMetadata(lang: Lang): Metadata {
  const c = altseasonCopy(lang);
  const canonical = `${prefix(lang)}${ALTSEASON_PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(ALTSEASON_PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

export async function AltseasonPage({ lang }: { lang: Lang }) {
  const c = altseasonCopy(lang);
  const p = prefix(lang);
  const data = await getAltcoinSeason();
  const label = data ? seasonLabel(data.index) : null;
  const labelText = label === "bitcoin" ? c.bitcoinSeason : label === "altcoin" ? c.altcoinSeason : c.neutral;

  return (
    <div className="paper">
      <LangNav lang={lang} path={ALTSEASON_PATH} />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.h1}</h1>
          <p className="quote-sub">{c.sub}</p>
        </div>
      </div>

      {data ? (
        <section className="block">
          <div className="board">
            <div className="board-cell">
              <span className="b-name">{c.indexLabel}</span>
              <span className="b-value quote-price">{data.index}</span>
              <div className="b-foot">
                <span className="quote-sub">{labelText}</span>
              </div>
            </div>
            <div className="board-cell">
              <span className="b-name">{c.btcReturnLabel}</span>
              <span className={`b-value ${data.btcReturnPct >= 0 ? "chg up" : "chg down"}`}>
                {data.btcReturnPct >= 0 ? "+" : "−"}
                {Math.abs(data.btcReturnPct).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="wire-note">
            {fill(c.outperformingLabel, { M: String(data.outperforming), N: String(data.universeSize) })}
          </p>
          <p className="fineprint">{fill(c.universeNote, { N: String(data.universeSize) })}</p>
        </section>
      ) : (
        <p className="wire-note">{c.unavailable}</p>
      )}

      <AdSlot slot="0000000020" format="leaderboard" />

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP}</p>
        <p>
          {c.relatedPrefix}
          <Link className="statline-link" href={`${p}${DOMINANCE_PATH}`}>{c.dominanceLinkText}</Link>
          {c.relatedSuffix}
        </p>
      </section>

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
