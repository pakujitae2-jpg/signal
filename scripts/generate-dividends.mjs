// Fetches dividend (and split) history for every US stock, ETF, and JP/KR
// stock in lib/universe.ts and writes lib/dividends.generated.ts. Re-run this
// quarterly-ish to pick up new ex-dates; it's a plain data snapshot, not
// something the app fetches live (550 symbols is too many to fetch per
// render). Usage: node scripts/generate-dividends.mjs
import { readFileSync, writeFileSync } from "node:fs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const CONCURRENCY = 8;
const DELAY_MS = 150; // between batches, to stay polite to Yahoo

function extractSymbols(groupName) {
  const src = readFileSync("lib/universe.ts", "utf8");
  const start = src.indexOf(`const ${groupName}:`);
  const end = src.indexOf("];", start);
  const block = src.slice(start, end);
  return [...block.matchAll(/\["([^"]+)",\s*"([^"]*)"/g)].map((m) => m[1]);
}

const SYMBOLS = [...extractSymbols("US"), ...extractSymbols("ETFS"), ...extractSymbols("JP"), ...extractSymbols("KR")];
console.log(`${SYMBOLS.length} candidate symbols (US/ETF/JP/KR stocks)`);

function toIsoDate(unixSeconds) {
  return new Date(unixSeconds * 1000).toISOString().slice(0, 10);
}

async function fetchDividends(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=max&interval=1mo&events=div%2Csplit`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return null;
    const json = await res.json();
    const r = json?.chart?.result?.[0];
    if (!r) return null;
    const divRaw = r.events?.dividends ?? {};
    const dividends = Object.entries(divRaw)
      .map(([exTs, d]) => ({
        exDate: toIsoDate(Number(exTs)),
        recordDate: typeof d.date === "number" ? toIsoDate(d.date) : null,
        amount: Number(d.amount),
      }))
      .filter((d) => isFinite(d.amount) && d.amount > 0)
      .sort((a, b) => a.exDate.localeCompare(b.exDate));
    if (dividends.length === 0) return null;

    const splitRaw = r.events?.splits ?? {};
    const splits = Object.entries(splitRaw)
      .map(([exTs, s]) => ({
        exDate: toIsoDate(Number(exTs)),
        numerator: Number(s.numerator),
        denominator: Number(s.denominator),
        ratio: String(s.splitRatio ?? `${s.numerator}:${s.denominator}`),
      }))
      .sort((a, b) => a.exDate.localeCompare(b.exDate));

    return { symbol, dividends, splits };
  } catch {
    return null;
  }
}

const results = [];
let done = 0;
for (let i = 0; i < SYMBOLS.length; i += CONCURRENCY) {
  const batch = SYMBOLS.slice(i, i + CONCURRENCY);
  const settled = await Promise.all(batch.map(fetchDividends));
  for (const r of settled) if (r) results.push(r);
  done += batch.length;
  process.stdout.write(`\r${done}/${SYMBOLS.length} checked, ${results.length} pay dividends`);
  await new Promise((res) => setTimeout(res, DELAY_MS));
}
console.log(`\nDone: ${results.length}/${SYMBOLS.length} symbols have dividend history.`);

results.sort((a, b) => a.symbol.localeCompare(b.symbol));

const lines = [];
lines.push('import type { DividendRecord } from "./dividends";');
lines.push("");
lines.push("// GENERATED - do not edit by hand.");
lines.push("// Dividend (and split) history for every dividend-paying US/JP/KR symbol in");
lines.push("// lib/universe.ts, from Yahoo's chart events. Regenerate with:");
lines.push("//   node scripts/generate-dividends.mjs");
lines.push(`// Snapshot date: ${new Date().toISOString().slice(0, 10)}.`);
lines.push("");
lines.push("export const DIVIDENDS: Record<string, DividendRecord> = {");
for (const r of results) {
  lines.push(`  ${JSON.stringify(r.symbol)}: {`);
  lines.push(`    dividends: ${JSON.stringify(r.dividends)},`);
  lines.push(`    splits: ${JSON.stringify(r.splits)},`);
  lines.push("  },");
}
lines.push("};");

writeFileSync("lib/dividends.generated.ts", lines.join("\n") + "\n");
console.log("Wrote lib/dividends.generated.ts");
