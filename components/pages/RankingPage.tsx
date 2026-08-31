import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { RANKING_MARKETS, RANKING_METRICS, getRanking, isRankingMarket, isRankingMetric, type RankingMarket, type RankingMetric } from "@/lib/ranking";
import { rankingCopy } from "@/lib/ranking-copy";
import { SITE_URL } from "@/lib/site";

const HUB_PATH = "/ranking";
const PATH = (metric: string, market: string) => `/ranking/${metric}/${market}`;

function fillStr(template: string, vars: Record<string, string>): string {
  return template.replace(/\{([A-Z]+)\}/g, (m, k) => vars[k] ?? m);
}

export function rankingHubMetadata(lang: Lang): Metadata {
  const c = rankingCopy(lang);
  const canonical = `${prefix(lang)}${HUB_PATH}`;
  return {
    title: c.hubTitle,
    description: c.hubDescription,
    alternates: { canonical, languages: languageAlternates(HUB_PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.hubTitle, description: c.hubDescription, url: canonical },
    twitter: { card: "summary_large_image", title: c.hubTitle, description: c.hubDescription },
  };
}

export function RankingHub({ lang }: { lang: Lang }) {
  const c = rankingCopy(lang);
  const p = prefix(lang);
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
          {RANKING_METRICS.flatMap((metric) =>
            RANKING_MARKETS.map((market) => (
              <Link className="pair-link" key={`${metric}-${market}`} href={`${p}${PATH(metric, market)}`}>
                {c.marketLabels[market]} {c.metricLabels[metric]}
              </Link>
            ))
          )}
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

export async function rankingMetadata(lang: Lang, metric: string, market: string): Promise<Metadata> {
  if (!isRankingMetric(metric) || !isRankingMarket(market)) return { title: "PNL404" };
  const c = rankingCopy(lang);
  const vars = { METRIC: c.metricLabels[metric], MARKET: c.marketLabels[market] };
  const title = fillStr(c.title, vars);
  const description = fillStr(c.description, vars);
  const path = PATH(metric, market);
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function RankingPage({ lang, metric, market }: { lang: Lang; metric: string; market: string }) {
  if (!isRankingMetric(metric) || !isRankingMarket(market)) notFound();
  const m: RankingMetric = metric;
  const mk: RankingMarket = market;
  const c = rankingCopy(lang);
  const p = prefix(lang);
  const path = PATH(m, mk);
  const vars = { METRIC: c.metricLabels[m], MARKET: c.marketLabels[mk] };
  const data = await getRanking(m, mk);
  const distanceCol = m === "52-week-high" ? c.colDistanceHigh : c.colDistanceLow;
  const currency = mk === "crypto" ? "USD" : mk === "korea" ? "KRW" : mk === "japan" ? "JPY" : undefined;

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}${HUB_PATH}`, label: c.hubH1 }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.hubH1, item: `${SITE_URL}${p}${HUB_PATH}` },
            { "@type": "ListItem", position: 3, name: fillStr(c.h1, vars), item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{fillStr(c.h1, vars)}</h1>
          <p className="quote-sub">{fillStr(c.description, vars)}</p>
        </div>
      </div>

      {data.rows.length > 0 ? (
        <section className="block">
          <div className="table-scroll">
            <table className="mkt">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>{c.colName}</th>
                  <th>{c.colPrice}</th>
                  <th>{distanceCol}</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.slice(0, 50).map((r) => (
                  <tr key={r.symbol}>
                    <td style={{ textAlign: "left" }}>
                      <Link className="qlink" href={`${p}/quote/${encodeURIComponent(r.symbol)}`}>
                        <span className="cell-name">{localName(lang, r.symbol, r.name)}</span>
                        <span className="sym">{r.symbol}</span>
                      </Link>
                    </td>
                    <td>{fmtNum(r.price, currency)}</td>
                    <td>{r.pctFromExtreme.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <p className="wire-note">{c.unavailable}</p>
      )}

      <AdSlot slot="0000000026" format="leaderboard" />

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP.replace("{METRIC}", c.metricLabels[m])}</p>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.otherHeading}</h2>
        </div>
        <div className="pair-grid">
          {RANKING_METRICS.flatMap((metric2) =>
            RANKING_MARKETS.filter((market2) => `${metric2}-${market2}` !== `${m}-${mk}`).map((market2) => (
              <Link className="pair-link" key={`${metric2}-${market2}`} href={`${p}${PATH(metric2, market2)}`}>
                {c.marketLabels[market2]} {c.metricLabels[metric2]}
              </Link>
            ))
          )}
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
