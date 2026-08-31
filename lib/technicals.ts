import type { Bar } from "./technicals-data";

// Standard technical-indicator formulas over daily OHLC bars. Pure
// computation only — these are readings, not recommendations (never render
// a "buy/sell" verdict from this module; see components/quote/TechnicalsPage.tsx).

function sma(values: number[], period: number, endIndex: number): number | null {
  if (endIndex - period + 1 < 0) return null;
  let sum = 0;
  for (let i = endIndex - period + 1; i <= endIndex; i++) sum += values[i];
  return sum / period;
}

function emaSeries(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (values.length < period) return out;
  const k = 2 / (period + 1);
  let seed = 0;
  for (let i = 0; i < period; i++) seed += values[i];
  seed /= period;
  out[period - 1] = seed;
  let prev = seed;
  for (let i = period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

function lastEma(values: number[], period: number): number | null {
  const series = emaSeries(values, period);
  return series[series.length - 1];
}

export const MA_PERIODS = [5, 10, 20, 50, 100, 200] as const;
export type MaPeriod = (typeof MA_PERIODS)[number];

export type MovingAverages = { period: MaPeriod; sma: number | null; ema: number | null }[];

export function movingAverages(closes: number[]): MovingAverages {
  const i = closes.length - 1;
  return MA_PERIODS.map((period) => ({ period, sma: sma(closes, period, i), ema: lastEma(closes, period) }));
}

/** Wilder's RSI. */
export function rsi(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null;
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) avgGain += diff;
    else avgLoss -= diff;
  }
  avgGain /= period;
  avgLoss /= period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export type Macd = { macd: number; signal: number; histogram: number };

export function macd(closes: number[], fast = 12, slow = 26, signalPeriod = 9): Macd | null {
  if (closes.length < slow + signalPeriod) return null;
  const emaFast = emaSeries(closes, fast);
  const emaSlow = emaSeries(closes, slow);
  const macdSeries: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    const f = emaFast[i];
    const s = emaSlow[i];
    if (f !== null && s !== null) macdSeries.push(f - s);
  }
  if (macdSeries.length < signalPeriod) return null;
  const signalSeries = emaSeries(macdSeries, signalPeriod);
  const macdVal = macdSeries[macdSeries.length - 1];
  const signalVal = signalSeries[signalSeries.length - 1];
  if (signalVal === null) return null;
  return { macd: macdVal, signal: signalVal, histogram: macdVal - signalVal };
}

export type Bollinger = { middle: number; upper: number; lower: number };

export function bollinger(closes: number[], period = 20, mult = 2): Bollinger | null {
  const i = closes.length - 1;
  const mid = sma(closes, period, i);
  if (mid === null) return null;
  let sumSq = 0;
  for (let j = i - period + 1; j <= i; j++) sumSq += (closes[j] - mid) ** 2;
  const sd = Math.sqrt(sumSq / period);
  return { middle: mid, upper: mid + mult * sd, lower: mid - mult * sd };
}

export type Stochastic = { k: number; d: number };

export function stochastic(bars: Bar[], period = 14, kSmooth = 3, dSmooth = 3): Stochastic | null {
  if (bars.length < period + kSmooth + dSmooth) return null;
  const rawK: number[] = [];
  for (let i = period - 1; i < bars.length; i++) {
    let hi = -Infinity;
    let lo = Infinity;
    for (let j = i - period + 1; j <= i; j++) {
      hi = Math.max(hi, bars[j].h);
      lo = Math.min(lo, bars[j].l);
    }
    rawK.push(hi === lo ? 50 : (100 * (bars[i].c - lo)) / (hi - lo));
  }
  const slowK: number[] = [];
  for (let i = kSmooth - 1; i < rawK.length; i++) {
    slowK.push(rawK.slice(i - kSmooth + 1, i + 1).reduce((a, b) => a + b, 0) / kSmooth);
  }
  const dArr: number[] = [];
  for (let i = dSmooth - 1; i < slowK.length; i++) {
    dArr.push(slowK.slice(i - dSmooth + 1, i + 1).reduce((a, b) => a + b, 0) / dSmooth);
  }
  if (slowK.length === 0 || dArr.length === 0) return null;
  return { k: slowK[slowK.length - 1], d: dArr[dArr.length - 1] };
}

export function cci(bars: Bar[], period = 20): number | null {
  if (bars.length < period) return null;
  const tp = bars.map((b) => (b.h + b.l + b.c) / 3);
  const i = tp.length - 1;
  const meanTp = sma(tp, period, i);
  if (meanTp === null) return null;
  let meanDev = 0;
  for (let j = i - period + 1; j <= i; j++) meanDev += Math.abs(tp[j] - meanTp);
  meanDev /= period;
  if (meanDev === 0) return 0;
  return (tp[i] - meanTp) / (0.015 * meanDev);
}

function trueRange(bars: Bar[], i: number): number {
  const { h, l } = bars[i];
  const pc = bars[i - 1].c;
  return Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc));
}

