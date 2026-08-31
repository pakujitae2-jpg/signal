import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { compound } from "@/lib/average-cost";
import { fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { toolsCopy } from "@/lib/tools-copy";

const PATH = "/tools/compound";

export type CompoundParams = { principal?: string; rate?: string; years?: string; freq?: string };

const FREQ: Record<string, number> = { annually: 1, semiannually: 2, quarterly: 4, monthly: 12, daily: 365 };
const DEFAULT_FREQ = "annually";

const num = (v: string | undefined, fallback: number): number => {
  const n = Number(String(v ?? "").replace(/[, ]/g, ""));
  return isFinite(n) && n > 0 ? n : fallback;
};

export function compoundMetadata(lang: Lang): Metadata {
  const c = toolsCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.compTitle,
    description: c.compDescription,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.compTitle, description: c.compDescription, url: canonical },
    twitter: { card: "summary_large_image", title: c.compTitle, description: c.compDescription },
  };
}

export function CompoundPage({ lang, params }: { lang: Lang; params: CompoundParams }) {
  const c = toolsCopy(lang);
  const p = prefix(lang);

  const principal = num(params.principal, 10000);
  const rate = num(params.rate, 7);
  const years = num(params.years, 10);
  const freq = params.freq && FREQ[params.freq] ? params.freq : DEFAULT_FREQ;
  const result = compound(principal, rate, years, FREQ[freq]);

  const faqs = [{ q: c.compFaqQ1, a: c.compFaqA1 }];

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
            { "@type": "ListItem", position: 3, name: c.compH1, item: `${SITE_URL}${p}${PATH}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.compH1}</h1>
          <p className="quote-sub">{c.compSub}</p>
        </div>
      </div>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.formHeading}</h2>
        </div>
        <form className="fx-converter" action={`${p}${PATH}`} method="get">
          <label className="fx-field">
            <span className="fx-cur">{c.compPrincipalLabel}</span>
            <input name="principal" inputMode="decimal" defaultValue={principal} aria-label={c.compPrincipalLabel} />
          </label>
          <label className="fx-field">
            <span className="fx-cur">{c.compRateLabel}</span>
            <input name="rate" inputMode="decimal" defaultValue={rate} aria-label={c.compRateLabel} />
          </label>
          <label className="fx-field">
            <span className="fx-cur">{c.compYearsLabel}</span>
            <input name="years" inputMode="decimal" defaultValue={years} aria-label={c.compYearsLabel} />
          </label>
          <label className="fx-field">
            <span className="fx-cur">{c.compFreqLabel}</span>
            <select name="freq" defaultValue={freq} aria-label={c.compFreqLabel}>
              {Object.keys(FREQ).map((f) => (
                <option key={f} value={f}>
                  {c.compFreqOptions[f as keyof typeof c.compFreqOptions]}
                </option>
              ))}
            </select>
          </label>
          <button className="range-btn active" type="submit">
            {c.formHeading}
          </button>
        </form>
      </section>

      {result && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.resultHeading}</h2>
          </div>
          <div className="board stats-board">
            <div className="board-cell">
              <span className="b-name">{c.compContributedLabel}</span>
              <span className="b-value stat-value">{fmtNum(result.contributed)}</span>
            </div>
            <div className="board-cell">
              <span className="b-name">{c.compInterestLabel}</span>
              <span className="b-value stat-value">{fmtNum(result.interest)}</span>
            </div>
            <div className="board-cell">
              <span className="b-name">{c.compFutureValueLabel}</span>
              <span className="b-value quote-price">{fmtNum(result.futureValue)}</span>
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
        <p>{c.compAboutP}</p>
      </section>

      <footer className="colophon">
        <p className="fine">
          {c.footer} © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
