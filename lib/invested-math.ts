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

export type DcaResult = {
  startedAt: number;
  endAt: number;
  endPrice: number;
  monthlyAmount: number;
  months: number;
  contributed: number;
  units: number;
  value: number;
  profit: number;
  totalPct: number;
  avgCost: number;
  /** Annualized return implied by treating the contributed total as one lump
   *  sum at its dollar-weighted average age — an approximation, not a true
   *  money-weighted (XIRR) rate. Null under 6 months of contributions. */
  annualizedPct: number | null;
  currency: string;
  /** Portfolio value at each contribution date, using units held as of that
   *  date — reflects the ramping position size, unlike a lump-sum rescale. */
  path: HistoryPoint[];
  /** Running total contributed as of each point, for charting cost basis
   *  against value (DCA's basis rises every month, unlike a lump sum's). */
  contributedPath: HistoryPoint[];
};

/**
 * A fixed amount bought on every monthly close from `startMs` to the most
 * recent bar, using the real monthly closes. Returns null when the symbol
 * has no usable history or fewer than 2 contributions would result.
 */
export function computeDca(
  points: HistoryPoint[],
  currency: string,
  monthlyAmount: number,
  startMs: number
): DcaResult | null {
  if (points.length < 2 || !(monthlyAmount > 0)) return null;
  const inRange = points.filter((p) => p.t >= startMs);
  if (inRange.length < 2) return null;

  const end = points[points.length - 1];
  let units = 0;
  let contributed = 0;
  let weightedAge = 0;
  const path: HistoryPoint[] = [];
  const contributedPath: HistoryPoint[] = [];
  for (const p of inRange) {
    units += monthlyAmount / p.c;
    contributed += monthlyAmount;
    weightedAge += monthlyAmount * (end.t - p.t);
    path.push({ t: p.t, c: units * p.c });
    contributedPath.push({ t: p.t, c: contributed });
  }

  const value = units * end.c;
  const avgAgeYears = weightedAge / contributed / (365.25 * 86400_000);

  return {
    startedAt: inRange[0].t,
    endAt: end.t,
    endPrice: end.c,
    monthlyAmount,
    months: inRange.length,
    contributed,
    units,
    value,
    profit: value - contributed,
    totalPct: (value / contributed - 1) * 100,
    avgCost: contributed / units,
    annualizedPct: avgAgeYears >= 0.5 ? (Math.pow(value / contributed, 1 / avgAgeYears) - 1) * 100 : null,
    currency,
    path,
    contributedPath,
  };
}
