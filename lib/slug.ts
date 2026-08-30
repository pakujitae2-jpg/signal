import { UNIVERSE, type UniverseEntry } from "./universe";

// URL-safe slug per symbol, used by /compare/<a>-vs-<b> and the search index.
// Yahoo tickers carry punctuation that reads badly in a URL, so the exchange
// and instrument suffixes are stripped: BTC-USD -> btc, ^GSPC -> gspc,
// 005930.KS -> 005930, GC=F -> gc, KRW=X -> krw, BRK-B -> brk-b.

function baseSlug(symbol: string): string {
  return symbol
    .replace(/^\^/, "")
    .replace(/-USD$/i, "")
    .replace(/=[XF]$/, "")
    .replace(/\.(KS|KQ|T|SS|NYB)$/i, "")
    .replace(/[^A-Za-z0-9-]/g, "-")
    .toLowerCase();
}

function build(): { toSlug: Map<string, string>; fromSlug: Map<string, UniverseEntry> } {
  const counts = new Map<string, number>();
  for (const e of UNIVERSE) {
    const s = baseSlug(e.symbol);
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  const toSlug = new Map<string, string>();
  const fromSlug = new Map<string, UniverseEntry>();
  for (const e of UNIVERSE) {
    const base = baseSlug(e.symbol);
    // Two symbols can reduce to the same base (e.g. an index and a ticker).
    // Whoever collides keeps the full symbol, lowercased and punctuation-safe.
    const slug = counts.get(base) === 1 ? base : e.symbol.replace(/[^A-Za-z0-9-]/g, "-").toLowerCase();
    toSlug.set(e.symbol, slug);
    if (!fromSlug.has(slug)) fromSlug.set(slug, e);
  }
  return { toSlug, fromSlug };
}

const { toSlug, fromSlug } = build();

export function symbolSlug(symbol: string): string {
  return toSlug.get(symbol) ?? baseSlug(symbol);
}

export function bySlug(slug: string): UniverseEntry | undefined {
  return fromSlug.get(slug.toLowerCase());
}

export const ALL_SLUGS: string[] = [...fromSlug.keys()];
