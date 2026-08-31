import { fetchJson } from "./http";
import { getQuoteDetail, type Range } from "./quote";
import { byGroup } from "./universe";

// Currency-conversion pages: /convert/usd-to-krw and /convert/100-usd-to-krw.
// Rates come from Yahoo (intraday, with history); if a pair is missing there
// the daily open.er-api.com rate fills in, with ECB history via Frankfurter
// for the currencies the ECB publishes.

export type Currency = {
  code: string;
  name: string;
  plural: string;
  symbol: string;
  countries: string;
  ecb: boolean; // published in the ECB reference rates (Frankfurter history)
};

function c(code: string, name: string, plural: string, symbol: string, countries: string, ecb = true): Currency {
  return { code, name, plural, symbol, countries, ecb };
}

export const CURRENCIES: Record<string, Currency> = Object.fromEntries(
  [
    c("USD", "US Dollar", "US Dollars", "$", "United States"),
    c("EUR", "Euro", "Euros", "€", "the Eurozone"),
    c("JPY", "Japanese Yen", "Japanese Yen", "¥", "Japan"),
    c("GBP", "British Pound", "British Pounds", "£", "United Kingdom"),
    c("KRW", "South Korean Won", "South Korean Won", "₩", "South Korea"),
    c("CNY", "Chinese Yuan", "Chinese Yuan", "¥", "China"),
    c("INR", "Indian Rupee", "Indian Rupees", "₹", "India"),
    c("AUD", "Australian Dollar", "Australian Dollars", "A$", "Australia"),
    c("CAD", "Canadian Dollar", "Canadian Dollars", "C$", "Canada"),
    c("CHF", "Swiss Franc", "Swiss Francs", "Fr", "Switzerland"),
    c("HKD", "Hong Kong Dollar", "Hong Kong Dollars", "HK$", "Hong Kong"),
    c("SGD", "Singapore Dollar", "Singapore Dollars", "S$", "Singapore"),
    c("NZD", "New Zealand Dollar", "New Zealand Dollars", "NZ$", "New Zealand"),
    c("SEK", "Swedish Krona", "Swedish Kronor", "kr", "Sweden"),
    c("NOK", "Norwegian Krone", "Norwegian Kroner", "kr", "Norway"),
    c("DKK", "Danish Krone", "Danish Kroner", "kr", "Denmark"),
    c("PLN", "Polish Zloty", "Polish Zloty", "zł", "Poland"),
    c("CZK", "Czech Koruna", "Czech Koruna", "Kč", "Czechia"),
    c("HUF", "Hungarian Forint", "Hungarian Forints", "Ft", "Hungary"),
    c("RON", "Romanian Leu", "Romanian Lei", "lei", "Romania"),
    c("TRY", "Turkish Lira", "Turkish Lira", "₺", "Türkiye"),
    c("MXN", "Mexican Peso", "Mexican Pesos", "MX$", "Mexico"),
    c("BRL", "Brazilian Real", "Brazilian Reais", "R$", "Brazil"),
    c("ZAR", "South African Rand", "South African Rand", "R", "South Africa"),
    c("THB", "Thai Baht", "Thai Baht", "฿", "Thailand"),
    c("IDR", "Indonesian Rupiah", "Indonesian Rupiah", "Rp", "Indonesia"),
    c("MYR", "Malaysian Ringgit", "Malaysian Ringgit", "RM", "Malaysia"),
    c("PHP", "Philippine Peso", "Philippine Pesos", "₱", "the Philippines"),
    c("ILS", "Israeli Shekel", "Israeli Shekels", "₪", "Israel"),
    c("ISK", "Icelandic Krona", "Icelandic Kronur", "kr", "Iceland"),
    c("VND", "Vietnamese Dong", "Vietnamese Dong", "₫", "Vietnam", false),
    c("TWD", "New Taiwan Dollar", "New Taiwan Dollars", "NT$", "Taiwan", false),
    c("AED", "UAE Dirham", "UAE Dirhams", "AED", "the United Arab Emirates", false),
    c("SAR", "Saudi Riyal", "Saudi Riyals", "SR", "Saudi Arabia", false),
    c("EGP", "Egyptian Pound", "Egyptian Pounds", "E£", "Egypt", false),
    c("PKR", "Pakistani Rupee", "Pakistani Rupees", "Rs", "Pakistan", false),
    c("BDT", "Bangladeshi Taka", "Bangladeshi Taka", "৳", "Bangladesh", false),
    c("NGN", "Nigerian Naira", "Nigerian Naira", "₦", "Nigeria", false),
    c("KWD", "Kuwaiti Dinar", "Kuwaiti Dinars", "KD", "Kuwait", false),
    c("QAR", "Qatari Riyal", "Qatari Riyals", "QR", "Qatar", false),
    c("ARS", "Argentine Peso", "Argentine Pesos", "AR$", "Argentina", false),
    c("CLP", "Chilean Peso", "Chilean Pesos", "CLP$", "Chile", false),
    c("COP", "Colombian Peso", "Colombian Pesos", "COL$", "Colombia", false),
  ].map((cur) => [cur.code, cur])
);

