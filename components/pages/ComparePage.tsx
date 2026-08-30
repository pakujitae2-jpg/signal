import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import LangNav from "@/components/LangNav";
import { COMPARE_PAIRS, parseCompare } from "@/lib/compare";
import { compareCopy, fill } from "@/lib/feature-copy";
import { fmtNum } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import { getQuoteDetail, type QuoteDetail } from "@/lib/quote";
import { SITE_URL } from "@/lib/site";
import type { UniverseEntry } from "@/lib/universe";

// /compare/<a>-vs-<b>: two symbols side by side, rebased so the percentages
// are directly comparable even when the two trade in different currencies.

type Side = {
  entry: UniverseEntry;
  name: string;
  day: QuoteDetail | null;
  year: QuoteDetail | null;
};

const DAY = 86400_000;

/** Percent change from the point nearest `daysBack` to the latest point. */
function perf(detail: QuoteDetail | null, daysBack: number): number | null {
  const pts = detail?.points ?? [];
  if (pts.length < 2) return null;
  const last = pts[pts.length - 1];
  const target = last.t - daysBack * DAY;
  let base = pts[0];
  for (const p of pts) {
    if (p.t <= target) base = p;
    else break;
  }
  if (base.t >= last.t || base.c <= 0) return null;
  return ((last.c - base.c) / base.c) * 100;
}

const pctText = (v: number | null) => (v === null ? "—" : `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)}%`);

function Pct({ v }: { v: number | null }) {
  if (v === null) return <span className="chg flat">—</span>;
  const dir = v > 0.005 ? "up" : v < -0.005 ? "down" : "flat";
  return (
    <span className={`chg ${dir}`}>
      {dir === "up" ? "▲" : dir === "down" ? "▼" : "–"} {Math.abs(v).toFixed(2)}%
    </span>
  );
}

async function loadSide(lang: Lang, entry: UniverseEntry): Promise<Side> {
  const [day, year] = await Promise.all([getQuoteDetail(entry.symbol, "1d"), getQuoteDetail(entry.symbol, "1y")]);
  return { entry, name: localName(lang, entry.symbol, entry.name), day, year };
}

export async function compareMetadata(lang: Lang, slug: string): Promise<Metadata> {
  const parsed = parseCompare(slug);
  if (!parsed) return { title: "PNL404" };
  const c = compareCopy(lang);
  const A = localName(lang, parsed.left.symbol, parsed.left.name);
  const B = localName(lang, parsed.right.symbol, parsed.right.name);
  const vars = { A, B };
  const path = `/compare/${slug}`;
  const title = fill(c.title, vars);
  const description = fill(c.description, vars);
  return {
    title,
    description,
    alternates: { canonical: `${prefix(lang)}${path}`, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: `${prefix(lang)}${path}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Both series rebased to 0% at the start of the window. */
function RebasedChart({ left, right, note }: { left: Side; right: Side; note: string }) {
  const a = left.year?.points ?? [];
  const b = right.year?.points ?? [];
  if (a.length < 2 || b.length < 2) return null;
  const w = 720;
  const h = 220;
  const padT = 10;
  const padB = 22;
  const rebase = (pts: { t: number; c: number }[]) => {
    const base = pts[0].c;
    return pts.map((p) => ({ t: p.t, v: ((p.c - base) / base) * 100 }));
  };
  const ra = rebase(a);
  const rb = rebase(b);
  const all = [...ra, ...rb];
  const min = Math.min(...all.map((p) => p.v), 0);
  const max = Math.max(...all.map((p) => p.v), 0);
  const span = max - min || 1;
  const t0 = Math.min(ra[0].t, rb[0].t);
  const t1 = Math.max(ra[ra.length - 1].t, rb[rb.length - 1].t);
  const x = (t: number) => ((t - t0) / (t1 - t0 || 1)) * w;
  const y = (v: number) => padT + (1 - (v - min) / span) * (h - padT - padB);
  const line = (pts: { t: number; v: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join("");

  return (
    <div className="chart-wrap">
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${left.name} vs ${right.name}`}>
        <line x1={0} x2={w} y1={y(0)} y2={y(0)} stroke="var(--rule)" strokeWidth="1" strokeDasharray="3 4" />
        <path d={line(ra)} fill="none" stroke="var(--up)" strokeWidth="2" strokeLinejoin="round" />
        <path d={line(rb)} fill="none" stroke="var(--down)" strokeWidth="2" strokeLinejoin="round" />
        <text x={2} y={y(max) + 10} className="axis-label">{pctText(max)}</text>
        <text x={2} y={y(min) - 3} className="axis-label">{pctText(min)}</text>
        <text x={w - 2} y={h - 6} className="axis-label" textAnchor="end">{note}</text>
      </svg>
      <p className="statline">
        <span className="chg up">■</span> {left.name} &nbsp;·&nbsp; <span className="chg down">■</span> {right.name}
      </p>
    </div>
  );
}

