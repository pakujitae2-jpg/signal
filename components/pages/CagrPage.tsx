import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { cagrPct } from "@/lib/average-cost";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { toolsCopy } from "@/lib/tools-copy";

const PATH = "/tools/cagr";

export type CagrParams = { start?: string; end?: string; years?: string };

const num = (v: string | undefined, fallback: number): number => {
  const n = Number(String(v ?? "").replace(/[, ]/g, ""));
  return isFinite(n) && n > 0 ? n : fallback;
};

export function cagrMetadata(lang: Lang): Metadata {
  const c = toolsCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.cagrTitle,
    description: c.cagrDescription,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.cagrTitle, description: c.cagrDescription, url: canonical },
    twitter: { card: "summary_large_image", title: c.cagrTitle, description: c.cagrDescription },
  };
}

export function CagrPage({ lang, params }: { lang: Lang; params: CagrParams }) {
  const c = toolsCopy(lang);
  const p = prefix(lang);

  const start = num(params.start, 10000);
  const end = num(params.end, 20000);
  const years = num(params.years, 5);
  const result = cagrPct(start, end, years);

  const faqs = [{ q: c.cagrFaqQ1, a: c.cagrFaqA1 }];

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} crumb={{ href: `${p}/tools`, label: c.hubH1 }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.hubH1, item: `${SITE_URL}${p}/tools` },
            { "@type": "ListItem", position: 3, name: c.cagrH1, item: `${SITE_URL}${p}${PATH}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.cagrH1}</h1>
          <p className="quote-sub">{c.cagrSub}</p>
        </div>
      </div>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.formHeading}</h2>
        </div>
        <form className="fx-converter" action={`${p}${PATH}`} method="get">
          <label className="fx-field">
            <span className="fx-cur">{c.cagrStartLabel}</span>
            <input name="start" inputMode="decimal" defaultValue={start} aria-label={c.cagrStartLabel} />
          </label>
          <label className="fx-field">
            <span className="fx-cur">{c.cagrEndLabel}</span>
            <input name="end" inputMode="decimal" defaultValue={end} aria-label={c.cagrEndLabel} />
          </label>
          <label className="fx-field">
            <span className="fx-cur">{c.cagrYearsLabel}</span>
            <input name="years" inputMode="decimal" defaultValue={years} aria-label={c.cagrYearsLabel} />
          </label>
          <button className="range-btn active" type="submit">
            {c.formHeading}
          </button>
        </form>
      </section>

      {result !== null && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.resultHeading}</h2>
          </div>
          <div className="board stats-board">
            <div className="board-cell">
              <span className="b-name">{c.cagrResultLabel}</span>
              <span className="b-value quote-price">
                {result >= 0 ? "+" : "−"}
                {Math.abs(result).toFixed(2)}%
              </span>
            </div>
          </div>
        </section>
      )}

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.faqHeading}</h2>
        </div>
        {faqs.map((f) => (
          <div key={f.q}>
            <p>
              <b>{f.q}</b>
            </p>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.cagrAboutP}</p>
      </section>

      <footer className="colophon">
        <p className="fine">
          {c.footer} © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