export const CURRENCY_CODES: string[] = Object.keys(CURRENCIES);

// Pairs among these get amount pages (100 USD to KRW…) in the sitemap.
export const MAJOR: string[] = ["USD", "EUR", "JPY", "GBP", "KRW", "CNY", "INR", "AUD", "CAD", "CHF", "HKD", "SGD"];

export const AMOUNTS: number[] = [1, 5, 10, 20, 50, 100, 500, 1000, 5000, 10000];

// KRW, JPY, VND, IDR, COP and CLP are all quoted in the hundreds or
// thousands per US dollar, so the reverse ladder in AMOUNTS above never
// clears about $7 — nobody searches "10,000 won in dollars." These
// currencies get a high-magnitude ladder instead, up to 1억/1億 (100M), the
// scale Korean and Japanese searches for these amounts actually use.
const HIGH_MAGNITUDE: ReadonlySet<string> = new Set(["KRW", "JPY", "VND", "IDR", "COP", "CLP"]);
export const HIGH_AMOUNTS: number[] = [1000, 10000, 100000, 1000000, 10000000, 100000000];

/** The amount ladder appropriate to a currency's typical magnitude. */
export function amountsFor(code: string): number[] {
  return HIGH_MAGNITUDE.has(code) ? HIGH_AMOUNTS : AMOUNTS;
}

/** Every ordered pair of distinct currencies. */
export const FX_PAIRS: [string, string][] = CURRENCY_CODES.flatMap((b) =>
  CURRENCY_CODES.filter((q) => q !== b).map((q): [string, string] => [b, q])
);

export function pairSlug(base: string, quote: string): string {
  return `${base.toLowerCase()}-to-${quote.toLowerCase()}`;
}

export function amountSlug(amount: number, base: string, quote: string): string {
  return `${amount}-${pairSlug(base, quote)}`;
}

/** Slugs listed in the sitemap: every pair, plus fixed amounts for major pairs. */
export const FX_SLUGS: string[] = [
  ...FX_PAIRS.map(([b, q]) => pairSlug(b, q)),
  ...FX_PAIRS.filter(([b, q]) => MAJOR.includes(b) && MAJOR.includes(q)).flatMap(([b, q]) =>
    amountsFor(b).map((a) => amountSlug(a, b, q))
  ),
];

// Cryptocurrency codes valid as a /convert leg alongside the fiat CURRENCIES
// above (e.g. /convert/btc-to-krw). Derived from the site's own crypto
// universe rather than a hand-maintained list, so it stays in sync with it.
export const CRYPTO_CODES: string[] = byGroup("crypto").map((e) => e.symbol.replace(/-USD$/, ""));
const CRYPTO_SET: ReadonlySet<string> = new Set(CRYPTO_CODES);
export function isCryptoCode(code: string): boolean {
  return CRYPTO_SET.has(code.toUpperCase());
}

export type ParsedSlug = { base: string; quote: string; amount: number | null };

