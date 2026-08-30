import type { Metadata } from "next";
import LangNav from "@/components/LangNav";
import WidgetBuilder, { type WidgetOption } from "@/components/WidgetBuilder";
import { widgetCopy } from "@/lib/feature-copy";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { SITE_URL } from "@/lib/site";
import { TICKER_DEFAULT } from "@/lib/ticker";
import { byGroup } from "@/lib/universe";

const PATH = "/widget";

export function widgetMetadata(lang: Lang): Metadata {
  const c = widgetCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

/** A short, recognisable menu — the full 550 would be unusable as buttons. */
function options(lang: Lang): WidgetOption[] {
  const pick = [
    ...byGroup("index").slice(0, 6),
    ...byGroup("us-stock").slice(0, 14),
    ...byGroup("crypto").slice(0, 8),
    ...byGroup("fx").slice(0, 6),
    ...byGroup("commodity").slice(0, 4),
    ...byGroup("kr-stock").slice(0, 4),
    ...byGroup("jp-stock").slice(0, 4),
  ];
  return pick.map((e) => ({ symbol: e.symbol, name: localName(lang, e.symbol, e.name) }));
}

export function WidgetPage({ lang }: { lang: Lang }) {
  const c = widgetCopy(lang);
  const p = prefix(lang);

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.h1}</h1>
          <p className="quote-sub">{c.sub}</p>
        </div>
      </div>

      <WidgetBuilder
        options={options(lang)}
        defaults={TICKER_DEFAULT}
        origin={SITE_URL}
        embedPath={`${p}/embed`}
        t={{
          previewHeading: c.previewHeading,
          symbolsHeading: c.symbolsHeading,
          symbolsNote: c.symbolsNote,
          snippetHeading: c.snippetHeading,
          copyButton: c.copyButton,
          copiedButton: c.copiedButton,
          openEmbed: c.openEmbed,
          resetButton: c.resetButton,
          emptyNote: c.emptyNote,
        }}
      />

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP}</p>
      </section>

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
