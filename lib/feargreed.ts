import { fetchJson } from "./http";

// Crypto Fear & Greed Index (0-100) from alternative.me's free public API.
// 0 = extreme fear, 100 = extreme greed. Published once per day.

export type FGPoint = { t: number; value: number; label: string };

export type FearGreedData = {
  updatedAt: string;
  now: FGPoint;
  yesterday: FGPoint | null;
  lastWeek: FGPoint | null;
  lastMonth: FGPoint | null;
  history: FGPoint[]; // oldest → newest, ~90 days
  source: "live" | "sample";
};

const CACHE_TTL_MS = 10 * 60_000; // the index only moves once a day
let cache: { data: FearGreedData; ts: number } | null = null;

export function classify(value: number): string {
  if (value <= 24) return "Extreme Fear";
  if (value <= 44) return "Fear";
  if (value <= 55) return "Neutral";
  if (value <= 74) return "Greed";
  return "Extreme Greed";
}

function sampleData(): FearGreedData {
  const day = 86400_000;
  const now = Date.now();
  const history: FGPoint[] = [];
  for (let i = 89; i >= 0; i--) {
    const v = Math.round(52 + 26 * Math.sin(i / 11) + 9 * Math.sin(i / 3.3));
    const value = Math.max(5, Math.min(95, v));
    history.push({ t: now - i * day, value, label: classify(value) });
  }
  const at = (back: number) => history[history.length - 1 - back] ?? null;
  return {
    updatedAt: new Date().toISOString(),
    now: history[history.length - 1],
    yesterday: at(1),
    lastWeek: at(7),
    lastMonth: at(30),
    history,
    source: "sample",
  };
}

export async function getFearGreed(): Promise<FearGreedData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.data;

  try {
    const json = await fetchJson("https://api.alternative.me/fng/?limit=90");
    const raw: any[] = json?.data ?? [];
    const history: FGPoint[] = raw
      .map((d) => ({
        t: Number(d.timestamp) * 1000,
        value: Number(d.value),
        label: String(d.value_classification ?? classify(Number(d.value))),
      }))
      .filter((p) => isFinite(p.t) && isFinite(p.value))
      .sort((a, b) => a.t - b.t);
    if (history.length === 0) throw new Error("fng: empty");

    const at = (back: number) => history[history.length - 1 - back] ?? null;
    const data: FearGreedData = {
      updatedAt: new Date().toISOString(),
      now: history[history.length - 1],
      yesterday: at(1),
      lastWeek: at(7),
      lastMonth: at(30),
      history,
      source: "live",
    };
    cache = { data, ts: Date.now() };
    return data;
  } catch {
    return sampleData();
  }
}
