"use client";

import { useEffect, useRef, useState } from "react";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { fmtNum, fmtSigned } from "@/lib/format";
import { RANGE_LABEL, RANGES, type QuoteDetail, type Range } from "@/lib/quote";
import AdSlot from "./AdSlot";

/* ---------- helpers ---------- */

function pctOf(last: number, base: number | null): number | null {
  if (base === null || base === 0) return null;
  return ((last - base) / base) * 100;
}

function Chg({ pct }: { pct: number | null }) {
  if (pct === null || !isFinite(pct)) return <span className="chg flat">—</span>;
  const dir = pct > 0.005 ? "up" : pct < -0.005 ? "down" : "flat";
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "–";
  return (
    <span className={`chg ${dir}`}>
      {arrow} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

function fmtAxisTime(t: number, range: Range): string {
  const d = new Date(t);
  if (range === "1d") return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
  if (range === "5d") return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  if (range === "1y") return d.toLocaleDateString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function fmtHoverTime(t: number, range: Range): string {
  const d = new Date(t);
  if (range === "1d" || range === "5d") {
    return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" })} UTC`;
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function niceTicks(min: number, max: number, count = 4): number[] {
  const span = max - min;
  if (span <= 0) return [min];
  const rawStep = span / count;
  const mag = 10 ** Math.floor(Math.log10(rawStep));
  const norm = rawStep / mag;
  const step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) ticks.push(v);
  return ticks;
}

/* ---------- chart (line + crosshair tooltip) ---------- */

function PriceChart({ detail, base }: { detail: QuoteDetail; base: number | null }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(720);
  const [hover, setHover] = useState<number | null>(null);
  const h = 280;
  const padT = 10;
  const padB = 24;
  const padX = 4;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setW(Math.max(280, entries[0].contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { points, range, currency } = detail;
  const values = points.map((p) => p.c);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (base !== null && range === "1d") {
    min = Math.min(min, base);
    max = Math.max(max, base);
  }
  if (max === min) {
    max += Math.abs(max) * 0.01 || 1;
    min -= Math.abs(min) * 0.01 || 1;
  }
  const x = (i: number) => padX + (i / (points.length - 1)) * (w - padX * 2);
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB);

  const last = values[values.length - 1];
  const pct = pctOf(last, base ?? values[0]);
  const color = pct === null || Math.abs(pct) <= 0.005 ? "var(--flat)" : pct > 0 ? "var(--up)" : "var(--down)";

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.c).toFixed(1)}`).join("");
  const ticks = niceTicks(min, max);
  const xTickIdx = [0, Math.floor(points.length / 3), Math.floor((2 * points.length) / 3), points.length - 1];

  function locate(clientX: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const rel = (clientX - rect.left - padX) / (rect.width - padX * 2);
    const i = Math.round(rel * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  }

  const hp = hover !== null ? points[hover] : null;
  const tooltipLeft = hp ? Math.min(Math.max(x(hover!), 70), w - 70) : 0;

  return (
    <div className="chart-wrap" ref={wrapRef}>
      <svg
        width="100%"
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${detail.name} price chart, ${RANGE_LABEL[range]}`}
        onMouseMove={(e) => locate(e.clientX)}
        onMouseLeave={() => setHover(null)}
        onTouchMove={(e) => locate(e.touches[0].clientX)}
        onTouchEnd={() => setHover(null)}
      >
        {ticks.map((tv) => (
          <line key={tv} x1={0} x2={w} y1={y(tv)} y2={y(tv)} stroke="var(--rule)" strokeWidth="1" />
        ))}
        {base !== null && range === "1d" && base >= min && base <= max && (
          <line x1={0} x2={w} y1={y(base)} y2={y(base)} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 4" />
        )}
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {ticks.map((tv) => (
          <text key={tv} x={2} y={y(tv) - 4} className="axis-label">
            {fmtNum(tv)}
          </text>
        ))}
        {hp && (
          <g>
            <line x1={x(hover!)} x2={x(hover!)} y1={padT} y2={h - padB} stroke="var(--ink-3)" strokeWidth="1" />
            <circle cx={x(hover!)} cy={y(hp.c)} r="3.5" fill={color} stroke="var(--paper)" strokeWidth="1.5" />
          </g>
        )}
        {xTickIdx.map((i, n) => (
          <text
            key={`${i}-${n}`}
            x={x(i)}
            y={h - 8}
            className="axis-label"
            textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
          >
            {fmtAxisTime(points[i].t, range)}
          </text>
        ))}
      </svg>
      {hp && (
        <div className="chart-tt" style={{ left: tooltipLeft }}>
          <b>{fmtNum(hp.c, currency)}</b>
          <span>{fmtHoverTime(hp.t, range)}</span>
        </div>
      )}
    </div>
  );
}

/* ---------- page body ---------- */

export default function QuoteView({ symbol, initial }: { symbol: string; initial: QuoteDetail }) {
  const [byRange, setByRange] = useState<Partial<Record<Range, QuoteDetail>>>({ [initial.range]: initial });
  const [range, setRange] = useState<Range>(initial.range);
  const [loading, setLoading] = useState(false);

  const day = byRange["1d"] ?? initial;
  const detail = byRange[range] ?? day;

  async function pick(r: Range) {
    setRange(r);
    if (byRange[r]) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/quote/${encodeURIComponent(symbol)}?range=${r}`);
      if (res.ok) {
        const d = (await res.json()) as QuoteDetail;
        setByRange((prev) => ({ ...prev, [r]: d }));
      }
    } catch {
      // keep whatever is on screen
    } finally {
      setLoading(false);
    }
  }

  const dayChange = day.price !== null && day.prevClose !== null ? day.price - day.prevClose : null;
  const dayPct = day.price !== null ? pctOf(day.price, day.prevClose) : null;

  const points = detail.points;
  const periodBase = detail.range === "1d" ? (detail.prevClose ?? points[0]?.c ?? null) : (points[0]?.c ?? null);
  const periodLast = points[points.length - 1]?.c ?? null;
  const periodPct = periodLast !== null ? pctOf(periodLast, periodBase) : null;
  const periodHigh = points.length ? Math.max(...points.map((p) => p.c)) : null;
  const periodLow = points.length ? Math.min(...points.map((p) => p.c)) : null;

  const isCrypto = symbol.toUpperCase().endsWith("-USD");
  const partners = AFFILIATES.filter((p) => p.category === (isCrypto ? "Crypto Exchanges" : "Brokerages")).slice(0, 3);

  const stats: { label: string; value: string }[] = [
    { label: "Previous close", value: fmtNum(day.prevClose, day.currency) },
    { label: "Day change", value: `${fmtSigned(dayChange)}` },
    { label: `${RANGE_LABEL[detail.range]} high`, value: fmtNum(periodHigh, detail.currency) },
    { label: `${RANGE_LABEL[detail.range]} low`, value: fmtNum(periodLow, detail.currency) },
    ...(day.fiftyTwoWeekHigh !== null ? [{ label: "52-week high", value: fmtNum(day.fiftyTwoWeekHigh, day.currency) }] : []),
    ...(day.fiftyTwoWeekLow !== null ? [{ label: "52-week low", value: fmtNum(day.fiftyTwoWeekLow, day.currency) }] : []),
  ];

  return (
    <>
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{detail.name}</h1>
          <p className="quote-sub">
            {symbol.replace(/^\^/, "")}
            {detail.exchange ? ` · ${detail.exchange}` : ""} · {detail.currency}
          </p>
        </div>
        <div className="quote-price-box">
          <span className="quote-price">{fmtNum(day.price, day.currency)}</span>
          <span className="quote-chg">
            <span className={dayChange !== null && dayChange < 0 ? "chg down" : dayChange !== null && dayChange > 0 ? "chg up" : "chg flat"}>
              {fmtSigned(dayChange)}
            </span>{" "}
            <Chg pct={dayPct} />
          </span>
        </div>
      </div>

      {detail.source === "sample" && (
        <p className="wire-note">Note: sample figures shown — live data connects automatically in production deployments.</p>
      )}

      <section className="block">
        <div className="kicker">
          <div className="range-row" role="tablist" aria-label="Chart range">
            {RANGES.map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={r === range}
                className={`range-btn${r === range ? " active" : ""}`}
                onClick={() => pick(r)}
              >
                {RANGE_LABEL[r]}
              </button>
            ))}
          </div>
          <span className="kicker-note">
            {loading ? "Loading…" : (
              <>
                {RANGE_LABEL[detail.range]} change <Chg pct={periodPct} />
              </>
            )}
          </span>
        </div>
        <PriceChart detail={detail} base={periodBase} />
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Key Stats</h2>
        </div>
        <div className="board stats-board">
          {stats.map((s) => (
            <div className="board-cell" key={s.label}>
              <span className="b-name">{s.label}</span>
              <span className="b-value stat-value">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      <AdSlot slot="0000000003" format="leaderboard" />

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Trade {isCrypto ? "Crypto" : "Stocks"}</h2>
          <span className="kicker-note">Partner offers</span>
        </div>
        {partners.map((p) => (
          <a className="p-row" key={p.name} href={p.url} target="_blank" rel="noopener noreferrer sponsored">
            <span className="p-main">
              <span className="p-name">{p.name}</span>
              <span className="p-desc">{p.desc}</span>
            </span>
            <span className="p-arrow" aria-hidden="true">
              →
            </span>
          </a>
        ))}
        <p className="fineprint">{AFFILIATE_DISCLOSURE}</p>
      </section>
    </>
  );
}
