import type { Metadata } from "next";
import { FxHistoryPage, fxHistoryMetadata } from "@/components/convert/FxHistoryPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ pair: string; period: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair, period } = await params;
  return fxHistoryMetadata("en", pair, period);
}

export default async function Page({ params }: Props) {
  const { pair, period } = await params;
  return FxHistoryPage({ lang: "en", pairSlug: pair, period });
}
