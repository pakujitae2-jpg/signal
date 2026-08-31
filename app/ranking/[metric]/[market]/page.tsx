import type { Metadata } from "next";
import { RankingPage, rankingMetadata } from "@/components/pages/RankingPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ metric: string; market: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { metric, market } = await params;
  return rankingMetadata("en", metric, market);
}

export default async function Page({ params }: Props) {
  const { metric, market } = await params;
  return RankingPage({ lang: "en", metric, market });
}
