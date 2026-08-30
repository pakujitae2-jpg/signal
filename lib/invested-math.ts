export type HistoryPoint = { t: number; c: number };

// Pure return math shared by the server page and any client caller: no fetch
// layer, so importing it does not drag the upstream client into a bundle.

/** The recorded close at or just before `when`. */
export function closeAt(points: HistoryPoint[], when: number): HistoryPoint | null {
  if (points.length === 0) return null;
  let found: HistoryPoint | null = null;
  for (const p of points) {
    if (p.t <= when) found = p;
    else break;
  }
  return found ?? points[0];
}

export type InvestedResult = {
  startedAt: number;
  startPrice: number;
  endAt: number;
  endPrice: number;
  invested: number;
  units: number;
  value: number;
  profit: number;
  multiple: number;
  totalPct: number;
  /** Compound annual growth rate, null when the span is under a month. */
  cagrPct: number | null;
  years: number;
  currency: string;
  path: HistoryPoint[];
};

/**
 * What a lump sum bought on `startMs` would be worth now, using the real
 * monthly closes. Returns null when the symbol has no usable history.
 */
export function computeInvested(
  points: HistoryPoint[],
  currency: string,
  amount: number,
  startMs: number
): InvestedResult | null {
  if (points.length < 2 || !(amount > 0)) return null;
  const start = closeAt(points, startMs);
  const end = points[points.length - 1];
  if (!start || !end || start.t >= end.t) return null;

  const units = amount / start.c;
  const value = units * end.c;
  const years = (end.t - start.t) / (365.25 * 86400_000);
  const multiple = value / amount;
  return {
    startedAt: start.t,
    startPrice: start.c,
    endAt: end.t,
    endPrice: end.c,
    invested: amount,
    units,
    value,
    profit: value - amount,
    multiple,
    totalPct: (multiple - 1) * 100,
    cagrPct: years >= 0.5 ? (Math.pow(multiple, 1 / years) - 1) * 100 : null,
    years,
    currency,
    path: points.filter((p) => p.t >= start.t),
  };
}
