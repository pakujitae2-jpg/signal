import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { fill } from "@/lib/feature-copy";
import { fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { listsCopy } from "@/lib/lists-copy";
import { THEME_LISTS, themeListBySlug, themeListRows } from "@/lib/lists";
import { localName } from "@/lib/names";
import { SITE_URL } from "@/lib/site";

const HUB_PATH = "/list";
const PATH = (slug: string) => `/list/${slug}`;

function Chg({ pct }: { pct: number | null }) {
  if (pct === null || !isFinite(pct)) return <span className="chg flat">—</span>;
  const dir = pct > 0.005 ? "up" : pct < -0.005 ? "down" : "flat";
  return (
    <span className={`chg ${dir}`}>
      {dir === "up" ? "▲" : dir === "down" ? "▼" : "–"} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

export function listsHubMetadata(lang: Lang): Metadata {
  const c = listsCopy(lang);
  const canonical = `${prefix(lang)}${HUB_PATH}`;
  return {
    title: c.hubTitle,
    description: c.hubDescription,
    alternates: { canonical, languages: languageAlternates(HUB_PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.hubTitle, description: c.hubDescription, url: canonical },
    twitter: { card: "summary_large_image", title: c.hubTitle, description: c.hubDescription },
  };
}

export function ListsHub({ lang }: { lang: Lang }) {
  const c = listsCopy(lang);
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
          <p className="quote-sub">{fill(c.hubSub, { n: String(THEME_LISTS.length) })}</p>
        </div>
      </div>
      <section className="block">
        <div className="pair-grid">
          {THEME_LISTS.map((l) => (
            <Link className="pair-link" key={l.slug} href={`${p}${PATH(l.slug)}`}>
              {l.names[lang]}
            </Link>
          ))}
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

export async function listMetadata(lang: Lang, slug: string): Promise<Metadata> {
  const def = themeListBySlug(slug);
  if (!def) return { title: "PNL404" };
  const c = listsCopy(lang);
  const name = def.names[lang];
  const title = fill(c.title, { NAME: name });
  const description = fill(c.description, { NAME: name });
  const path = PATH(slug);
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function ListPage({ lang, slug }: { lang: Lang; slug: string }) {
  const def = themeListBySlug(slug);
  if (!def) notFound();

  const c = listsCopy(lang);
  const p = prefix(lang);
  const path = PATH(slug);
  const name = def.names[lang];
  const rows = await themeListRows(def);

  const faqs = [
    { q: fill(c.faqMembersQ, { NAME: name }), a: fill(c.faqMembersA, { N: String(rows.length || def.symbolsFn().length) }) },
    { q: c.faqRankQ, a: def.kind === "dividend-yield" ? c.faqRankAYield : c.faqRankAChange },
  ];

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}${HUB_PATH}`, label: c.hubH1 }} />
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
            { "@type": "ListItem", position: 2, name: c.hubH1, item: `${SITE_URL}${p}${HUB_PATH}` },
            { "@type": "ListItem", position: 3, name, item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{fill(c.h1, { NAME: name })}</h1>
          <p className="quote-sub">
            {def.intros[lang]} · {fill(c.membersNote, { N: String(rows.length) })}
          </p>
        </div>
      </div>

      {rows.length > 0 ? (
        <section className="block">
          <div className="table-scroll">
            <table className="mkt">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>{c.colName}</th>
                  <th>{c.colPrice}</th>
                  <th>{def.kind === "dividend-yield" ? c.colYield : c.colChange}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.symbol}>
                    <td style={{ textAlign: "left" }}>
                      <Link className="qlink" href={`${p}/quote/${encodeURIComponent(r.symbol)}`}>
                        <span className="cell-name">{localName(lang, r.symbol, r.name)}</span>
                        <span className="sym">{r.symbol}</span>
                      </Link>
                    </td>
                    <td>{fmtNum(r.price, r.currency)}</td>
                    <td>{def.kind === "dividend-yield" ? (r.yieldPct !== undefined ? `${r.yieldPct.toFixed(2)}%` : "—") : <Chg pct={r.changePct} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <p className="wire-note">{c.unavailable}</p>
      )}

      <AdSlot slot="0000000024" format="leaderboard" />

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

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.otherListsHeading}</h2>
        </div>
        <div className="pair-grid">
          {THEME_LISTS.filter((l) => l.slug !== slug).map((l) => (
            <Link className="pair-link" key={l.slug} href={`${p}${PATH(l.slug)}`}>
              {l.names[lang]}
            </Link>
          ))}
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
