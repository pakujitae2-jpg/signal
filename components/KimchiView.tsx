"use client";

import { useEffect, useState } from "react";
import type { KimchiData } from "@/lib/kimchi";
import type { KimchiCopy } from "@/lib/page-copy";
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

/** coinNames maps a coin symbol to its localized name; the table falls back to the English name. */
export default function KimchiView({
  initial,
  t,
  coinNames,
}: {
  initial: KimchiData;
  t: KimchiCopy;
  coinNames: Record<string, string>;
}) {
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
          <h2 className="kicker-label">{t.rightNow}</h2>
        </div>
        <div className="board">
          <div className="board-cell">
            <span className="b-name">{t.btcPremium}</span>
            <span className="b-value">{btc ? <Premium pct={btc.premiumPct} size={26} /> : "—"}</span>
          </div>
          <div className="board-cell">
            <span className="b-name">{t.avgPremium.replace("{n}", String(data.rows.length))}</span>
            <span className="b-value">
              <Premium pct={avg} size={26} />
            </span>
          </div>
          <div className="board-cell">
            <span className="b-name">{t.usdKrw}</span>
            <span className="b-value">{fmtNum(data.usdKrw)}</span>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.byCoin}</h2>
          <span className="kicker-note">{t.byCoinNote}</span>
        </div>
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th>{t.colCoin}</th>
                <th>{t.colUpbit}</th>
                <th>{t.colGlobal}</th>
                <th>{t.colGlobalKrw}</th>
                <th>{t.colPremium}</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.symbol}>
                  <td>
                    <span className="cell-name">{coinNames[r.symbol] ?? r.name}</span>
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
