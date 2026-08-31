"use client";

import { useEffect, useState } from "react";
import { fillMH, countdownLabel, type MarketHoursCopy } from "@/lib/market-hours-copy";
import type { MarketKey } from "@/config/exchange-schedule";
import type { Lang } from "@/lib/i18n";

const POLL_MS = 30_000;

export type StatusJson = {
  now: string;
  open: boolean;
  activeSession: string | null;
  changesAt: string;
  isHoliday: boolean;
  holidayName: { en: string; ko: string; ja: string } | null;
};

/** Live open/closed badge with a ticking countdown. Polls the status API every
 * 30s (mirrors components/KimchiView.tsx) and re-syncs on tab focus so the
 * label never drifts far from the server's clock. */
export default function MarketStatusBadge({
  market,
  lang,
  initial,
  t,
  size = "large",
}: {
  market: MarketKey;
  lang: Lang;
  initial: StatusJson;
  t: MarketHoursCopy;
  size?: "large" | "compact";
}) {
  const [data, setData] = useState<StatusJson>(initial);
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    let stopped = false;

    async function refresh() {
      try {
        const res = await fetch(`/api/market-hours/${market}`);
        if (res.ok) {
          const next = (await res.json()) as StatusJson;
          if (!stopped) setData(next);
        }
      } catch {
        // keep the current snapshot on a transient failure
      }
    }

    const poll = setInterval(refresh, POLL_MS);
    const clock = setInterval(() => setNowMs(Date.now()), 1000);
    setNowMs(Date.now());

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
  }, [market]);

  const changesAtMs = new Date(data.changesAt).getTime();
  // Once the countdown reaches the target, flip locally rather than show a
  // stuck "0m" — open/closed always alternates, so the flip is correct even
  // before the next poll confirms the new changesAt.
  const ms = nowMs === null ? changesAtMs - new Date(data.now).getTime() : changesAtMs - nowMs;
  const open = ms > 0 ? data.open : !data.open;
  const countdown = nowMs === null ? null : countdownLabel(lang, ms);

  const sessionLabel = data.activeSession ? t.sessionLabel[data.activeSession] : null;
  // Crypto's "always" block never actually ends — it is immediately followed
  // by an identical one — so a countdown to that boundary would read as
  // "closes in 4h" for a market that never closes. Show the session label
  // only, with no countdown, whenever it's active.
  const neverCloses = data.activeSession === "always";

  return (
    <div className={size === "large" ? "quote-head" : undefined}>
      <span className="dateline-status">
        <span className={`status-dot${open ? "" : " closed"}`} aria-hidden="true" />
        <span className={open ? "live-badge" : "closed-badge"}>{open ? t.statusOpenNow : t.statusClosedNow}</span>
        {sessionLabel && open && <span className="quote-sub"> · {sessionLabel}</span>}
        {countdown !== null && !neverCloses && (
          <span className="quote-sub"> · {fillMH(open ? t.closesIn : t.opensIn, { T: countdown })}</span>
        )}
      </span>
      {data.isHoliday && data.holidayName && (
        <p className="wire-note">{fillMH(t.holidayToday, { NAME: data.holidayName[lang] })}</p>
      )}
    </div>
  );
}
