import type { MetadataRoute } from "next";
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
    ...["us", "japan", "korea", "crypto"].map((region) => ({
      url: `${SITE_URL}/markets/${region}`,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
    ...POPULAR_SYMBOLS.map((symbol) => ({
      url: `${SITE_URL}/quote/${encodeURIComponent(symbol)}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
  ];
}
