import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import FxConverter from "@/components/FxConverter";
import JsonLd from "@/components/JsonLd";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { CryptoPairPage, cryptoPairMetadata, isCryptoPairSlug } from "./CryptoPairPage";
import { fmtTime } from "@/lib/format";
import { CURRENCIES, CURRENCY_CODES, MAJOR, amountSlug, amountsFor, fxSymbol, getFxRate, pairSlug, parseSlug, type FxRate } from "@/lib/fx";
import { COPY, LANGS, LANG_LABEL, curCountry, curName, languageAlternates, numFmt, prefix, type Lang } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

// One template renders /convert/usd-to-krw, /convert/100-usd-to-krw and the
// per-currency hub /convert/usd in every locale.

const isHub = (slug: string) => /^[a-z]{3}$/.test(slug) && !!CURRENCIES[slug.toUpperCase()];

function meta(lang: Lang, path: string, title: string, description: string): Metadata {
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical, locale: lang === "ko" ? "ko_KR" : lang === "ja" ? "ja_JP" : "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function pairMetadata(lang: Lang, slug: string): Promise<Metadata> {
  const c = COPY[lang];
  const f = numFmt(lang);
  if (isHub(slug)) {
    const code = slug.toUpperCase();
    return meta(lang, `/convert/${slug}`, c.hubTitle(code), c.hubDesc(code, CURRENCY_CODES.length - 1));
  }
  if (isCryptoPairSlug(slug)) return cryptoPairMetadata(lang, slug);
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "PNL404" };
  const { base, quote, amount } = parsed;
  const fx = await getFxRate(base, quote, "1mo");
  const path = `/convert/${slug}`;
  if (amount === null) return meta(lang, path, c.pairTitle(base, quote, f.rate(fx.rate)), c.pairDesc(base, quote, f.rate(fx.rate)));
  const a = f.input(amount);
  const res = f.amount(amount * fx.rate);
  return meta(lang, path, c.amountTitle(a, base, quote, res), c.amountDesc(a, base, quote, res, f.rate(fx.rate)));
}

