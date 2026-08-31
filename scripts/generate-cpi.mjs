// Snapshots CPI series for US/KR/JP into lib/cpi.generated.ts. Workers have
// no filesystem and BLS's public API is capped at 25 requests/day per IP, so
// this must run at build time, never at the edge. Re-run periodically (e.g.
// a GitHub Actions cron pushing to the branch Cloudflare builds) to pick up
// new years — annual data for KR/JP typically lags about a year behind.
// Usage: node scripts/generate-cpi.mjs
import { writeFileSync } from "node:fs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// US: BLS CPI-U (CUUR0000SA0), monthly, averaged per calendar year. The
// public API without a registration key allows 10 years per request.
async function fetchUsAnnual() {
  const now = new Date().getUTCFullYear();
  const monthlyByYear = new Map();
  for (let start = 1913; start <= now; start += 10) {
    const end = Math.min(start + 9, now);
    const res = await fetch("https://api.bls.gov/publicAPI/v1/timeseries/data/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seriesid: ["CUUR0000SA0"], startyear: String(start), endyear: String(end) }),
    });
    const json = await res.json();
    if (json.status !== "REQUEST_SUCCEEDED") throw new Error(`BLS ${start}-${end}: ${JSON.stringify(json.message)}`);
    for (const row of json.Results?.series?.[0]?.data ?? []) {
      const year = Number(row.year);
      const value = Number(row.value);
      if (!isFinite(value)) continue;
      if (!monthlyByYear.has(year)) monthlyByYear.set(year, []);
      monthlyByYear.get(year).push(value);
    }
    console.log(`US ${start}-${end}: ok`);
    await sleep(300);
  }
  const points = [...monthlyByYear.entries()]
    .map(([year, values]) => ({ year, cpi: values.reduce((a, b) => a + b, 0) / values.length, months: values.length }))
    .sort((a, b) => a.year - b.year);
  return points;
}

// KR/JP: World Bank annual CPI (2010 = 100), keyless, no per-day cap known.
async function fetchWorldBankAnnual(iso2, iso3) {
  const res = await fetch(`https://api.worldbank.org/v2/country/${iso2}/indicator/FP.CPI.TOTL?format=json&per_page=500&date=1955:2030`);
  const json = await res.json();
  const rows = (json[1] ?? []).filter((r) => r.countryiso3code === iso3 && typeof r.value === "number");
  if (rows.length === 0) throw new Error(`World Bank ${iso2}: no data`);
  return rows.map((r) => ({ year: Number(r.date), cpi: r.value })).sort((a, b) => a.year - b.year);
}

async function main() {
  const us = await fetchUsAnnual();
  const kr = await fetchWorldBankAnnual("KR", "KOR");
  const jp = await fetchWorldBankAnnual("JP", "JPN");
  console.log(`US ${us.length} years (${us[0].year}-${us[us.length - 1].year})`);
  console.log(`KR ${kr.length} years (${kr[0].year}-${kr[kr.length - 1].year})`);
  console.log(`JP ${jp.length} years (${jp[0].year}-${jp[jp.length - 1].year})`);

  const lines = [];
  lines.push("// GENERATED - do not edit by hand.");
  lines.push("// Annual CPI series for /inflation. US from BLS CPI-U (monthly, averaged per");
  lines.push("// year); KR/JP from World Bank FP.CPI.TOTL (already annual, 2010=100, and");
  lines.push("// roughly a year behind — see lib/cpi.ts for how that's labeled). Regenerate:");
  lines.push("//   node scripts/generate-cpi.mjs");
  lines.push(`// Snapshot date: ${new Date().toISOString().slice(0, 10)}.`);
  lines.push("");
  lines.push("export type CpiPoint = { year: number; cpi: number };");
  lines.push("");
  lines.push(`export const CPI_US: CpiPoint[] = ${JSON.stringify(us.map((p) => ({ year: p.year, cpi: Number(p.cpi.toFixed(3)) })))};`);
  lines.push("");
  lines.push(`export const CPI_KR: CpiPoint[] = ${JSON.stringify(kr.map((p) => ({ year: p.year, cpi: Number(p.cpi.toFixed(4)) })))};`);
  lines.push("");
  lines.push(`export const CPI_JP: CpiPoint[] = ${JSON.stringify(jp.map((p) => ({ year: p.year, cpi: Number(p.cpi.toFixed(4)) })))};`);

  writeFileSync("lib/cpi.generated.ts", lines.join("\n") + "\n");
  console.log("Wrote lib/cpi.generated.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
