import type { MetadataRoute } from "next";
import { COMPARE_SLUGS } from "@/lib/compare";
import { HOLIDAY_MARKET_KEYS, MARKET_KEYS } from "@/config/exchange-schedule";
import { PULSE_SLUGS } from "@/lib/pulse";
import { CURRENCY_CODES, FX_SLUGS } from "@/lib/fx";
import { DON_PRESETS, donSlug } from "@/lib/gold";
import { POPULAR_SYMBOLS } from "@/lib/popular";
import { SITE_URL } from "@/lib/site";
import { byGroup } from "@/lib/universe";

const MARKET_HOLIDAY_YEARS = [2026, 2027];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // The front page exists in every locale.
    ...["", "/ko", "/ja"].map((p) => ({
      url: `${SITE_URL}${p || "/"}`,
      changeFrequency: "hourly" as const,
      priority: p === "" ? 1 : 0.9,
    })),
    ...["", "/ko", "/ja"].flatMap((p) => [
      { url: `${SITE_URL}${p}/kimchi-premium`, changeFrequency: "hourly" as const, priority: 0.9 },
      { url: `${SITE_URL}${p}/fear-greed`, changeFrequency: "daily" as const, priority: 0.9 },
      { url: `${SITE_URL}${p}/bitcoin-dominance`, changeFrequency: "hourly" as const, priority: 0.8 },
      { url: `${SITE_URL}${p}/altcoin-season`, changeFrequency: "hourly" as const, priority: 0.8 },
      { url: `${SITE_URL}${p}/movers`, changeFrequency: "hourly" as const, priority: 0.9 },
      { url: `${SITE_URL}${p}/compare`, changeFrequency: "weekly" as const, priority: 0.8 },
      { url: `${SITE_URL}${p}/tools/invested`, changeFrequency: "weekly" as const, priority: 0.8 },
      { url: `${SITE_URL}${p}/tools/gold-calculator`, changeFrequency: "hourly" as const, priority: 0.7 },
      ...DON_PRESETS.map((n) => ({
        url: `${SITE_URL}${p}/tools/gold-calculator/${donSlug(n)}`,
        changeFrequency: "hourly" as const,
        priority: 0.6,
      })),
      { url: `${SITE_URL}${p}/market-hours`, changeFrequency: "hourly" as const, priority: 0.8 },
      { url: `${SITE_URL}${p}/is-the-market-open`, changeFrequency: "hourly" as const, priority: 0.8 },
      ...MARKET_KEYS.map((m) => ({
        url: `${SITE_URL}${p}/market-hours/${m}`,
        changeFrequency: "hourly" as const,
        priority: 0.7,
      })),
      ...HOLIDAY_MARKET_KEYS.flatMap((m) =>
        MARKET_HOLIDAY_YEARS.map((y) => ({
          url: `${SITE_URL}${p}/market-holidays/${m}/${y}`,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }))
      ),
      { url: `${SITE_URL}${p}/ath`, changeFrequency: "hourly" as const, priority: 0.8 },
      ...byGroup("crypto").map((e) => ({
        url: `${SITE_URL}${p}/ath/${e.symbol.replace(/-USD$/, "").toLowerCase()}`,
        changeFrequency: "hourly" as const,
        priority: 0.6,
      })),
      { url: `${SITE_URL}${p}/widget`, changeFrequency: "monthly" as const, priority: 0.6 },
      { url: `${SITE_URL}${p}/pulse`, changeFrequency: "weekly" as const, priority: 0.8 },
      ...PULSE_SLUGS.map((slug) => ({
        url: `${SITE_URL}${p}/pulse/${slug}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      // Head-to-head pages exist in every locale.
      ...COMPARE_SLUGS.map((slug) => ({
        url: `${SITE_URL}${p}/compare/${slug}`,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ]),
    ...["", "/ko", "/ja"].map((p) => ({
      url: `${SITE_URL}${p}/quotes`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/convert`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...["", "/ko", "/ja"].flatMap((p) =>
      ["us", "japan", "korea", "crypto"].map((region) => ({
        url: `${SITE_URL}${p}/markets/${region}`,
        changeFrequency: "hourly" as const,
        priority: 0.9,
      }))
    ),
    // Currency pages exist in English, Korean and Japanese.
    ...["", "/ko", "/ja"].flatMap((p) => [
      ...(p ? [{ url: `${SITE_URL}${p}/convert`, changeFrequency: "weekly" as const, priority: 0.8 }] : []),
      ...CURRENCY_CODES.map((code) => ({
        url: `${SITE_URL}${p}/convert/${code.toLowerCase()}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...FX_SLUGS.map((slug) => ({
        url: `${SITE_URL}${p}/convert/${slug}`,
        changeFrequency: "hourly" as const,
        priority: /^\d/.test(slug) ? 0.6 : 0.8,
      })),
    ]),
    // Quote pages exist in English, Korean and Japanese.
    ...["", "/ko", "/ja"].flatMap((p) =>
      POPULAR_SYMBOLS.map((symbol) => ({
        url: `${SITE_URL}${p}/quote/${encodeURIComponent(symbol)}`,
        changeFrequency: "hourly" as const,
        priority: 0.7,
      }))
    ),
  ];
}
