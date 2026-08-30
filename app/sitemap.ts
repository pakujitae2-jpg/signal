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
    ...POPULAR_SYMBOLS.map((symbol) => ({
      url: `${SITE_URL}/quote/${encodeURIComponent(symbol)}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
  ];
}
