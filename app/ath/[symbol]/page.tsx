import type { Metadata } from "next";
import { AthSymbolPage, athSymbolMetadata } from "@/components/pages/AthPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  return athSymbolMetadata("en", symbol);
}

export default async function Page({ params }: Props) {
  const { symbol } = await params;
  return AthSymbolPage({ lang: "en", coinSymbol: symbol });
}
