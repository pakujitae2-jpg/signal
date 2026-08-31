import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { fill } from "@/lib/feature-copy";
import { fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { getUpbitDirectory, type UpbitMarketRow } from "@/lib/upbit";
import { upbitCopy } from "@/lib/upbit-copy";
import { universeEntry } from "@/lib/universe";

const PATH = "/markets/upbit-krw";

export function upbitMarketsMetadata(lang: Lang): Metadata {
  const c = upbitCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.dirTitle,
    description: c.dirDescription,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.dirTitle, description: c.dirDescription, url: canonical },
    twitter: { card: "summary_large_image", title: c.dirTitle, description: c.dirDescription },
  };
}

function Chg({ pct }: { pct: number | null }) {
  if (pct === null || !isFinite(pct)) return <span className="chg flat">—</span>;
  const dir = pct > 0.005 ? "up" : pct < -0.005 ? "down" : "flat";
  return (
    <span className={`chg ${dir}`}>
      {dir === "up" ? "▲" : dir === "down" ? "▼" : "–"} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

function Row({ m, lang, p, badge }: { m: UpbitMarketRow; lang: Lang; p: string; badge: string }) {
  const linked = universeEntry(`${m.symbol}-USD`);
  const name = (
    <>
      <span className="cell-name">
        {m.koreanName}{" "}
        {m.hasFlag && (
          <span style={{ fontSize: 11, color: "var(--down)", border: "1px solid var(--down)", borderRadius: 4, padding: "1px 5px" }}>{badge}</span>
        )}
      </span>
      <span className="sym">{m.symbol}</span>
    </>
  );
  return (
    <tr key={m.market}>
      <td style={{ textAlign: "left" }}>{linked ? <Link className="qlink" href={`${p}/quote/${m.symbol}-USD`}>{name}</Link> : name}</td>
      <td>{fmtNum(m.price, "KRW")}</td>
      <td>
        <Chg pct={m.changePct} />
      </td>
      <td>{m.volume24hKrw !== null ? `₩${m.volume24hKrw.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 })}` : "—"}</td>
    </tr>
  );
}

export async function UpbitMarketsPage({ lang }: { lang: Lang }) {
  const c = upbitCopy(lang);
  const p = prefix(lang);
  const dir = await getUpbitDirectory();

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.dirH1, item: `${SITE_URL}${p}${PATH}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.dirH1}</h1>
          <p className="quote-sub">{fill(c.dirSub, { n: String(dir.markets.length) })}</p>
        </div>
      </div>

      {dir.source === "live" ? (
        <section className="block">
          <div className="table-scroll">
            <table className="mkt">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>{c.colName}</th>
                  <th>{c.colPrice}</th>
                  <th>{c.colChange}</th>
                  <th>{c.colVolume}</th>
                </tr>
              </thead>
              <tbody>
                {dir.markets.map((m) => (
                  <Row key={m.market} m={m} lang={lang} p={p} badge={c.flaggedBadge} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <p className="wire-note">{c.dirUnavailable}</p>
      )}

      <section className="block">
        <div className="pair-grid">
          <Link className="pair-link" href={`${p}/alerts/upbit-caution`}>
            {c.cautionLink}
          </Link>
          <Link className="pair-link" href={`${p}/kimchi-premium`}>
            {c.kimchiLink}
          </Link>
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
