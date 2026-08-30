"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * Ad unit. When NEXT_PUBLIC_ADSENSE_CLIENT (e.g. ca-pub-XXXX) is set, a real
 * responsive AdSense unit renders; otherwise a quiet reserved space keeps the
 * layout stable, the way news sites reserve ad space before fill.
 * `slot` is the ad-unit ID issued by AdSense.
 */
export default function AdSlot({ slot, format }: { slot: string; format: "leaderboard" | "rectangle" }) {
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // Ad blockers may reject the push; the page continues fine.
    }
  }, []);

  return (
    <div className={`ad-unit ad-${format}`} role="complementary" aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      {ADSENSE_CLIENT ? (
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