/** Wilder's ATR. */
export function atr(bars: Bar[], period = 14): number | null {
  if (bars.length < period + 1) return null;
  let val = 0;
  for (let i = 1; i <= period; i++) val += trueRange(bars, i);
  val /= period;
  for (let i = period + 1; i < bars.length; i++) val = (val * (period - 1) + trueRange(bars, i)) / period;
  return val;
}

export type Adx = { adx: number; plusDI: number; minusDI: number };

/** Wilder's ADX with +DI/-DI. */
export function adx(bars: Bar[], period = 14): Adx | null {
  if (bars.length < period * 2 + 1) return null;
  const plusDM: number[] = [0];
  const minusDM: number[] = [0];
  const tr: number[] = [0];
  for (let i = 1; i < bars.length; i++) {
    const upMove = bars[i].h - bars[i - 1].h;
    const downMove = bars[i - 1].l - bars[i].l;
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
    tr.push(trueRange(bars, i));
  }
  function wilderSmooth(series: number[]): number[] {
    const out = new Array(series.length).fill(NaN);
    let sum = 0;
    for (let i = 1; i <= period; i++) sum += series[i];
    out[period] = sum;
    for (let i = period + 1; i < series.length; i++) out[i] = out[i - 1] - out[i - 1] / period + series[i];
    return out;
  }
  const smTR = wilderSmooth(tr);
  const smPlusDM = wilderSmooth(plusDM);
  const smMinusDM = wilderSmooth(minusDM);
  const dx: number[] = [];
  let lastPlusDI = 0;
  let lastMinusDI = 0;
  for (let i = period; i < bars.length; i++) {
    if (smTR[i] === 0 || isNaN(smTR[i])) continue;
    const pdi = (100 * smPlusDM[i]) / smTR[i];
    const mdi = (100 * smMinusDM[i]) / smTR[i];
    lastPlusDI = pdi;
    lastMinusDI = mdi;
    dx.push(pdi + mdi === 0 ? 0 : (100 * Math.abs(pdi - mdi)) / (pdi + mdi));
  }
  if (dx.length < period) return null;
  let adxVal = dx.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < dx.length; i++) adxVal = (adxVal * (period - 1) + dx[i]) / period;
  return { adx: adxVal, plusDI: lastPlusDI, minusDI: lastMinusDI };
}

export function williamsR(bars: Bar[], period = 14): number | null {
  if (bars.length < period) return null;
  const i = bars.length - 1;
  let hi = -Infinity;
  let lo = Infinity;
  for (let j = i - period + 1; j <= i; j++) {
    hi = Math.max(hi, bars[j].h);
    lo = Math.min(lo, bars[j].l);
  }
  if (hi === lo) return -50;
  return (-100 * (hi - bars[i].c)) / (hi - lo);
}

export type PivotLevel = { p: number; r1: number; s1: number; r2?: number; s2?: number; r3?: number; s3?: number; r4?: number; s4?: number };
export type PivotSet = { classic: PivotLevel; fibonacci: PivotLevel; camarilla: PivotLevel; woodie: PivotLevel; demark: PivotLevel };

/** Standard pivot formulas from the PRIOR period's (day's) OHLC. */
export function pivotPoints(prev: Bar): PivotSet {
  const { o, h, l, c } = prev;
  const range = h - l;
  const classicP = (h + l + c) / 3;
  const classic: PivotLevel = {
    p: classicP,
    r1: 2 * classicP - l,
    s1: 2 * classicP - h,
    r2: classicP + range,
    s2: classicP - range,
    r3: h + 2 * (classicP - l),
    s3: l - 2 * (h - classicP),
  };
  const fibonacci: PivotLevel = {
    p: classicP,
    r1: classicP + 0.382 * range,
    s1: classicP - 0.382 * range,
    r2: classicP + 0.618 * range,
    s2: classicP - 0.618 * range,
    r3: classicP + range,
    s3: classicP - range,
  };
  const camarilla: PivotLevel = {
    p: classicP,
    r1: c + (range * 1.1) / 12,
    s1: c - (range * 1.1) / 12,
    r2: c + (range * 1.1) / 6,
    s2: c - (range * 1.1) / 6,
    r3: c + (range * 1.1) / 4,
    s3: c - (range * 1.1) / 4,
    r4: c + (range * 1.1) / 2,
    s4: c - (range * 1.1) / 2,
  };
  const woodieP = (h + l + 2 * c) / 4;
  const woodie: PivotLevel = { p: woodieP, r1: 2 * woodieP - l, s1: 2 * woodieP - h, r2: woodieP + range, s2: woodieP - range };
  const x = c < o ? h + 2 * l + c : c > o ? 2 * h + l + c : h + l + 2 * c;
  const demark: PivotLevel = { p: x / 4, r1: x / 2 - l, s1: x / 2 - h };
  return { classic, fibonacci, camarilla, woodie, demark };
}

/** True only once ~14 months of daily history exist — the floor for a meaningful MA200. */
export function hasEnoughForMa200(bars: Bar[]): boolean {
  if (bars.length < 200) return false;
  const spanDays = (bars[bars.length - 1].t - bars[0].t) / 86400_000;
  return spanDays >= 420;
}
