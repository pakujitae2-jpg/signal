"use client";

import { useEffect, useState } from "react";
import type { KimchiData } from "@/lib/kimchi";
import { fmtAgo, fmtNum, fmtTime } from "@/lib/format";

const REFRESH_MS = 30_000;

function Premium({ pct, size = 13 }: { pct: number; size?: number }) {
  const dir = pct > 0.005 ? "up" : pct < -0.005 ? "down" : "flat";
  const sign = pct > 0.005 ? "+" : pct < -0.005 ? "−" : "";
  return (
    <span className={`chg ${dir}`} style={{ fontSize: size }}>
      {sign}
      {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

export default function KimchiView({ initial }: { initial: KimchiData }) {
  const [data, setData] = useState<KimchiData>(initial);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let stopped = false;

    async function refresh() {
      try {
        const res = await fetch("/api/kimchi");
        if (res.ok) {
          const next = (await res.json()) as KimchiData;
          if (!stopped) setData(next);
        }
      } catch {
        // keep current figures on transient failures
      }
    }

    const poll = setInterval(refresh, REFRESH_MS);
    const clock = setInterval(() => setNow(Date.now()), 1000);
    setNow(Date.now());

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopped = true;
      clearInterval(poll);
      clearInterval(clock);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const btc = data.rows.find((r) => r.symbol === "BTC");
  const avg = data.rows.length ? data.rows.reduce((s, r) => s + r.premiumPct, 0) / data.rows.length : 0;

  return (
    <>
      <div className="quote-head">
        <div>
          <h1 className="quote-name">Kimchi Premium</h1>
          <p className="quote-sub">
            Korea's crypto price gap · Upbit vs global markets · updated {fmtTime(data.updatedAt)} UTC
            {now !== null && ` · ${fmtAgo(data.updatedAt, now)}`}
          </p>
        </div>
      </div>

      {data.source === "sample" && (
        <p className="wire-note">Note: sample figures shown — live data connects automatically in production deployments.</p>
      )}

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Right Now</h2>
        </div>
        <div className="board">
          <div className="board-cell">
            <span className="b-name">Bitcoin premium</span>
            <span className="b-value">{btc ? <Premium pct={btc.premiumPct} size={26} /> : "—"}</span>
          </div>
          <div className="board-cell">
            <span className="b-name">Average premium · {data.rows.length} coins</span>
            <span className="b-value">
              <Premium pct={avg} size={26} />
            </span>
          </div>
          <div className="board-cell">
            <span className="b-name">USD/KRW</span>
            <span className="b-value">{fmtNum(data.usdKrw)}</span>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">By Coin</h2>
          <span className="kicker-note">Upbit KRW vs global USD</span>
        </div>
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Upbit (KRW)</th>
                <th>Global (USD)</th>
                <th>Global → KRW</th>
                <th>Premium</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.symbol}>
                  <td>
                    <span className="cell-name">{r.name}</span>
                    <span className="sym">{r.symbol}</span>
                  </td>
                  <td>{fmtNum(r.upbitKrw, "KRW")}</td>
                  <td>{fmtNum(r.globalUsd, "USD")}</td>
                  <td>{fmtNum(r.globalKrw, "KRW")}</td>
                  <td>
                    <Premium pct={r.premiumPct} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
