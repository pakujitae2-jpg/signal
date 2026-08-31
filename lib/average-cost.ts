// Pure arithmetic shared by /tools/average, /tools/compound and /tools/cagr —
// no fetch layer, matching lib/invested-math.ts's split from its fetch side.

export const AVERAGE_MAX_LOTS = 5;

export type BuyLot = { price: number; qty: number };

export type AverageCostResult = {
  lots: BuyLot[];
  totalQty: number;
  totalCost: number;
  avgCost: number;
};

export function computeAverage(lots: BuyLot[]): AverageCostResult | null {
  const valid = lots.filter((l) => l.price > 0 && l.qty > 0);
  if (valid.length === 0) return null;
  const totalQty = valid.reduce((s, l) => s + l.qty, 0);
  const totalCost = valid.reduce((s, l) => s + l.price * l.qty, 0);
  return { lots: valid, totalQty, totalCost, avgCost: totalCost / totalQty };
}

/**
 * Additional quantity needed at `atPrice` to pull the blended average to
 * `targetAvg`. Null when unreachable — the target is already met/passed, or
 * lies on the wrong side of `atPrice` relative to the current average (no
 * amount of buying at `atPrice` gets you there; that direction needs selling).
 */
export function solveForTargetAverage(current: AverageCostResult, atPrice: number, targetAvg: number): number | null {
  if (!(atPrice > 0) || !(targetAvg > 0)) return null;
  const denom = atPrice - targetAvg;
  if (denom === 0) return null;
  const n = (targetAvg * current.totalQty - current.totalCost) / denom;
  return n > 0 && isFinite(n) ? n : null;
}

export type CompoundResult = { futureValue: number; contributed: number; interest: number };

export function compound(principal: number, ratePct: number, years: number, compoundsPerYear: number): CompoundResult | null {
  if (!(principal > 0) || !(years > 0) || !(compoundsPerYear > 0)) return null;
  const r = ratePct / 100;
  const fv = principal * Math.pow(1 + r / compoundsPerYear, compoundsPerYear * years);
  if (!isFinite(fv)) return null;
  return { futureValue: fv, contributed: principal, interest: fv - principal };
}

export function cagrPct(startValue: number, endValue: number, years: number): number | null {
  if (!(startValue > 0) || !(endValue > 0) || !(years > 0)) return null;
  const v = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
  return isFinite(v) ? v : null;
}
