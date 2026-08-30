import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketsPage, marketsMetadata } from "@/components/pages/MarketsPage";
import { isLang } from "@/lib/i18n";
import { REGION_KEYS, type RegionKey } from "@/lib/page-copy";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; region: string }> };

const valid = (r: string): r is RegionKey => (REGION_KEYS as string[]).includes(r);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, region } = await params;
  if (!isLang(lang) || lang === "en" || !valid(region)) return { title: "PNL404" };
  return marketsMetadata(lang, region);
}

export default async function Page({ params }: Props) {
  const { lang, region } = await params;
  if (!isLang(lang) || lang === "en" || !valid(region)) notFound();
  return MarketsPage({ lang, region });
}
