import { getQuoteDetail, type Range } from "./quote";

// Currency-conversion pages. Each pair maps to the Yahoo FX symbol that
// quotes it: USD-based pairs are "<QUOTE>=X", cross rates "<BASE><QUOTE>=X".

export type Currency = { code: string; name: string; symbol: string; countries: string };

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: "USD", name: "US Dollar", symbol: "$", countries: "United States" },
  KRW: { code: "KRW", name: "South Korean Won", symbol: "₩", countries: "South Korea" },
  JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥", countries: "Japan" },
  EUR: { code: "EUR", name: "Euro", symbol: "€", countries: "Eurozone" },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", countries: "United Kingdom" },
  CNY: { code: "CNY", name: "Chinese Yuan", symbol: "¥", countries: "China" },
  AUD: { code: "AUD", name: "Australian Dollar", symbol: "A$", countries: "Australia" },
  CAD: { code: "CAD", name: "Canadian Dollar", symbol: "C$", countries: "Canada" },
  CHF: { code: "CHF", name: "Swiss Franc", symbol: "Fr", countries: "Switzerland" },
  HKD: { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", countries: "Hong Kong" },
  SGD: { code: "SGD", name: "Singapore Dollar", symbol: "S$", countries: "Singapore" },
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹", countries: "India" },
};

// Pairs that get their own indexed page, highest search volume first.
export const FX_PAIRS: [string, string][] = [
  ["USD", "KRW"], ["USD", "JPY"], ["USD", "EUR"], ["USD", "GBP"], ["USD", "CNY"],
  ["USD", "INR"], ["USD", "CAD"], ["USD", "AUD"], ["USD", "CHF"], ["USD", "HKD"], ["USD", "SGD"],
  ["EUR", "USD"], ["GBP", "USD"], ["AUD", "USD"], ["EUR", "GBP"], ["EUR", "JPY"],
  ["JPY", "KRW"], ["KRW", "USD"], ["JPY", "USD"], ["CNY", "KRW"], ["GBP", "EUR"],
];

export const FX_SLUGS: string[] = FX_PAIRS.map(([b, q]) => `${b.toLowerCase()}-to-${q.toLowerCase()}`);

export function parseSlug(slug: string): { base: string; quote: string } | null {
  const m = /^([a-z]{3})-to-([a-z]{3})$/.exec(slug);
  if (!m) return null;
  const base = m[1].toUpperCase();
  const quote = m[2].toUpperCase();
  if (!CURRENCIES[base] || !CURRENCIES[quote] || base === quote) return null;
  return { base, quote };
}

/** The Yahoo symbol quoting base→quote, plus whether it must be inverted. */
function fxSymbol(base: string, quote: string): { symbol: string; invert: boolean } {
  if (base === "USD") return { symbol: `${quote}=X`, invert: false };
  if (quote === "USD") return { symbol: `${base}=X`, invert: true };
  return { symbol: `${base}${quote}=X`, invert: false };
}

export type FxRate = {
  base: string;
  quote: string;
  rate: number;
  prevRate: number | null;
  points: { t: number; c: number }[];
  range: Range;
  source: "live" | "sample";
};

const SAMPLE_USD: Record<string, number> = {
  KRW: 1384.5, JPY: 153.86, EUR: 0.923, GBP: 0.781, CNY: 7.264,
  INR: 83.42, CAD: 1.366, AUD: 1.494, CHF: 0.897, HKD: 7.808, SGD: 1.348, USD: 1,
};

function sampleRate(base: string, quote: string, range: Range): FxRate {
  const rate = SAMPLE_USD[quote] / SAMPLE_USD[base];
  const now = Date.now();
  const points = Array.from({ length: 36 }, (_, i) => {
    const t = i / 35;
    return { t: now - (1 - t) * 86400000, c: rate * (1 + 0.004 * Math.sin(t * 9.4)) };
  });
  return { base, quote, rate, prevRate: points[0].c, points, range, source: "sample" };
}

export async function getFxRate(base: string, quote: string, range: Range = "1mo"): Promise<FxRate> {
  const { symbol, invert } = fxSymbol(base, quote);
  const detail = await getQuoteDetail(symbol, range);
  if (!detail || detail.price === null || detail.source === "sample") return sampleRate(base, quote, range);

  const conv = (v: number) => (invert ? 1 / v : v);
  return {
    base,
    quote,
    rate: conv(detail.price),
    prevRate: detail.prevClose !== null ? conv(detail.prevClose) : null,
    points: detail.points.map((p) => ({ t: p.t, c: conv(p.c) })),
    range,
    source: "live",
  };
}
