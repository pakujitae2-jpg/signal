// Snapshots Upbit's KRW market list (symbol/Korean name/English name only —
// not price or the warning/caution flags, which the app fetches live since
// those change far more often than the listing set itself) into
// lib/upbit-markets.generated.ts, for feeding Hangul coin names into the
// client-side /search index. Re-run when Upbit lists new coins.
// Usage: node scripts/generate-upbit.mjs
import { writeFileSync } from "node:fs";

async function main() {
  const res = await fetch("https://api.upbit.com/v1/market/all?isDetails=true");
  if (!res.ok) throw new Error(`upbit market/all: HTTP ${res.status}`);
  const all = await res.json();
  const krw = all
    .filter((m) => typeof m?.market === "string" && m.market.startsWith("KRW-"))
    .map((m) => ({
      market: m.market,
      symbol: m.market.replace(/^KRW-/, ""),
      koreanName: m.korean_name,
      englishName: m.english_name,
    }));
  if (krw.length === 0) throw new Error("no KRW markets returned");
  console.log(`${krw.length} KRW markets`);

  const lines = [];
  lines.push("// GENERATED - do not edit by hand.");
  lines.push("// Upbit KRW market list (name metadata only, not price). Regenerate with:");
  lines.push("//   node scripts/generate-upbit.mjs");
  lines.push(`// Snapshot date: ${new Date().toISOString().slice(0, 10)}.`);
  lines.push("");
  lines.push("export type UpbitMarketMeta = { market: string; symbol: string; koreanName: string; englishName: string };");
  lines.push("");
  lines.push(`export const UPBIT_MARKETS: UpbitMarketMeta[] = ${JSON.stringify(krw, null, 2)};`);

  writeFileSync("lib/upbit-markets.generated.ts", lines.join("\n") + "\n");
  console.log("Wrote lib/upbit-markets.generated.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
