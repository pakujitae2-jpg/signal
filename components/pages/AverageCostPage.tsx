import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { AVERAGE_MAX_LOTS, computeAverage, solveForTargetAverage, type BuyLot } from "@/lib/average-cost";
import { fill } from "@/lib/feature-copy";
import { fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { isValidSymbol, getQuoteDetail } from "@/lib/quote";
import { SITE_URL } from "@/lib/site";
import { toolsCopy } from "@/lib/tools-copy";
import { universeEntry } from "@/lib/universe";

const PATH = "/tools/average";

export type AverageParams = {
  p1?: string; q1?: string; p2?: string; q2?: string; p3?: string; q3?: string;
  p4?: string; q4?: string; p5?: string; q5?: string;
  target?: string; atprice?: string; symbol?: string;
};

const num = (v: string | undefined): number => {
  const n = Number(String(v ?? "").replace(/[, ]/g, ""));
  return isFinite(n) && n > 0 ? n : 0;
};

export function averageMetadata(lang: Lang): Metadata {
  const c = toolsCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.avgTitle,
    description: c.avgDescription,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.avgTitle, description: c.avgDescription, url: canonical },
    twitter: { card: "summary_large_image", title: c.avgTitle, description: c.avgDescription },
  };
}

export async function AverageCostPage({ lang, params }: { lang: Lang; params: AverageParams }) {
  const c = toolsCopy(lang);
  const p = prefix(lang);

  const lots: BuyLot[] = Array.from({ length: AVERAGE_MAX_LOTS }, (_, i) => ({
    price: num(params[`p${i + 1}` as keyof AverageParams]),
    qty: num(params[`q${i + 1}` as keyof AverageParams]),
  }));
  const result = computeAverage(lots);

  const targetAvg = num(params.target);
  const atPrice = num(params.atprice);
  const solved = result && targetAvg > 0 && atPrice > 0 ? solveForTargetAverage(result, atPrice, targetAvg) : null;

  const symbolRaw = (params.symbol ?? "").trim();
  const symbol = symbolRaw && isValidSymbol(symbolRaw) ? symbolRaw.toUpperCase() : null;
  const entry = symbol ? universeEntry(symbol) : undefined;
  const detail = symbol ? await getQuoteDetail(symbol, "1d") : null;
  const livePrice = detail && detail.source === "live" ? detail.price : null;
  const livePl = result && livePrice !== null ? (livePrice - result.avgCost) * result.totalQty : null;

  const faqs = [
    { q: c.avgFaqQ1, a: fill(c.avgFaqA1, { N: String(lots.filter((l) => l.price > 0 && l.qty > 0).length || AVERAGE_MAX_LOTS) }) },
    { q: c.avgFaqQ2, a: c.avgFaqA2 },
  ];

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
            { "@type": "ListItem", position: 3, name: c.avgH1, item: `${SITE_URL}${p}${PATH}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.avgH1}</h1>
          <p className="quote-sub">{c.avgSub}</p>
        </div>
      </div>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.formHeading}</h2>
        </div>
        <form className="fx-converter" action={`${p}${PATH}`} method="get" style={{ flexWrap: "wrap" }}>
          {Array.from({ length: AVERAGE_MAX_LOTS }, (_, i) => i + 1).map((n) => (
            <label className="fx-field" key={n}>
              <span className="fx-cur">
                {c.avgPriceLabel} {n}
              </span>
              <input name={`p${n}`} inputMode="decimal" defaultValue={num(params[`p${n}` as keyof AverageParams]) || ""} aria-label={`${c.avgPriceLabel} ${n}`} />
            </label>
          ))}
          {Array.from({ length: AVERAGE_MAX_LOTS }, (_, i) => i + 1).map((n) => (
            <label className="fx-field" key={`q${n}`}>
              <span className="fx-cur">
                {c.avgQtyLabel} {n}
              </span>
              <input name={`q${n}`} inputMode="decimal" defaultValue={num(params[`q${n}` as keyof AverageParams]) || ""} aria-label={`${c.avgQtyLabel} ${n}`} />
            </label>
          ))}
          <label className="fx-field">
            <span className="fx-cur">{c.avgSymbolLabel}</span>
            <input name="symbol" defaultValue={symbol ?? ""} aria-label={c.avgSymbolLabel} />
          </label>
          <input type="hidden" name="target" value={targetAvg || ""} />
          <input type="hidden" name="atprice" value={atPrice || ""} />
          <button className="range-btn active" type="submit">
            {c.formHeading}
          </button>
        </form>
      </section>

      {result ? (
        <>
          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.resultHeading}</h2>
            </div>
            <div className="board stats-board">
              <div className="board-cell">
                <span className="b-name">{c.avgTotalQtyLabel}</span>
                <span className="b-value stat-value">{result.totalQty.toLocaleString(lang === "en" ? "en-US" : lang === "ko" ? "ko-KR" : "ja-JP")}</span>
              </div>
              <div className="board-cell">
                <span className="b-name">{c.avgTotalCostLabel}</span>
                <span className="b-value stat-value">{fmtNum(result.totalCost, detail?.currency)}</span>
              </div>
              <div className="board-cell">
                <span className="b-name">{c.avgAvgCostLabel}</span>
                <span className="b-value quote-price">{fmtNum(result.avgCost, detail?.currency)}</span>
              </div>
              {symbol && (
                <div className="board-cell">
                  <span className="b-name">{c.avgLivePriceLabel}</span>
                  <span className="b-value stat-value">{livePrice !== null ? fmtNum(livePrice, detail?.currency) : "—"}</span>
                </div>
              )}
              {symbol && livePl !== null && (
                <div className="board-cell">
                  <span className="b-name">{c.avgLivePlLabel}</span>
                  <span className="b-value stat-value">
                    {livePl >= 0 ? "+" : "−"}
                    {fmtNum(Math.abs(livePl), detail?.currency)}
                  </span>
                </div>
              )}
            </div>
            {symbol && livePrice === null && <p className="wire-note">{c.unavailable}</p>}
            {symbol && entry && <p className="wire-note">{localName(lang, symbol, entry.name)}</p>}
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{c.avgTargetHeading}</h2>
            </div>
            <form className="fx-converter" action={`${p}${PATH}`} method="get">
              {Array.from({ length: AVERAGE_MAX_LOTS }, (_, i) => i + 1).map((n) => (
                <input key={n} type="hidden" name={`p${n}`} value={num(params[`p${n}` as keyof AverageParams]) || ""} />
              ))}
              {Array.from({ length: AVERAGE_MAX_LOTS }, (_, i) => i + 1).map((n) => (
                <input key={`hq${n}`} type="hidden" name={`q${n}`} value={num(params[`q${n}` as keyof AverageParams]) || ""} />
              ))}
              <input type="hidden" name="symbol" value={symbol ?? ""} />
              <label className="fx-field">
                <span className="fx-cur">{c.avgTargetLabel}</span>
                <input name="target" inputMode="decimal" defaultValue={targetAvg || ""} aria-label={c.avgTargetLabel} />
              </label>
              <label className="fx-field">
                <span className="fx-cur">{c.avgTargetAtPriceLabel}</span>
                <input name="atprice" inputMode="decimal" defaultValue={atPrice || ""} aria-label={c.avgTargetAtPriceLabel} />
              </label>
              <button className="range-btn active" type="submit">
                {c.formHeading}
              </button>
            </form>
            {targetAvg > 0 && atPrice > 0 && (
              <p className="wire-note">
                {solved !== null
                  ? fill(c.avgTargetResult, { N: solved.toLocaleString(lang === "en" ? "en-US" : lang === "ko" ? "ko-KR" : "ja-JP", { maximumFractionDigits: 2 }), PRICE: fmtNum(atPrice) })
                  : c.avgTargetUnreachable}
              </p>
            )}
          </section>
        </>
      ) : null}

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
        <p>{c.avgAboutP}</p>
      </section>

      <footer className="colophon">
        <p className="fine">
          {c.footer} © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
