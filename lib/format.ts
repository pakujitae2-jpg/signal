// Shared formatters. Locale and timezone are pinned so server-rendered
// markup matches client hydration exactly.

export const CURRENCY_SIGN: Record<string, string> = { KRW: "₩", JPY: "¥", USD: "$" };

export function fmtNum(v: number | null, currency?: string): string {
  if (v === null || !isFinite(v)) return "—";
  const abs = Math.abs(v);
  const digits = abs >= 10000 ? 0 : abs >= 1 ? 2 : 4;
  const s = v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return currency ? `${CURRENCY_SIGN[currency] ?? ""}${s}` : s;
}

export function fmtSigned(v: number | null): string {
  if (v === null || !isFinite(v)) return "—";
  const sign = v > 0 ? "+" : v < 0 ? "−" : "";
  const abs = Math.abs(v);
  const digits = abs >= 10000 ? 0 : abs >= 0.01 ? 2 : 4;
  return `${sign}${abs.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function fmtCompactUsd(v: number): string {
  if (!isFinite(v)) return "—";
  return `$${v.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 })}`;
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function fmtTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "UTC" });
}

export function fmtAgo(iso: string, nowMs: number): string {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return "";
  const s = Math.max(0, Math.floor((nowMs - t) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
  return `${Math.floor(s / 86400)} days ago`;
}
