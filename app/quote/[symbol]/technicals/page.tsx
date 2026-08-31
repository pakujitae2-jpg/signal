import type { Metadata } from "next";
import { TechnicalsPage, technicalsMetadata } from "@/components/quote/TechnicalsPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  return technicalsMetadata("en", decodeURIComponent(symbol));
}

export default async function Page({ params }: Props) {
  const { symbol } = await params;
  return TechnicalsPage({ lang: "en", symbol: decodeURIComponent(symbol) });
}
