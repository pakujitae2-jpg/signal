"use client";

import { useEffect, useRef } from "react";

// Rakuten Ichiba contextual-match banner (468x160). The widget script
// renders itself with document.write, which breaks if run in a React
// page after hydration — so it gets its own iframe document, written
// once on mount, where document.write works as the widget expects.
const WIDGET_HTML = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden}body{display:flex;justify-content:center}</style></head><body><script type="text/javascript">rakuten_design="slide";rakuten_affiliateId="3907049d.98f62c6e.3907049e.1c379405";rakuten_items="ctsmatch";rakuten_genreId="0";rakuten_size="468x160";rakuten_target="_blank";rakuten_theme="gray";rakuten_border="off";rakuten_auto_mode="on";rakuten_genre_title="off";rakuten_recommend="on";rakuten_ts="1788098820947";<\/script><script type="text/javascript" src="https://xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js?20230106"><\/script></body></html>`;

export default function RakutenAd() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(WIDGET_HTML);
    doc.close();
  }, []);

  return (
    <div className="ad-unit ad-rakuten" role="complementary" aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      <iframe ref={frameRef} className="rakuten-frame" title="Rakuten Ichiba" scrolling="no" loading="lazy" />
    </div>
  );
}
