import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { LANGS, LANG_LABEL, languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { QUOTE_COPY } from "@/lib/quote-copy";
import { SITE_URL } from "@/lib/site";
import { GROUPS, UNIVERSE, byGroup } from "@/lib/universe";

// Directory of every quote page, at /quotes, /ko/quotes and /ja/quotes.

export function quotesMetadata(lang: Lang): Metadata {
  const c = QUOTE_COPY[lang];
  const description = c.dirDesc(UNIVERSE.length);
  const canonical = `${prefix(lang)}/quotes`;
  return {
    title: c.dirTitle,
    description,
    alternates: { canonical, languages: languageAlternates("/quotes") },
    openGraph: { type: "website", siteName: "PNL404", title: c.dirTitle, description, url: canonical },
    twitter: { card: "summary_large_image", title: c.dirTitle, description },
  };
}

export function QuotesDirectory({ lang }: { lang: Lang }) {
  const c = QUOTE_COPY[lang];
  const p = prefix(lang);
  return (
    <div className="paper">
      <header className="subhead">
        <Link className="crumb" href={`${p}/`}>← PNL404</Link>
        <span className="subhead-note">
          {LANGS.map((l, i) => (
            <span key={l}>
              {i > 0 && " · "}
              {l === lang ? <b>{LANG_LABEL[l]}</b> : <Link className="crumb" href={`${prefix(l)}/quotes`} hrefLang={l}>{LANG_LABEL[l]}</Link>}
            </span>
          ))}
        </span>
      </header>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.allQuotes, item: `${SITE_URL}${p}/quotes` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.dirH1}</h1>
          <p className="quote-sub">{c.dirSub(UNIVERSE.length)}</p>
        </div>
      </div>

      <nav className="topnav" aria-label={c.allQuotes}>
        {GROUPS.map((g) => (
          <Link key={g} href={`#${g}`}>{c.groupLabel[g]}</Link>
        ))}
      </nav>

      {GROUPS.map((g) => {
        const list = byGroup(g);
        return (
          <section className="block" key={g} id={g}>
            <div className="kicker">
              <h2 className="kicker-label">{c.groupLabel[g]}</h2>
              <span className="kicker-note">{c.dirCount(list.length)}</span>
            </div>
            <div className="pair-grid">
              {list.map((e) => (
                <Link className="pair-link" key={e.symbol} href={`${p}/quote/${encodeURIComponent(e.symbol)}`}>
                  {localName(lang, e.symbol, e.name)}
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
