import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { fill } from "@/lib/feature-copy";
import { fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { getUpbitDirectory, upbitCautionRows, type UpbitCautionFlags, type UpbitMarketRow } from "@/lib/upbit";
import { upbitCopy, type UpbitCopy } from "@/lib/upbit-copy";
import { universeEntry } from "@/lib/universe";

const PATH = "/alerts/upbit-caution";

export function upbitCautionMetadata(lang: Lang): Metadata {
  const c = upbitCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.cautionTitle,
    description: c.cautionDescription,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.cautionTitle, description: c.cautionDescription, url: canonical },
    twitter: { card: "summary_large_image", title: c.cautionTitle, description: c.cautionDescription },
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

function flagLabels(c: UpbitCopy, warning: boolean, caution: UpbitCautionFlags): string[] {
  const out: string[] = [];
  if (warning) out.push(c.flagWarning);
  if (caution.PRICE_FLUCTUATIONS) out.push(c.flagPriceFluctuations);
  if (caution.TRADING_VOLUME_SOARING) out.push(c.flagVolumeSoaring);
  if (caution.DEPOSIT_AMOUNT_SOARING) out.push(c.flagDepositSoaring);
  if (caution.GLOBAL_PRICE_DIFFERENCES) out.push(c.flagGlobalDiff);
  if (caution.CONCENTRATION_OF_SMALL_ACCOUNTS) out.push(c.flagConcentration);
  return out;
}

function Row({ m, p, c }: { m: UpbitMarketRow; p: string; c: UpbitCopy }) {
  const linked = universeEntry(`${m.symbol}-USD`);
  const name = (
    <>
      <span className="cell-name">{m.koreanName}</span>
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
      <td style={{ textAlign: "left" }}>
        {flagLabels(c, m.warning, m.caution).map((f) => (
          <span
            key={f}
            style={{
              display: "inline-block",
              margin: "2px 4px 2px 0",
              fontSize: 11,
              color: "var(--down)",
              border: "1px solid var(--down)",
              borderRadius: 4,
              padding: "1px 5px",
            }}
          >
            {f}
          </span>
        ))}
      </td>
    </tr>
  );
}

export async function UpbitCautionPage({ lang }: { lang: Lang }) {
  const c = upbitCopy(lang);
  const p = prefix(lang);
  const dir = await getUpbitDirectory();
  const rows = upbitCautionRows(dir);

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} crumb={{ href: `${p}/markets/upbit-krw`, label: c.dirLink }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.dirLink, item: `${SITE_URL}${p}/markets/upbit-krw` },
            { "@type": "ListItem", position: 3, name: c.cautionH1, item: `${SITE_URL}${p}${PATH}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.cautionH1}</h1>
          <p className="quote-sub">{fill(c.cautionSub, { n: String(rows.length) })}</p>
        </div>
      </div>

      {dir.source === "live" ? (
        rows.length > 0 ? (
          <section className="block">
            <div className="table-scroll">
              <table className="mkt">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>{c.colName}</th>
                    <th>{c.colPrice}</th>
                    <th>{c.colChange}</th>
                    <th style={{ textAlign: "left" }}>{c.colFlags}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((m) => (
                    <Row key={m.market} m={m} p={p} c={c} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <p className="wire-note">{c.noneFlagged}</p>
        )
      ) : (
        <p className="wire-note">{c.cautionUnavailable}</p>
      )}

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP}</p>
      </section>

      <footer className="colophon">
        <p className="fine">
          {c.footer} © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
