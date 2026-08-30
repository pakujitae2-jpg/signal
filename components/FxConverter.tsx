"use client";

import { useState } from "react";

function fmtAmt(v: number): string {
  if (!isFinite(v)) return "";
  const digits = Math.abs(v) >= 100 ? 2 : Math.abs(v) >= 1 ? 4 : 6;
  return v.toLocaleString("en-US", { maximumFractionDigits: digits });
}

/** Two-way currency converter, seeded with the server-fetched rate. */
export default function FxConverter({ base, quote, rate }: { base: string; quote: string; rate: number }) {
  const [baseAmt, setBaseAmt] = useState("1");
  const [quoteAmt, setQuoteAmt] = useState(fmtAmt(rate));

  function onBase(v: string) {
    setBaseAmt(v);
    const n = parseFloat(v.replace(/,/g, ""));
    setQuoteAmt(isFinite(n) ? fmtAmt(n * rate) : "");
  }

  function onQuote(v: string) {
    setQuoteAmt(v);
    const n = parseFloat(v.replace(/,/g, ""));
    setBaseAmt(isFinite(n) ? fmtAmt(n / rate) : "");
  }

  return (
    <div className="fx-converter">
      <label className="fx-field">
        <span className="fx-cur">{base}</span>
        <input inputMode="decimal" value={baseAmt} onChange={(e) => onBase(e.target.value)} aria-label={`Amount in ${base}`} />
      </label>
      <span className="fx-eq" aria-hidden="true">=</span>
      <label className="fx-field">
        <span className="fx-cur">{quote}</span>
        <input inputMode="decimal" value={quoteAmt} onChange={(e) => onQuote(e.target.value)} aria-label={`Amount in ${quote}`} />
      </label>
    </div>
  );
}
