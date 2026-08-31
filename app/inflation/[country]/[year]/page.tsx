import type { Metadata } from "next";
import { InflationPage, inflationMetadata } from "@/components/pages/InflationPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ country: string; year: string }>; searchParams: Promise<{ amount?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, year } = await params;
  return inflationMetadata("en", country, year);
}

export default async function Page({ params, searchParams }: Props) {
  const { country, year } = await params;
  const { amount } = await searchParams;
  return InflationPage({ lang: "en", country, year, amount });
}
