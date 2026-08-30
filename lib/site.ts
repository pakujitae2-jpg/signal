// Canonical site origin for metadata, sitemap, and OG URLs.
// Production domain: rin-kaku.com. NEXT_PUBLIC_SITE_URL overrides it
// (useful if the domain ever changes without a code push).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rin-kaku.com").replace(/\/$/, "");
