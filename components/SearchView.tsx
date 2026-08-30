"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchEntry } from "@/lib/search-index";

// The whole catalog ships with the page, so typing filters instantly with no
// round trip. Every token must match somewhere, and an exact or prefix hit on
// the title outranks a loose match in the extra terms.

function score(entry: SearchEntry, tokens: string[]): number {
  const title = entry.t.toLowerCase();
  const hay = `${title} ${entry.k.toLowerCase()} ${entry.x}`;
  let total = 0;
  for (const t of tokens) {
    if (title === t) total += 12;
    else if (title.startsWith(t)) total += 8;
    else if (hay.includes(t)) total += 3;
    else return -1;
  }
  return total;
}

export default function SearchView({
  index,
  t,
}: {
  index: SearchEntry[];
  t: { placeholder: string; noResults: string; emptyPrompt: string; resultsCount: string; browseHeading: string };
}) {
  const [query, setQuery] = useState("");

  const hits = useMemo(() => {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return null;
    return index
      .map((entry) => ({ entry, s: score(entry, tokens) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || a.entry.t.localeCompare(b.entry.t))
      .slice(0, 40)
      .map((r) => r.entry);
  }, [query, index]);

  return (
    <>
      <section className="block">
        <div className="fx-converter">
          <label className="fx-field" style={{ flex: 1 }}>
            <span className="fx-cur">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              autoFocus
            />
          </label>
        </div>
      </section>

      <section className="block">
        {hits === null ? (
          <p className="wire-note">{t.emptyPrompt}</p>
        ) : hits.length === 0 ? (
          <p className="wire-note">{t.noResults}</p>
        ) : (
          <>
            <div className="kicker">
              <span className="kicker-note">{t.resultsCount.replace("{n}", String(hits.length))}</span>
            </div>
            <div className="table-scroll">
              <table className="mkt">
                <tbody>
                  {hits.map((h) => (
                    <tr key={h.h}>
                      <td style={{ textAlign: "left" }}>
                        <Link className="qlink" href={h.h}>
                          <span className="cell-name">{h.t}</span>
                          <span className="sym">{h.k}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </>
  );
}
