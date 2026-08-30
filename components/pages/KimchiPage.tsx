import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import KimchiView from "@/components/KimchiView";
import LangNav from "@/components/LangNav";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { getKimchiData } from "@/lib/kimchi";
import { localName } from "@/lib/names";
import { kimchiCopy } from "@/lib/page-copy";

const PATH = "/kimchi-premium";

export function kimchiMetadata(lang: Lang): Metadata {
  const c = kimchiCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

export async function KimchiPage({ lang }: { lang: Lang }) {
  const c = kimchiCopy(lang);
  const initial = await getKimchiData();
  const partners = AFFILIATES.filter((p) => p.category === "Crypto Exchanges").slice(0, 3);
  const coinNames = Object.fromEntries(initial.rows.map((r) => [r.symbol, localName(lang, `${r.symbol}-USD`, r.name)]));

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} />

      <KimchiView initial={initial} t={c} coinNames={coinNames} />

      <AdSlot slot="0000000004" format="leaderboard" />

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.whatIsHeading}</h2>
        </div>
        <p>{c.whatIsP1}</p>
        <p>{c.whatIsP2}</p>
        <div className="kicker" style={{ paddingTop: 18 }}>
          <h2 className="kicker-label">{c.howHeading}</h2>
        </div>
        <p>{c.howP}</p>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.tradeHeading}</h2>
          <span className="kicker-note">{c.partnerOffers}</span>
        </div>
        {partners.map((p) => (
          <a className="p-row" key={p.name} href={p.url} target="_blank" rel="noopener noreferrer sponsored">
            <span className="p-main">
              <span className="p-name">{p.name}</span>
              <span className="p-desc">{p.desc}</span>
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
