// Canonical site origin for metadata, sitemap, and OG URLs.
// Set NEXT_PUBLIC_SITE_URL (e.g. https://yourdomain.com) once the custom
// domain is chosen; until then Vercel's production URL is the fallback.

const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

export const SITE_URL = (fromEnv ?? "http://localhost:3000").replace(/\/$/, "");
