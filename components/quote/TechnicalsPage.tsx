import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { isValidSymbol } from "@/lib/quote";
import { getDailyBars } from "@/lib/technicals-data";
import {
  MA_PERIODS,
  adx,
  atr,
  bollinger,
  cci,
  hasEnoughForMa200,
  macd,
  movingAverages,
  pivotPoints,
  rsi,
  stochastic,
  williamsR,
} from "@/lib/technicals";
import { technicalsCopy } from "@/lib/technicals-copy";
import { SITE_URL } from "@/lib/site";
import { universeEntry } from "@/lib/universe";
import { displaySymbol } from "./QuotePage";

const PATH = (symbol: string) => `/quote/${encodeURIComponent(symbol)}/technicals`;

function region(t: ReturnType<typeof technicalsCopy>, value: number, low: number, high: number): string {
  if (value <= low) return t.oversold;
  if (value >= high) return t.overbought;
  return t.neutral;
}

export async function technicalsMetadata(lang: Lang, symbol: string): Promise<Metadata> {
  if (!isValidSymbol(symbol)) return { title: "PNL404" };
  const t = technicalsCopy(lang);
  const name = localName(lang, symbol, universeEntry(symbol)?.name ?? displaySymbol(symbol));
  const title = `${name} ${t.h1Suffix}`;
  const description = `${name} — ${t.sub}`;
  const path = PATH(symbol);
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function TechnicalsPage({ lang, symbol }: { lang: Lang; symbol: string }) {
  if (!isValidSymbol(symbol)) notFound();
  const sym = symbol.toUpperCase();
  const t = technicalsCopy(lang);
  const p = prefix(lang);
  const path = PATH(symbol);
  const entry = universeEntry(sym);
  const name = localName(lang, sym, entry?.name ?? displaySymbol(sym));
  const currency = entry?.group === "index" ? undefined : sym.endsWith(".KS") || sym.endsWith(".KQ") ? "KRW" : sym.endsWith(".T") ? "JPY" : "USD";

  const data = await getDailyBars(sym);

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}/quote/${encodeURIComponent(sym)}`, label: name }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${p}/quote/${encodeURIComponent(sym)}` },
            { "@type": "ListItem", position: 3, name: t.h1Suffix, item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{name} {t.h1Suffix}</h1>
          <p className="quote-sub">{t.sub}</p>
        </div>
      </div>

      {data.source !== "live" || data.bars.length < 30 ? (
        <p className="wire-note">{t.unavailable}</p>
      ) : (
        <TechnicalsBody data={data} currency={currency} t={t} p={p} />
      )}

      <section className="block">
        <div className="pair-grid">
          <Link className="pair-link" href={`${p}/quote/${encodeURIComponent(sym)}`}>
            {t.quoteLinkText}
          </Link>
          <Link className="pair-link" href={`${p}/technicals`}>
            {t.screenerLinkText}
          </Link>
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{t.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}

function TechnicalsBody({
  data,
  currency,
  t,
  p,
}: {
  data: Awaited<ReturnType<typeof getDailyBars>>;
  currency: string | undefined;
  t: ReturnType<typeof technicalsCopy>;
  p: string;
}) {
  const bars = data.bars;
  const closes = bars.map((b) => b.c);
  const price = closes[closes.length - 1];
  const asOfDate = new Date(bars[bars.length - 1].t).toISOString().slice(0, 10);

  const rsiVal = rsi(closes);
  const st = stochastic(bars);
  const wr = williamsR(bars);
  const cciVal = cci(bars);
  const macdVal = macd(closes);
  const adxVal = adx(bars);
  const atrVal = atr(bars);
  const mas = movingAverages(closes);
  const smaCount = mas.filter((m) => m.sma !== null);
  const aboveCount = smaCount.filter((m) => price > m.sma!).length;
  const bb = bollinger(closes);
  const pivots = pivotPoints(bars[bars.length - 2] ?? bars[bars.length - 1]);
  const ma200Ready = hasEnoughForMa200(bars);

  return (
    <>
      <p className="fineprint">{t.asOf} {asOfDate}</p>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.momentumHeading}</h2>
        </div>
        <div className="board">
          {rsiVal !== null && (
            <div className="board-cell">
              <span className="b-name">{t.rsiLabel}</span>
              <span className="b-value quote-price">{rsiVal.toFixed(1)}</span>
              <div className="b-foot"><span className="chg flat">{region(t, rsiVal, 30, 70)}</span></div>
            </div>
          )}
          {st && (
            <div className="board-cell">
              <span className="b-name">{t.stochLabel}</span>
              <span className="b-value quote-price">{st.k.toFixed(1)} / {st.d.toFixed(1)}</span>
              <div className="b-foot"><span className="chg flat">{region(t, st.k, 20, 80)}</span></div>
            </div>
          )}
          {wr !== null && (
            <div className="board-cell">
              <span className="b-name">{t.williamsLabel}</span>
              <span className="b-value quote-price">{wr.toFixed(1)}</span>
              <div className="b-foot"><span className="chg flat">{region(t, wr, -80, -20)}</span></div>
            </div>
          )}
          {cciVal !== null && (
            <div className="board-cell">
              <span className="b-name">{t.cciLabel}</span>
              <span className="b-value quote-price">{cciVal.toFixed(1)}</span>
              <div className="b-foot"><span className="chg flat">{region(t, cciVal, -100, 100)}</span></div>
            </div>
          )}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.trendHeading}</h2>
        </div>
        <div className="board">
          {macdVal && (
            <div className="board-cell">
              <span className="b-name">{t.macdLabel}</span>
              <span className={`b-value ${macdVal.histogram >= 0 ? "chg up" : "chg down"}`}>{macdVal.macd.toFixed(2)}</span>
              <div className="b-foot"><span className="chg flat">{t.macdHist}: {macdVal.histogram >= 0 ? "+" : ""}{macdVal.histogram.toFixed(2)}</span></div>
            </div>
          )}
          {adxVal && (
            <div className="board-cell">
              <span className="b-name">{t.adxLabel}</span>
              <span className="b-value quote-price">{adxVal.adx.toFixed(1)}</span>
              <div className="b-foot"><span className="chg flat">{adxVal.adx >= 25 ? t.strongTrend : t.weakTrend} · +DI {adxVal.plusDI.toFixed(0)} / -DI {adxVal.minusDI.toFixed(0)}</span></div>
            </div>
          )}
          {atrVal !== null && (
            <div className="board-cell">
              <span className="b-name">{t.atrLabel}</span>
              <span className="b-value quote-price">{fmtNum(atrVal, currency)}</span>
            </div>
          )}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.maHeading}</h2>
        </div>
        {smaCount.length > 0 && (
          <p className="statline">{t.maSummary.replace("{N}", String(aboveCount)).replace("{TOTAL}", String(smaCount.length))}</p>
        )}
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>{t.colPeriod}</th>
                <th>{t.colSma}</th>
                <th>{t.colEma}</th>
              </tr>
            </thead>
            <tbody>
              {mas.map((m) => (
                <tr key={m.period}>
                  <td style={{ textAlign: "left" }}>{m.period}</td>
                  <td>{m.sma === null ? (m.period === 200 && !ma200Ready ? t.ma200Gated : "—") : fmtNum(m.sma, currency)}</td>
                  <td>{m.ema === null ? "—" : fmtNum(m.ema, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {bb && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{t.bollingerHeading}</h2>
          </div>
          <div className="board">
            <div className="board-cell"><span className="b-name">{t.colUpper}</span><span className="b-value stat-value">{fmtNum(bb.upper, currency)}</span></div>
            <div className="board-cell"><span className="b-name">{t.colMiddle}</span><span className="b-value stat-value">{fmtNum(bb.middle, currency)}</span></div>
            <div className="board-cell"><span className="b-name">{t.colLower}</span><span className="b-value stat-value">{fmtNum(bb.lower, currency)}</span></div>
          </div>
        </section>
      )}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.pivotsHeading}</h2>
        </div>
        <p className="fineprint">{t.pivotsNote}</p>
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>{t.colMethod}</th>
                <th>R3</th><th>R2</th><th>R1</th><th>P</th><th>S1</th><th>S2</th><th>S3</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Classic", pivots.classic],
                  ["Fibonacci", pivots.fibonacci],
                  ["Camarilla", pivots.camarilla],
                  ["Woodie", pivots.woodie],
                  ["Demark", pivots.demark],
                ] as const
              ).map(([label, lv]) => (
                <tr key={label}>
                  <td style={{ textAlign: "left" }}>{label}</td>
                  <td>{lv.r3 === undefined ? "—" : fmtNum(lv.r3, currency)}</td>
                  <td>{lv.r2 === undefined ? "—" : fmtNum(lv.r2, currency)}</td>
                  <td>{fmtNum(lv.r1, currency)}</td>
                  <td>{fmtNum(lv.p, currency)}</td>
                  <td>{fmtNum(lv.s1, currency)}</td>
                  <td>{lv.s2 === undefined ? "—" : fmtNum(lv.s2, currency)}</td>
                  <td>{lv.s3 === undefined ? "—" : fmtNum(lv.s3, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
