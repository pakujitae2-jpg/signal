import type { Metadata } from "next";
import { DividendsPage, dividendsMetadata } from "@/components/quote/DividendsPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  return dividendsMetadata("en", symbol);
}

export default async function Page({ params }: Props) {
  const { symbol } = await params;
  return DividendsPage({ lang: "en", symbol });
}