export async function ComparePage({ lang, slug }: { lang: Lang; slug: string }) {
  const parsed = parseCompare(slug);
  if (!parsed) notFound();
  const c = compareCopy(lang);
  const p = prefix(lang);
  const [left, right] = await Promise.all([loadSide(lang, parsed.left), loadSide(lang, parsed.right)]);

  const dayPct = (s: Side) =>
    s.day && s.day.price !== null && s.day.prevClose ? ((s.day.price - s.day.prevClose) / s.day.prevClose) * 100 : null;

  const l1y = perf(left.year, 365);
  const r1y = perf(right.year, 365);
  let lead = c.leadNoData;
  if (l1y !== null && r1y !== null) {
    if (Math.abs(l1y - r1y) < 0.5) {
      lead = fill(c.leadTie, { LEFTPCT: pctText(l1y), RIGHTPCT: pctText(r1y) });
    } else {
      const leftWins = l1y > r1y;
      lead = fill(c.leadBoth, {
        WINNER: leftWins ? left.name : right.name,
        WINNERPCT: pctText(leftWins ? l1y : r1y),
        LOSER: leftWins ? right.name : left.name,
        LOSERPCT: pctText(leftWins ? r1y : l1y),
      });
    }
  }

  const cur = (s: Side) => (s.entry.group === "index" ? undefined : (s.day?.currency ?? undefined));
  const rows: { label: string; a: React.ReactNode; b: React.ReactNode }[] = [
    { label: c.rowPrice, a: fmtNum(left.day?.price ?? null, cur(left)), b: fmtNum(right.day?.price ?? null, cur(right)) },
    { label: c.rowDayChange, a: <Pct v={dayPct(left)} />, b: <Pct v={dayPct(right)} /> },
    { label: c.row1m, a: <Pct v={perf(left.year, 30)} />, b: <Pct v={perf(right.year, 30)} /> },
    { label: c.row6m, a: <Pct v={perf(left.year, 182)} />, b: <Pct v={perf(right.year, 182)} /> },
    { label: c.row1y, a: <Pct v={l1y} />, b: <Pct v={r1y} /> },
    {
      label: c.rowHigh52,
      a: fmtNum(left.day?.fiftyTwoWeekHigh ?? null, cur(left)),
      b: fmtNum(right.day?.fiftyTwoWeekHigh ?? null, cur(right)),
    },
    {
      label: c.rowLow52,
      a: fmtNum(left.day?.fiftyTwoWeekLow ?? null, cur(left)),
      b: fmtNum(right.day?.fiftyTwoWeekLow ?? null, cur(right)),
    },
    { label: c.rowCurrency, a: left.day?.currency ?? "—", b: right.day?.currency ?? "—" },
  ];

  const path = `/compare/${slug}`;
  const A = left.name;
  const B = right.name;

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}/compare`, label: c.hubH1 }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.hubH1, item: `${SITE_URL}${p}/compare` },
            { "@type": "ListItem", position: 3, name: `${A} vs ${B}`, item: `${SITE_URL}${p}${path}` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{fill(c.h1, { A, B })}</h1>
          <p className="quote-sub">{c.sub}</p>
        </div>
      </div>

      <p className="statline">{lead}</p>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.statsHeading}</h2>
        </div>
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>{c.colMetric}</th>
                <th>
                  <Link className="qlink" href={`${p}/quote/${encodeURIComponent(left.entry.symbol)}`}>{A}</Link>
                </th>
                <th>
                  <Link className="qlink" href={`${p}/quote/${encodeURIComponent(right.entry.symbol)}`}>{B}</Link>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td style={{ textAlign: "left" }}>{r.label}</td>
                  <td>{r.a}</td>
                  <td>{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.chartHeading}</h2>
          <span className="kicker-note">{c.chartNote}</span>
        </div>
        <RebasedChart left={left} right={right} note={c.chartNote} />
      </section>

      <AdSlot slot="0000000008" format="leaderboard" />

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP}</p>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.popularHeading}</h2>
        </div>
        <div className="pair-grid">
          {COMPARE_PAIRS.filter((x) => x.slug !== slug)
            .slice(0, 24)
            .map((x) => (
              <Link className="pair-link" key={x.slug} href={`${p}/compare/${x.slug}`}>
                {localName(lang, x.left.symbol, x.left.name)} vs {localName(lang, x.right.symbol, x.right.name)}
              </Link>
            ))}
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}

export function compareHubMetadata(lang: Lang): Metadata {
  const c = compareCopy(lang);
  const path = "/compare";
  return {
    title: c.hubTitle,
    description: c.hubDescription,
    alternates: { canonical: `${prefix(lang)}${path}`, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title: c.hubTitle, description: c.hubDescription, url: `${prefix(lang)}${path}` },
    twitter: { card: "summary_large_image", title: c.hubTitle, description: c.hubDescription },
  };
}

export function CompareHub({ lang }: { lang: Lang }) {
  const c = compareCopy(lang);
  const p = prefix(lang);
  return (
    <div className="paper">
      <LangNav lang={lang} path="/compare" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: c.hubH1, item: `${SITE_URL}${p}/compare` },
          ],
        }}
      />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{c.hubH1}</h1>
          <p className="quote-sub">{fill(c.hubSub, { n: String(COMPARE_PAIRS.length) })}</p>
        </div>
      </div>
      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{c.popularHeading}</h2>
        </div>
        <div className="pair-grid">
          {COMPARE_PAIRS.map((x) => (
            <Link className="pair-link" key={x.slug} href={`${p}/compare/${x.slug}`}>
              {localName(lang, x.left.symbol, x.left.name)} vs {localName(lang, x.right.symbol, x.right.name)}
            </Link>
          ))}
        </div>
      </section>
      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{c.aboutHeading}</h2>
        </div>
        <p>{c.aboutP}</p>
      </section>
      <footer className="colophon">
        <p className="fine">{c.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
