import type { Metadata } from "next";
import { ComparePage, compareMetadata } from "@/components/pages/ComparePage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ pair: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  return compareMetadata("en", pair);
}

export default async function Page({ params }: Props) {
  const { pair } = await params;
  return ComparePage({ lang: "en", slug: pair });
}
