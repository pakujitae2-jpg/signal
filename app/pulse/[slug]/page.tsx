import type { Metadata } from "next";
import { PulsePage, pulseMetadata } from "@/components/pages/PulsePage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return pulseMetadata("en", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return PulsePage({ lang: "en", slug });
}
