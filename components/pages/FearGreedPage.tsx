import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import FearGreedView from "@/components/FearGreedView";
import LangNav from "@/components/LangNav";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { getFearGreed } from "@/lib/feargreed";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { fearGreedCopy } from "@/lib/page-copy";

const PATH = "/fear-greed";

export function fearGreedMetadata(lang: Lang): Metadata {
  const c = fearGreedCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

export async function FearGreedPage({ lang }: { lang: Lang }) {
  const c = fearGreedCopy(lang);
  const p = prefix(lang);
  const initial = await getFearGreed();
  const partners = AFFILIATES.filter((x) => x.category === "Crypto Exchanges").slice(0, 3);

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} />

      <FearGreedView initial={initial} t={c} />

      <AdSlot slot="0000000007" format="leaderboard" />

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.howHeading}</h2>
        </div>
        <p>{c.howP1}</p>
        <p>{c.howP2}</p>
        <p>{c.howP3}</p>
        <p>
          {c.relatedPrefix}
          <Link className="statline-link" href={`${p}/kimchi-premium`}>{c.kimchiLinkText}</Link>
          {c.relatedMiddle}
          <Link className="statline-link" href={`${p}/markets/crypto`}>{c.cryptoLinkText}</Link>
          {c.relatedSuffix}
        </p>
      </section>

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

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
