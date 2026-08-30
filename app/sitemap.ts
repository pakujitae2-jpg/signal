import type { MetadataRoute } from "next";
import { CURRENCY_CODES, FX_SLUGS } from "@/lib/fx";
import { POPULAR_SYMBOLS } from "@/lib/popular";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/kimchi-premium`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/fear-greed`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/quotes`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/convert`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...["us", "japan", "korea", "crypto"].map((region) => ({
      url: `${SITE_URL}/markets/${region}`,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
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
    ...POPULAR_SYMBOLS.map((symbol) => ({
      url: `${SITE_URL}/quote/${encodeURIComponent(symbol)}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
  ];
}
