import type { Metadata } from "next";
import { PeriodMoversPage, periodMoversMetadata } from "@/components/pages/PeriodMoversPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ period: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { period } = await params;
  return periodMoversMetadata("en", period);
}

export default async function Page({ params }: Props) {
  const { period } = await params;
  return PeriodMoversPage({ lang: "en", period });
}
