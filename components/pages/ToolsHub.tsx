import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { toolsCopy } from "@/lib/tools-copy";

export const HUB_PATH = "/tools";

export function toolsHubMetadata(lang: Lang): Metadata {
  const c = toolsCopy(lang);
  const canonical = `${prefix(lang)}${HUB_PATH}`;
  return {
    title: c.hubTitle,
    description: c.hubDescription,
    alternates: { canonical, languages: languageAlternates(HUB_PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.hubTitle, description: c.hubDescription, url: canonical },
    twitter: { card: "summary_large_image", title: c.hubTitle, description: c.hubDescription },
  };
}

export function ToolsHub({ lang }: { lang: Lang }) {
  const c = toolsCopy(lang);
  const p = prefix(lang);
  const links = [
    { href: `${p}/tools/average`, label: c.navAverage },
    { href: `${p}/tools/compound`, label: c.navCompound },
    { href: `${p}/tools/cagr`, label: c.navCagr },
    { href: `${p}/tools/invested`, label: c.navInvested },
    { href: `${p}/dca/BTC-USD`, label: c.navDca },
  ];

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
      <section className="block">
        <div className="pair-grid">
          {links.map((l) => (
            <Link className="pair-link" key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
      </section>
      <footer className="colophon">
        <p className="fine">
          {c.footer} © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