export function parseSlug(slug: string): ParsedSlug | null {
  const m = /^(?:(\d{1,9}(?:\.\d{1,8})?)-)?([a-z0-9]{2,6})-to-([a-z0-9]{2,6})$/.exec(slug);
  if (!m) return null;
  const base = m[2].toUpperCase();
  const quote = m[3].toUpperCase();
  const baseValid = Boolean(CURRENCIES[base]) || isCryptoCode(base);
  const quoteValid = Boolean(CURRENCIES[quote]) || isCryptoCode(quote);
  if (!baseValid || !quoteValid || base === quote) return null;
  // Crypto-to-crypto pairs aren't wired up yet (lib/crypto-fx.ts only
  // resolves one crypto leg against one fiat leg) — both legs valid but both
  // crypto means neither is a fiat anchor, so reject rather than mis-render.
  if (isCryptoCode(base) && isCryptoCode(quote)) return null;
  let amount: number | null = null;
  if (m[1] !== undefined) {
    amount = Number(m[1]);
    // Only the canonical spelling gets a page: no leading zeros, no "100.0".
    if (!(amount > 0) || String(amount) !== m[1]) return null;
  }
  return { base, quote, amount };
}

/** The Yahoo symbol quoting base→quote, plus whether it must be inverted. */
export function fxSymbol(base: string, quote: string): { symbol: string; invert: boolean } {
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
  USD: 1, EUR: 0.923, JPY: 153.86, GBP: 0.781, KRW: 1384.5, CNY: 7.264, INR: 83.42, AUD: 1.494, CAD: 1.366, CHF: 0.897,
  HKD: 7.808, SGD: 1.348, NZD: 1.642, SEK: 10.61, NOK: 10.72, DKK: 6.88, PLN: 3.98, CZK: 23.3, HUF: 362, RON: 4.59,
  TRY: 32.4, MXN: 17.1, BRL: 5.12, ZAR: 18.6, THB: 36.7, IDR: 16050, MYR: 4.73, PHP: 57.4, ILS: 3.72, ISK: 138,
  VND: 25300, TWD: 32.3, AED: 3.6725, SAR: 3.75, EGP: 47.8, PKR: 278, BDT: 117, NGN: 1480, KWD: 0.307, QAR: 3.64,
  ARS: 900, CLP: 940, COP: 3900,
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

/** Daily mid-market rates for every currency vs USD (open.er-api.com). */
async function dailyUsdRates(): Promise<Record<string, number>> {
  const json = await fetchJson("https://open.er-api.com/v6/latest/USD", 3600);
  const rates = json?.rates;
  if (!rates || typeof rates.KRW !== "number") throw new Error("er-api: no rates");
  return rates as Record<string, number>;
}

/** ECB daily history via Frankfurter, oldest → newest. */
async function ecbHistory(base: string, quote: string, days: number): Promise<{ t: number; c: number }[]> {
  const end = new Date();
  const start = new Date(end.getTime() - days * 86400_000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  // frankfurter.app now 301-redirects here; call the real host directly so
  // every request doesn't pay a redirect hop (and doesn't break outright if
  // that redirect is ever retired).
  const json = await fetchJson(`https://api.frankfurter.dev/v1/${iso(start)}..${iso(end)}?from=${base}&to=${quote}`, 3600);
  const rates: Record<string, Record<string, number>> = json?.rates ?? {};
  return Object.keys(rates)
    .sort()
    .map((day) => ({ t: Date.parse(`${day}T16:00:00Z`), c: rates[day][quote] }))
    .filter((p) => typeof p.c === "number" && isFinite(p.c));
}

const RANGE_DAYS: Record<Range, number> = { "1d": 2, "5d": 7, "1mo": 31, "6mo": 183, "1y": 366 };

async function fallbackRate(base: string, quote: string, range: Range): Promise<FxRate | null> {
  try {
    const usd = await dailyUsdRates();
    if (typeof usd[base] !== "number" || typeof usd[quote] !== "number") return null;
    const rate = usd[quote] / usd[base];
    let points: { t: number; c: number }[] = [];
    if (CURRENCIES[base].ecb && CURRENCIES[quote].ecb) {
      try {
        points = await ecbHistory(base, quote, RANGE_DAYS[range]);
      } catch {
        points = [];
      }
    }
    const prevRate = points.length >= 2 ? points[points.length - 2].c : null;
    return { base, quote, rate, prevRate, points, range, source: "live" };
  } catch {
    return null;
  }
}

export async function getFxRate(base: string, quote: string, range: Range = "1mo"): Promise<FxRate> {
  const { symbol, invert } = fxSymbol(base, quote);
  const detail = await getQuoteDetail(symbol, range);
  if (detail && detail.price !== null && detail.source === "live") {
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
  return (await fallbackRate(base, quote, range)) ?? sampleRate(base, quote, range);
}
