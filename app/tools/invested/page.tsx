import { InvestedPage, investedMetadata } from "@/components/pages/InvestedPage";
import type { InvestedParams } from "@/components/pages/InvestedPage";

export const dynamic = "force-dynamic";
export const metadata = investedMetadata("en");

type Props = { searchParams: Promise<InvestedParams> };

export default async function Page({ searchParams }: Props) {
  return InvestedPage({ lang: "en", params: await searchParams });
}
