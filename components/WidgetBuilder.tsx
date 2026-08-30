"use client";

import { useMemo, useState } from "react";
import { TICKER_MAX } from "@/lib/ticker";

// Symbol picker plus the iframe snippet. The preview is the real embed in an
// iframe, so what a publisher sees here is exactly what their readers get.

export type WidgetOption = { symbol: string; name: string };

export default function WidgetBuilder({
  options,
  defaults,
  origin,
  embedPath,
  t,
}: {
  options: WidgetOption[];
  defaults: string[];
  origin: string;
  embedPath: string;
  t: {
    previewHeading: string;
    symbolsHeading: string;
    symbolsNote: string;
    snippetHeading: string;
    copyButton: string;
    copiedButton: string;
    openEmbed: string;
    resetButton: string;
    emptyNote: string;
  };
}) {
  const [picks, setPicks] = useState<string[]>(defaults);
  const [copied, setCopied] = useState(false);

  const src = useMemo(
    () => `${origin}${embedPath}?s=${picks.map(encodeURIComponent).join(",")}`,
    [picks, origin, embedPath]
  );
  const snippet = `<iframe src="${src}" width="100%" height="46" style="border:0" title="PNL404 ticker" loading="lazy"></iframe>`;

  function toggle(symbol: string) {
    setPicks((cur) =>
      cur.includes(symbol) ? cur.filter((s) => s !== symbol) : cur.length >= TICKER_MAX ? cur : [...cur, symbol]
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the snippet is selectable in the box below.
    }
  }

  return (
    <>
      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.previewHeading}</h2>
        </div>
        {picks.length === 0 ? (
          <p className="wire-note">{t.emptyNote}</p>
        ) : (
          <iframe src={src} width="100%" height={46} style={{ border: "1px solid var(--rule)" }} title="PNL404 ticker preview" />
        )}
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.symbolsHeading}</h2>
          <span className="kicker-note">
            {picks.length}/{TICKER_MAX} · {t.symbolsNote}
          </span>
        </div>
        <div className="pair-grid">
          {options.map((o) => (
            <button
              key={o.symbol}
              type="button"
              className={`pair-link${picks.includes(o.symbol) ? " picked" : ""}`}
              aria-pressed={picks.includes(o.symbol)}
              onClick={() => toggle(o.symbol)}
            >
              {o.name}
            </button>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.snippetHeading}</h2>
        </div>
        <pre className="code-block">{snippet}</pre>
        <div className="range-row" style={{ marginTop: 12 }}>
          <button type="button" className="range-btn active" onClick={copy} disabled={picks.length === 0}>
            {copied ? t.copiedButton : t.copyButton}
          </button>
          <a className="range-btn" href={src} target="_blank" rel="noopener noreferrer">
            {t.openEmbed}
          </a>
          <button type="button" className="range-btn" onClick={() => setPicks(defaults)}>
            {t.resetButton}
          </button>
        </div>
      </section>
    </>
  );
}
