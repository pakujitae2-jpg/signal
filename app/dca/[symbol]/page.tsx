import type { Metadata } from "next";
import { DcaPage, dcaMetadata, type DcaParams } from "@/components/pages/DcaPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ symbol: string }>; searchParams: Promise<DcaParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  return dcaMetadata("en", decodeURIComponent(symbol));
}

export default async function Page({ params, searchParams }: Props) {
  const { symbol } = await params;
  return DcaPage({ lang: "en", symbol: decodeURIComponent(symbol), params: await searchParams });
}
