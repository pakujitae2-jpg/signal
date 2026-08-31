// Shared chrome for opengraph-image.tsx generators: bone background, ink
// border, PNL404 wordmark footer with an as-of stamp so a stale screenshot
// is self-identifying. Plain inline-styled divs only — next/og's Satori
// renderer doesn't support CSS classes or external stylesheets.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_BG = "#f9f8f4";
export const OG_INK = "#1a1916";
export const OG_MUTED = "#55524a";
export const OG_UP = "#0d7d55";
export const OG_DOWN = "#c62828";

export function ogColor(pct: number | null): string {
  if (pct === null || !isFinite(pct)) return OG_MUTED;
  if (pct > 0.005) return OG_UP;
  if (pct < -0.005) return OG_DOWN;
  return OG_MUTED;
}

export function OgFrame({ asOf, tagline, children }: { asOf: string; tagline: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: OG_BG,
        color: OG_INK,
        padding: "56px 80px 48px",
        borderTop: `14px solid ${OG_INK}`,
      }}
    >
      {children}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26 }}>
        <span style={{ display: "flex", fontWeight: 700, letterSpacing: "0.12em" }}>
          PNL<span style={{ color: OG_DOWN }}>404</span>
        </span>
        <span style={{ color: OG_MUTED }}>{tagline} · {asOf}</span>
      </div>
    </div>
  );
}
