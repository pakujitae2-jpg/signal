import type { Metadata } from "next";
import { homeCopy } from "@/lib/home-copy";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { localName } from "@/lib/names";
import type { MarketData } from "@/lib/types";

// Front-page metadata and the localized names the client Dashboard needs.
// Dashboard cannot import the name table itself — it would ship all 550
// entries to every visitor — so the server sends only the symbols on screen.

export function homeMetadata(lang: Lang): Metadata {
  const c = homeCopy(lang);
  const canonical = prefix(lang) || "/";
  return {
    // The layout template appends "· PNL404"; the front page carries its own.
    title: { absolute: c.title },
    description: c.description,
    alternates: { canonical, languages: languageAlternates("/") },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

export function homeNames(lang: Lang, data: MarketData): Record<string, string> {
  if (lang === "en") return {};
  const out: Record<string, string> = {};
  const add = (symbol: string, fallback: string) => {
    out[symbol] = localName(lang, symbol, fallback);
  };
  for (const group of [data.regions.us, data.regions.jp, data.regions.kr]) {
    for (const q of [...group.indices, ...group.stocks]) add(q.symbol, q.name);
  }
  for (const q of [...data.fx, ...data.commodities]) add(q.symbol, q.name);
  for (const coin of data.crypto) add(`${coin.symbol}-USD`, coin.name);
  return out;
}