function TrendChart({ fx, lang }: { fx: FxRate; lang: Lang }) {
  const c = COPY[lang];
  const f = numFmt(lang);
  const values = fx.points.map((p) => p.c);
  if (values.length < 2) return null;
  const w = 720;
  const h = 180;
  const pad = 6;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || min * 0.001 || 1;
  const pts = values
    .map((v, i) => `${(pad + (i / (values.length - 1)) * (w - pad * 2)).toFixed(1)},${(pad + (1 - (v - min) / range) * (h - pad * 2 - 16)).toFixed(1)}`)
    .join(" ");
  const up = values[values.length - 1] >= values[0];
  return (
    <div className="chart-wrap">
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${fx.base}/${fx.quote} ${c.trend}`}>
        <polyline points={pts} fill="none" stroke={up ? "var(--up)" : "var(--down)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x={2} y={h - 4} className="axis-label">{c.daysAgo}</text>
        <text x={w - 2} y={h - 4} className="axis-label" textAnchor="end">{c.todayAxis}</text>
        <text x={w - 2} y={12} className="axis-label" textAnchor="end">{c.highLow(f.rate(max), f.rate(min))}</text>
      </svg>
    </div>
  );
}

export function LangSwitch({ lang, path }: { lang: Lang; path: string }) {
  return (
    <span className="subhead-note">
      {LANGS.map((l, i) => (
        <span key={l}>
          {i > 0 && " · "}
          {l === lang ? <b>{LANG_LABEL[l]}</b> : <Link className="crumb" href={`${prefix(l)}${path}`} hrefLang={l}>{LANG_LABEL[l]}</Link>}
        </span>
      ))}
    </span>
  );
}

export function Header({ lang, path }: { lang: Lang; path: string }) {
  const c = COPY[lang];
  return (
    <header className="subhead">
      <span>
        <Link className="crumb" href="/">← PNL404</Link>
        {" · "}
        <Link className="crumb" href={`${prefix(lang)}/convert`}>{c.currencies}</Link>
      </span>
      <LangSwitch lang={lang} path={path} />
    </header>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="colophon">
      <p className="fine">{COPY[lang].footer} © {new Date().getFullYear()} PNL404</p>
    </footer>
  );
}

function Crumbs({ lang, items }: { lang: Lang; items: { name: string; path: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: COPY[lang].currencies, item: `${SITE_URL}${prefix(lang)}/convert` },
          ...items.map((it, i) => ({ "@type": "ListItem", position: i + 3, name: it.name, item: `${SITE_URL}${prefix(lang)}${it.path}` })),
        ],
      }}
    />
  );
}

function CurrencyHub({ lang, code }: { lang: Lang; code: string }) {
  const c = COPY[lang];
  const p = prefix(lang);
  const others = CURRENCY_CODES.filter((x) => x !== code);
  const majors = MAJOR.filter((x) => x !== code);
  const path = `/convert/${code.toLowerCase()}`;
  return (
    <div className="paper">
      <Header lang={lang} path={path} />
      <Crumbs lang={lang} items={[{ name: `${curName(lang, code)} (${code})`, path }]} />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{curName(lang, code)} ({code})</h1>
          <p className="quote-sub">{CURRENCIES[code].symbol} · {c.usedIn(curCountry(lang, code))}</p>
        </div>
      </div>

      <section className="block">
        <div className="kicker"><h2 className="kicker-label">{c.hubToOthers(code)}</h2></div>
        <div className="pair-grid">
          {others.map((q) => (
            <Link className="pair-link" key={q} href={`${p}/convert/${pairSlug(code, q)}`}>{code} → {q} · {curName(lang, q)}</Link>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="kicker"><h2 className="kicker-label">{c.hubOthersTo(code)}</h2></div>
        <div className="pair-grid">
          {others.map((b) => (
            <Link className="pair-link" key={b} href={`${p}/convert/${pairSlug(b, code)}`}>{b} → {code} · {curName(lang, b)}</Link>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="kicker"><h2 className="kicker-label">{c.popularAmounts}</h2></div>
        <div className="pair-grid">
          {majors.slice(0, 6).flatMap((q) =>
            [1, 100, 1000].map((a) => (
              <Link className="pair-link" key={`${a}-${q}`} href={`${p}/convert/${amountSlug(a, code, q)}`}>
                {c.amountLink(a.toLocaleString("en-US"), code, q)}
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="block prose">
        <div className="kicker"><h2 className="kicker-label">{c.hubAbout(code)}</h2></div>
        <p>{c.hubAboutBody(code)}</p>
      </section>

      <Footer lang={lang} />
    </div>
  );
}

export async function PairPage({ lang, slug }: { lang: Lang; slug: string }) {
  if (isHub(slug)) return <CurrencyHub lang={lang} code={slug.toUpperCase()} />;
  if (isCryptoPairSlug(slug)) return CryptoPairPage({ lang, slug });
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const { base, quote, amount } = parsed;
  const c = COPY[lang];
  const f = numFmt(lang);
  const p = prefix(lang);
  const b = CURRENCIES[base];
  const q = CURRENCIES[quote];
  const fx = await getFxRate(base, quote, "1mo");
  const amt = amount ?? 1;
  const result = amt * fx.rate;
  const dayPct = fx.prevRate ? ((fx.rate - fx.prevRate) / fx.prevRate) * 100 : null;
  const first = fx.points[0];
  const monthPct = first ? ((fx.rate - first.c) / first.c) * 100 : null;
  const dir = (v: number): "up" | "down" | "flat" => (v > 0.005 ? "up" : v < -0.005 ? "down" : "flat");
  const partners = AFFILIATES.filter((x) => x.category === "Money Transfer").slice(0, 3);
  const path = `/convert/${slug}`;
  const a = f.input(amt);

  return (
    <div className="paper">
      <Header lang={lang} path={path} />
      <Crumbs
        lang={lang}
        items={[
          { name: `${base} → ${quote}`, path: `/convert/${pairSlug(base, quote)}` },
          ...(amount !== null ? [{ name: `${a} ${base} → ${quote}`, path }] : []),
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ExchangeRateSpecification",
          currency: base,
          currentExchangeRate: { "@type": "UnitPriceSpecification", price: Number(fx.rate.toPrecision(8)), priceCurrency: quote },
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{amount === null ? c.h1Pair(base, quote) : c.h1Amount(a, base, quote)}</h1>
          <p className="quote-sub">{base}/{quote} · {c.updated} {fmtTime(new Date().toISOString())} UTC</p>
        </div>
        <div className="quote-price-box">
          <span className="quote-price">{a} {base} = {amount === null ? f.rate(result) : f.amount(result)} {quote}</span>
          {dayPct !== null && (
            <span className="quote-chg">
              <span className={`chg ${dir(dayPct)}`}>
                {dir(dayPct) === "up" ? "▲" : dir(dayPct) === "down" ? "▼" : "–"} {Math.abs(dayPct).toFixed(2)}% {c.today}
              </span>
            </span>
          )}
        </div>
      </div>

      {fx.source === "sample" && <p className="wire-note">{c.sampleNote}</p>}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.convert}</h2>
          <span className="kicker-note">
            <Link className="statline-link" href={`${p}/convert/${amount === null ? pairSlug(quote, base) : amountSlug(amount, quote, base)}`}>
              {quote} → {base} ⇄
            </Link>
          </span>
        </div>
        <FxConverter base={base} quote={quote} rate={fx.rate} initialAmount={amt} />
        <p className="statline">
          1 {base} = <b>{f.rate(fx.rate)} {quote}</b> · 1 {quote} = <b>{f.rate(1 / fx.rate)} {base}</b>
        </p>
      </section>

      <section className="block">
        <div className="kicker"><h2 className="kicker-label">{c.popularAmounts}</h2></div>
        <div className="pair-grid">
          {amountsFor(base).map((x) => {
            const s = amountSlug(x, base, quote);
            if (s === slug) return null;
            return (
              <Link className="pair-link" key={s} href={`${p}/convert/${s}`}>{c.amountLink(f.input(x), base, quote)}</Link>
            );
          })}
          {amount !== null && <Link className="pair-link" href={`${p}/convert/${pairSlug(base, quote)}`}>{c.rateLink(base, quote)}</Link>}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.trend}</h2>
          <span className="kicker-note">
            <Link className="statline-link" href={`/quote/${encodeURIComponent(fxSymbol(base, quote).symbol)}`}>{c.interactiveChart}</Link>
          </span>
        </div>
        <TrendChart fx={fx} lang={lang} />
      </section>

      <section className="block">
        <div className="kicker"><h2 className="kicker-label">{c.table}</h2></div>
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>{curName(lang, base)} ({base})</th>
                <th>{curName(lang, quote)} ({quote})</th>
                <th style={{ textAlign: "left" }}>{curName(lang, quote)} ({quote})</th>
                <th>{curName(lang, base)} ({base})</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Each side gets the ladder appropriate to ITS OWN currency's
                // magnitude (e.g. up to 1억 for a KRW column, 10,000 for a USD
                // one), so the two columns can have different row counts.
                const baseAmounts = amountsFor(base);
                const quoteAmounts = amountsFor(quote);
                const rows = Math.max(baseAmounts.length, quoteAmounts.length);
                return Array.from({ length: rows }, (_, i) => {
                  const x = baseAmounts[i];
                  const y = quoteAmounts[i];
                  return (
                    <tr key={i}>
                      {x !== undefined ? (
                        <>
                          <td style={{ textAlign: "left" }}>
                            <Link className="qlink" href={`${p}/convert/${amountSlug(x, base, quote)}`}>{b.symbol}{f.input(x)}</Link>
                          </td>
                          <td>{q.symbol}{f.amount(x * fx.rate)}</td>
                        </>
                      ) : (
                        <>
                          <td />
                          <td />
                        </>
                      )}
                      {y !== undefined ? (
                        <>
                          <td style={{ textAlign: "left" }}>
                            <Link className="qlink" href={`${p}/convert/${amountSlug(y, quote, base)}`}>{q.symbol}{f.input(y)}</Link>
                          </td>
                          <td>{b.symbol}{f.amount(y / fx.rate)}</td>
                        </>
                      ) : (
                        <>
                          <td />
                          <td />
                        </>
                      )}
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot slot="0000000006" format="leaderboard" />

      {partners.length > 0 && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.sendMoney}</h2>
            <span className="kicker-note">{c.partnerOffers}</span>
          </div>
          {partners.map((x) => (
            <a className="p-row" key={x.name} href={x.url} target="_blank" rel="noopener noreferrer sponsored">
              <span className="p-main">
                <span className="p-name">{x.name}</span>
                <span className="p-desc">{x.desc}</span>
              </span>
              <span className="p-arrow" aria-hidden="true">→</span>
            </a>
          ))}
          <p className="fineprint">{AFFILIATE_DISCLOSURE}</p>
        </section>
      )}

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{amount === null ? c.aboutRate : c.amountIn(a, base, quote)}</h2>
        </div>
        <p>
          {amount === null
            ? c.leadPair(base, quote, f.rate(fx.rate), f.rate(1 / fx.rate))
            : c.leadAmount(a, base, quote, f.amount(result), f.rate(fx.rate), f.amount(amt / fx.rate))}
          {dayPct !== null && c.moveDay(dir(dayPct), Math.abs(dayPct).toFixed(2))}
          {monthPct !== null && first && c.moveMonth(dir(monthPct), Math.abs(monthPct).toFixed(2), base, quote, f.rate(first.c))}
        </p>
        <p>{c.aboutBody(base, quote)}</p>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.toOther(base)}</h2>
          <span className="kicker-note"><Link className="statline-link" href={`${p}/convert/${base.toLowerCase()}`}>{c.allRates(base)}</Link></span>
        </div>
        <div className="pair-grid">
          {(MAJOR.includes(base) ? CURRENCY_CODES : MAJOR).filter((x) => x !== base && x !== quote).map((x) => (
            <Link className="pair-link" key={x} href={`${p}/convert/${pairSlug(base, x)}`}>{base} → {x}{lang !== "en" && ` · ${curName(lang, x)}`}</Link>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.otherTo(quote)}</h2>
          <span className="kicker-note"><Link className="statline-link" href={`${p}/convert/${quote.toLowerCase()}`}>{c.allRates(quote)}</Link></span>
        </div>
        <div className="pair-grid">
          {(MAJOR.includes(quote) ? CURRENCY_CODES : MAJOR).filter((x) => x !== base && x !== quote).map((x) => (
            <Link className="pair-link" key={x} href={`${p}/convert/${pairSlug(x, quote)}`}>{x} → {quote}{lang !== "en" && ` · ${curName(lang, x)}`}</Link>
          ))}
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
