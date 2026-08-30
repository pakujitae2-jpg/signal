import type { Metadata } from "next";
import { QuotePage, quoteMetadata } from "@/components/quote/QuotePage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  return quoteMetadata("en", symbol);
}

export default async function Page({ params }: Props) {
  const { symbol } = await params;
  return QuotePage({ lang: "en", symbol });
}
