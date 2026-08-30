import type { Metadata } from "next";
import Link from "next/link";
import LangNav from "@/components/LangNav";
import SearchView from "@/components/SearchView";
import { searchCopy } from "@/lib/feature-copy";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { buildSearchIndex } from "@/lib/search-index";

const PATH = "/search";

export function searchMetadata(lang: Lang): Metadata {
  const c = searchCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
    // The results are built in the browser, so there is nothing here for a
    // crawler to index; the pages themselves are linked from the hubs.
    robots: { index: false, follow: true },
  };
}

export function SearchPage({ lang }: { lang: Lang }) {
  const c = searchCopy(lang);
  const p = prefix(lang);
  const index = buildSearchIndex(lang);
  const browse = index.slice(0, 13); // the hub rows

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.h1}</h1>
          <p className="quote-sub">{c.sub}</p>
        </div>
      </div>

      <SearchView
        index={index}
        t={{
          placeholder: c.placeholder,
          noResults: c.noResults,
          emptyPrompt: c.emptyPrompt,
          resultsCount: c.resultsCount,
          browseHeading: c.browseHeading,
        }}
      />

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.browseHeading}</h2>
        </div>
        <div className="pair-grid">
          {browse.map((h) => (
            <Link className="pair-link" key={h.h} href={h.h}>
              {h.t}
            </Link>
          ))}
          <Link className="pair-link" href={`${p}/quotes`}>
            {c.h1}
          </Link>
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
