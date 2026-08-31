import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import FearGreedView from "@/components/FearGreedView";
import LangNav from "@/components/LangNav";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { fill } from "@/lib/feature-copy";
import { getFearGreed, getFearGreedArchive, getFearGreedOnDate, type FGPoint } from "@/lib/feargreed";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { fearGreedCopy, type FearGreedCopy } from "@/lib/page-copy";

const PATH = "/fear-greed";

export function fearGreedMetadata(lang: Lang): Metadata {
  const c = fearGreedCopy(lang);
  const canonical = `${prefix(lang)}${PATH}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(PATH) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

// The API classifies in English; map it onto the locale (mirrors the same
// small lookup inside components/FearGreedView.tsx, which is client-only).
function zoneText(c: FearGreedCopy, label: string): string {
  return ({ "Extreme Fear": c.extremeFear, Fear: c.fear, Neutral: c.neutral, Greed: c.greed, "Extreme Greed": c.extremeGreed } as Record<string, string>)[label] ?? label;
}

function dateStr(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}

export async function FearGreedPage({ lang }: { lang: Lang }) {
  const c = fearGreedCopy(lang);
  const p = prefix(lang);
  const initial = await getFearGreed();
  const archive = await getFearGreedArchive();
  const partners = AFFILIATES.filter((x) => x.category === "Crypto Exchanges").slice(0, 3);

  return (
    <div className="paper">
      <LangNav lang={lang} path={PATH} />

      <FearGreedView initial={initial} t={c} />

      <AdSlot slot="0000000007" format="leaderboard" />

      {archive && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{c.allTimeHeading}</h2>
          </div>
          <div className="board">
            <Link className="board-cell" href={`${p}${PATH}/${dateStr(archive.allTimeHigh.t)}`}>
              <span className="b-name">{c.allTimeHigh}</span>
              <span className="b-value">{archive.allTimeHigh.value}</span>
              <div className="b-foot">
                <span className="chg flat">{zoneText(c, archive.allTimeHigh.label)} · {dateStr(archive.allTimeHigh.t)}</span>
              </div>
            </Link>
            <Link className="board-cell" href={`${p}${PATH}/${dateStr(archive.allTimeLow.t)}`}>
              <span className="b-name">{c.allTimeLow}</span>
              <span className="b-value">{archive.allTimeLow.value}</span>
              <div className="b-foot">
                <span className="chg flat">{zoneText(c, archive.allTimeLow.label)} · {dateStr(archive.allTimeLow.t)}</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.howHeading}</h2>
        </div>
        <p>{c.howP1}</p>
        <p>{c.howP2}</p>
        <p>{c.howP3}</p>
        <p>
          {c.relatedPrefix}
          <Link className="statline-link" href={`${p}/kimchi-premium`}>{c.kimchiLinkText}</Link>
          {c.relatedMiddle}
          <Link className="statline-link" href={`${p}/markets/crypto`}>{c.cryptoLinkText}</Link>
          {c.relatedSuffix}
        </p>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.tradeHeading}</h2>
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

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}

// /fear-greed/[date] permalinks, rendered straight from the archive. This
// intentionally has no sample-data fallback anywhere in its path (see
// getFearGreedArchive/getFearGreedOnDate in lib/feargreed.ts): a permalink
// for a specific historical date must 404 rather than render a synthesized
// reading at a URL someone might bookmark or cite.

export async function fearGreedDateMetadata(lang: Lang, date: string): Promise<Metadata> {
  const c = fearGreedCopy(lang);
  const point = await getFearGreedOnDate(date);
  if (!point) return { title: "PNL404" };
  const title = fill(c.dateTitle, { DATE: date });
  const description = fill(c.dateDescription, { DATE: date });
  const path = `${PATH}/${date}`;
  return {
    title,
    description,
    alternates: { canonical: `${prefix(lang)}${path}`, languages: languageAlternates(path) },
    openGraph: { type: "article", siteName: "PNL404", title, description, url: `${prefix(lang)}${path}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function FearGreedDatePage({ lang, date }: { lang: Lang; date: string }) {
  const c = fearGreedCopy(lang);
  const p = prefix(lang);
  const point: FGPoint | null = await getFearGreedOnDate(date);
  if (!point) notFound();

  return (
    <div className="paper">
      <LangNav lang={lang} path={`${PATH}/${date}`} crumb={{ href: `${p}${PATH}`, label: c.h1 }} />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{fill(c.dateH1, { DATE: date })}</h1>
        </div>
      </div>

      <section className="block">
        <div className="board">
          <div className="board-cell">
            <span className="b-name">{c.h1}</span>
            <span className="b-value">{point.value}</span>
            <div className="b-foot">
              <span className="chg flat">{zoneText(c, point.label)}</span>
            </div>
          </div>
        </div>
      </section>

      <AdSlot slot="0000000021" format="leaderboard" />

      <section className="block">
        <div className="pair-grid">
          <Link className="pair-link" href={`${p}${PATH}`}>
            {c.backToToday}
          </Link>
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
