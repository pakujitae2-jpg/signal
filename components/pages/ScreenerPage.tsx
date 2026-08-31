import type { Metadata } from "next";
import Link from "next/link";
import LangNav from "@/components/LangNav";
import AdSlot from "@/components/AdSlot";
import { fmtNum } from "@/lib/format";
import { getCryptoScreener } from "@/lib/crypto-screener";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { technicalsCopy } from "@/lib/technicals-copy";

const PATH = "/technicals";

export function screenerMetadata(lang: Lang): Metadata {
  const t = technicalsCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: t.screenerTitle,
    description: t.screenerDescription,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: t.screenerTitle, description: t.screenerDescription, url: canonical },
    twitter: { card: "summary_large_image", title: t.screenerTitle, description: t.screenerDescription },
  };
}

function rsiClass(v: number | null): string {
  if (v === null) return "chg flat";
  if (v >= 70) return "chg down";
  if (v <= 30) return "chg up";
  return "chg flat";
}

export async function ScreenerPage({ lang }: { lang: Lang }) {
  const t = technicalsCopy(lang);
  const p = prefix(lang);
  const rows = await getCryptoScreener();

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{t.screenerH1}</h1>
          <p className="quote-sub">{t.screenerSub}</p>
        </div>
      </div>

      {rows.length > 0 ? (
        <section className="block">
          <div className="table-scroll">
            <table className="mkt">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>{t.colCoin}</th>
                  <th>{t.colPrice}</th>
                  <th>{t.colRsi}</th>
                  <th>{t.colSma20}</th>
                  <th>{t.colSma50}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.symbol}>
                    <td style={{ textAlign: "left" }}>
                      <Link className="qlink" href={`${p}/quote/${encodeURIComponent(r.symbol)}/technicals`}>
                        {localName(lang, r.symbol, r.name)}
                      </Link>
                    </td>
                    <td>{fmtNum(r.price, "USD")}</td>
                    <td><span className={rsiClass(r.rsi)}>{r.rsi === null ? "—" : r.rsi.toFixed(1)}</span></td>
                    <td>{r.sma20 === null ? "—" : `${r.price >= r.sma20 ? t.aboveMa : t.belowMa}`}</td>
                    <td>{r.sma50 === null ? "—" : `${r.price >= r.sma50 ? t.aboveMa : t.belowMa}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <p className="wire-note">{t.unavailable}</p>
      )}

      <AdSlot slot="0000000022" format="leaderboard" />

      <footer className="colophon">
        <p className="fine">{t.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
