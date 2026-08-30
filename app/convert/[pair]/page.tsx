import type { Metadata } from "next";
import { PairPage, pairMetadata } from "@/components/convert/PairPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ pair: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  return pairMetadata("en", pair);
}

export default async function ConvertPage({ params }: Props) {
  const { pair } = await params;
  return PairPage({ lang: "en", slug: pair });
}
