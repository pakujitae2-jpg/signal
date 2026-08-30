// Canonical site origin for metadata, sitemap, and OG URLs.
// Production domain: pnl404.com. NEXT_PUBLIC_SITE_URL overrides it
// (useful if the domain ever changes without a code push).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pnl404.com").replace(/\/$/, "");

// Google AdSense publisher ID. The env var can override it per deployment.
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-1754834273377558";
