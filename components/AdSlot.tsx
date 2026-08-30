"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT } from "@/lib/site";

/**
 * Ad unit. With a real ad-unit ID a responsive AdSense unit renders;
 * placeholder IDs (all zeros) keep a quiet reserved space so the layout
 * stays stable while Auto ads (loaded in the root layout) fill the page.
 */
// Real AdSense ad-unit IDs are 10-digit numbers that never start with 0; the
// placeholders in this repo (0000000001…) all do. Requesting an ad for a
// made-up unit ID is what AdSense flags, so placeholders render nothing.
const hasSlot = (slot: string) => !/^0/.test(slot);
export default function AdSlot({ slot, format }: { slot: string; format: "leaderboard" | "rectangle" }) {
  useEffect(() => {
    if (!hasSlot(slot)) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // Ad blockers may reject the push; the page continues fine.
    }
  }, [slot]);

  return (
    <div className={`ad-unit ad-${format}`} role="complementary" aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      {hasSlot(slot) ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="ad-space" />
      )}
    </div>
  );
}
