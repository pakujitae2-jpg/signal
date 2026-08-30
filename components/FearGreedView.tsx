"use client";

import { useEffect, useState } from "react";
import type { FearGreedData, FGPoint } from "@/lib/feargreed";
import type { FearGreedCopy } from "@/lib/page-copy";
import { fmtAgo, fmtTime } from "@/lib/format";

const REFRESH_MS = 10 * 60_000; // the index updates once a day

// Diverging scale: red (fear) → neutral → green (greed). Sign is carried by
// the label and the needle position too, never by hue alone.
function zoneColor(v: number): string {
  if (v <= 24) return "var(--down)";
  if (v <= 44) return "#d97b3a";
  if (v <= 55) return "var(--flat)";
  if (v <= 74) return "#5a9e5e";
  return "var(--up)";
}

const ZONES = [
  { from: 0, to: 24, label: "Extreme Fear" },
  { from: 25, to: 44, label: "Fear" },
  { from: 45, to: 55, label: "Neutral" },
  { from: 56, to: 74, label: "Greed" },
  { from: 75, to: 100, label: "Extreme Greed" },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

function Gauge({ value, label }: { value: number; label: string }) {
  const w = 360;
  const h = 240;
  const cx = w / 2;
  const cy = 168;
  const r = 130;
  const angle = (value / 100) * 180;
  const tip = polar(cx, cy, r - 22, angle);
  const tail = polar(cx, cy, 14, angle + 180);

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Fear and Greed Index ${value}, ${label}`}>
      {ZONES.map((z) => (
        <path
          key={z.label}
          d={arc(cx, cy, r, (z.from / 100) * 180 + 0.6, (z.to / 100) * 180 - 0.6)}
          fill="none"
          stroke={zoneColor((z.from + z.to) / 2)}
          strokeWidth="16"
          strokeLinecap="butt"
        />
      ))}
      <line
        x1={tail.x}
        y1={tail.y}
        x2={tip.x}
        y2={tip.y}
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="6" fill="var(--ink)" />
      <text x={cx} y={cy + 46} textAnchor="middle" className="gauge-value" fill={zoneColor(value)}>
        {value}
      </text>
      <text x={cx} y={cy + 66} textAnchor="middle" className="gauge-label">
        {label.toUpperCase()}
      </text>
      <text x={cx - r} y={cy + 22} textAnchor="middle" className="gauge-end">0</text>
      <text x={cx + r} y={cy + 22} textAnchor="middle" className="gauge-end">100</text>
    </svg>
  );
}

function History({ points }: { points: FGPoint[] }) {
  const w = 700;
  const h = 150;
  const padT = 6;
  const padB = 18;
  if (points.length < 2) return null;
  const x = (i: number) => (i / (points.length - 1)) * w;
  const y = (v: number) => padT + (1 - v / 100) * (h - padT - padB);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join("");

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="90-day history">
      {[25, 50, 75].map((g) => (
        <line key={g} x1={0} x2={w} y1={y(g)} y2={y(g)} stroke="var(--rule)" strokeWidth="1" />
      ))}
      <path d={path} fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1].value)} r="4" fill={zoneColor(points[points.length - 1].value)} stroke="var(--paper)" strokeWidth="1.5" />
      {[25, 50, 75].map((g) => (
        <text key={`t${g}`} x={2} y={y(g) - 3} className="axis-label">{g}</text>
      ))}
    </svg>
  );
}

function Stat({ name, point, label }: { name: string; point: FGPoint | null; label: string }) {
  return (
    <div className="board-cell">
      <span className="b-name">{name}</span>
      <span className="b-value" style={{ color: point ? zoneColor(point.value) : undefined }}>
        {point ? point.value : "—"}
      </span>
      <div className="b-foot">
        <span className="chg flat">{point ? label : "—"}</span>
      </div>
    </div>
  );
}

export default function FearGreedView({ initial, t }: { initial: FearGreedData; t: FearGreedCopy }) {
  // The API classifies in English; map it onto the locale.
  const zone = (label: string): string =>
    ({ "Extreme Fear": t.extremeFear, Fear: t.fear, Neutral: t.neutral, Greed: t.greed, "Extreme Greed": t.extremeGreed })[label] ?? label;
  const [data, setData] = useState<FearGreedData>(initial);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let stopped = false;
    async function refresh() {
      try {
        const res = await fetch("/api/fear-greed");
        if (res.ok) {
          const next = (await res.json()) as FearGreedData;
          if (!stopped) setData(next);
        }
      } catch {
        // keep the current reading
      }
    }
    const poll = setInterval(refresh, REFRESH_MS);
    const clock = setInterval(() => setNow(Date.now()), 1000);
    setNow(Date.now());
    return () => {
      stopped = true;
      clearInterval(poll);
      clearInterval(clock);
    };
  }, []);

  return (
    <>
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{t.h1}</h1>
          <p className="quote-sub">
            {t.sub.replace("{time}", fmtTime(data.updatedAt))}
            {now !== null && ` · ${fmtAgo(data.updatedAt, now)}`}
          </p>
        </div>
      </div>

      {data.source === "sample" && <p className="wire-note">{t.sampleNote}</p>}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.todayHeading}</h2>
          <span className="kicker-note">{t.todayNote}</span>
        </div>
        <div className="gauge-wrap">
          <Gauge value={data.now.value} label={zone(data.now.label)} />
        </div>
        <div className="board">
          <Stat name={t.yesterday} point={data.yesterday} label={zone(data.yesterday?.label ?? "")} />
          <Stat name={t.lastWeek} point={data.lastWeek} label={zone(data.lastWeek?.label ?? "")} />
          <Stat name={t.lastMonth} point={data.lastMonth} label={zone(data.lastMonth?.label ?? "")} />
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.historyHeading}</h2>
        </div>
        <History points={data.history} />
      </section>
    </>
  );
}
