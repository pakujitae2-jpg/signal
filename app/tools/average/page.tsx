import type { Metadata } from "next";
import { AverageCostPage, averageMetadata, type AverageParams } from "@/components/pages/AverageCostPage";

export const dynamic = "force-dynamic";
export const metadata = averageMetadata("en");

type Props = { searchParams: Promise<AverageParams> };

export default async function Page({ searchParams }: Props) {
  return AverageCostPage({ lang: "en", params: await searchParams });
}
