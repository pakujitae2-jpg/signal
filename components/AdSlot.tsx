"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * 광고 슬롯. NEXT_PUBLIC_ADSENSE_CLIENT 환경변수(예: ca-pub-XXXX)가 설정되면
 * 실제 AdSense 반응형 광고를 렌더링하고, 없으면 자리 표시 박스를 보여준다.
 * slot에는 AdSense에서 발급받은 광고 단위 ID를 넣는다.
 */
export default function AdSlot({ slot, label }: { slot: string; label: string }) {
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // 광고 차단기 등으로 실패해도 페이지는 정상 동작
    }
  }, []);

  if (!ADSENSE_CLIENT) {
    return (
      <div className="ad-slot" role="complementary" aria-label="광고">
        <span className="ad-slot-tag">AD</span>
        <span>광고 영역 · {label} (AdSense 연동 대기)</span>
      </div>
    );
  }

  return (
    <div className="ad-slot-live" role="complementary" aria-label="광고">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
