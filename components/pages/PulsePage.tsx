import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { CURRENCIES, parseSlug } from "@/lib/fx";
import { fmtNum } from "@/lib/format";
import { pulseCopy } from "@/lib/home-copy";
import { curName, languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { PULSE_LINKS, pulseLinks, pulseText } from "@/lib/pulse";
import { getQuoteDetail } from "@/lib/quote";
import { SITE_URL } from "@/lib/site";
import { universeEntry } from "@/lib/universe";

// One page per question people type, with the live figures this site already
// has, a short answer, an FAQ marked up as FAQPage, and the pages that answer
// next. The prose never contains a number — the figures come from the feed.

export async function pulseMetadata(lang: Lang, slug: string): Promise<Metadata> {
  const text = pulseText(lang, slug);
  if (!text || !pulseLinks(slug)) return { title: "PNL404" };
  const c = pulseCopy(lang);
  const path = `/pulse/${slug}`;
  const title = c.title.replace("{QUERY}", text.query);
  const description = c.description.replace("{QUERY}", text.query);
  return {
    title,
    description,
    alternates: { canonical: `${prefix(lang)}${path}`, languages: languageAlternates(path) },
    openGraph: { type: "article", siteName: "PNL404", title, description, url: `${prefix(lang)}${path}` },
    twitter: { card: "summary_large_image", title, description },
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

export async function PulsePage({ lang, slug }: { lang: Lang; slug: string }) {
  const links = pulseLinks(slug);
  const text = pulseText(lang, slug);
  if (!links || !text) notFound();

  const c = pulseCopy(lang);
  const p = prefix(lang);
  const path = `/pulse/${slug}`;

  const quotes = await Promise.all(
    links.quotes.map(async (symbol) => {
      const detail = await getQuoteDetail(symbol, "1d");
      const entry = universeEntry(symbol);
      const pct =
        detail && detail.price !== null && detail.prevClose
          ? ((detail.price - detail.prevClose) / detail.prevClose) * 100
          : null;
      return {
        symbol,
        name: localName(lang, symbol, entry?.name ?? detail?.name ?? symbol),
        price: detail?.price ?? null,
        currency: entry?.group === "index" ? undefined : (detail?.currency ?? undefined),
        pct,
      };
    })
  );

  const convertLabel = (s: string) => {
    const parsed = parseSlug(s);
    if (!parsed) return s;
    const amount = parsed.amount === null ? "" : `${parsed.amount.toLocaleString("en-US")} `;
    return `${amount}${curName(lang, parsed.base)} → ${curName(lang, parsed.quote)}`;
  };

  const hubLabel = (href: string) => {
    const seg = href.replace(/^\//, "");
    const known: Record<string, string> = {
      "markets/crypto": c.relatedHubsHeading,
    };
    return known[seg] ?? seg;
  };

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}/pulse`, label: c.hubH1 }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: text.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.hubH1, item: `${SITE_URL}${p}/pulse` },
            { "@type": "ListItem", position: 3, name: text.query, item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{text.query}</h1>
          <p className="quote-sub">{text.kicker} · {c.updatedNote}</p>
        </div>
      </div>

      <section className="block prose">
        <p>{text.lead}</p>
      </section>

      {quotes.length > 0 && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.relatedQuotesHeading}</h2>
          </div>
          <div className="board">
            {quotes.map((q) => (
              <Link className="board-cell" key={q.symbol} href={`${p}/quote/${encodeURIComponent(q.symbol)}`}>
                <span className="b-name">{q.name}</span>
                <span className="b-value">{fmtNum(q.price, q.currency)}</span>
                <div className="b-foot">
                  <Chg pct={q.pct} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.faqHeading}</h2>
        </div>
        {text.faqs.map((f) => (
          <div key={f.q}>
            <p>
              <b>{f.q}</b>
            </p>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <AdSlot slot="0000000011" format="leaderboard" />

      {links.convert.length > 0 && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.relatedConvertHeading}</h2>
          </div>
          <div className="pair-grid">
            {links.convert.map((s) => (
              <Link className="pair-link" key={s} href={`${p}/convert/${s}`}>
                {convertLabel(s)}
              </Link>
            ))}
          </div>
        </section>
      )}

      {links.hubs.length > 0 && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.relatedHubsHeading}</h2>
          </div>
          <div className="pair-grid">
            {links.hubs.map((href) => (
              <Link className="pair-link" key={href} href={`${p}${href}`}>
                {hubLabel(href)}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.popularHeading}</h2>
        </div>
        <div className="pair-grid">
          {PULSE_LINKS.filter((x) => x.slug !== slug).map((x) => {
            const t = pulseText(lang, x.slug);
            return t ? (
              <Link className="pair-link" key={x.slug} href={`${p}/pulse/${x.slug}`}>
                {t.query}
              </Link>
            ) : null;
          })}
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}

export function pulseHubMetadata(lang: Lang): Metadata {
  const c = pulseCopy(lang);
  const path = "/pulse";
  return {
    title: c.hubTitle,
    description: c.hubDescription,
    alternates: { canonical: `${prefix(lang)}${path}`, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title: c.hubTitle, description: c.hubDescription, url: `${prefix(lang)}${path}` },
    twitter: { card: "summary_large_image", title: c.hubTitle, description: c.hubDescription },
  };
}

export function PulseHub({ lang }: { lang: Lang }) {
  const c = pulseCopy(lang);
  const p = prefix(lang);
  const pages = PULSE_LINKS.map((x) => ({ slug: x.slug, text: pulseText(lang, x.slug) })).filter(
    (x): x is { slug: string; text: NonNullable<ReturnType<typeof pulseText>> } => Boolean(x.text)
  );

  return (
    <div className="paper">
      <LangNav lang={lang} path="/pulse" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.hubH1, item: `${SITE_URL}${p}/pulse` },
          ],
        }}
      />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.hubH1}</h1>
          <p className="quote-sub">{c.hubSub.replace("{n}", String(pages.length))}</p>
        </div>
      </div>
      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.popularHeading}</h2>
        </div>
        <div className="table-scroll">
          <table className="mkt">
            <tbody>
              {pages.map((x) => (
                <tr key={x.slug}>
                  <td style={{ textAlign: "left" }}>
                    <Link className="qlink" href={`${p}/pulse/${x.slug}`}>
                      <span className="cell-name">{x.text.query}</span>
                      <span className="sym">{x.text.kicker}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
