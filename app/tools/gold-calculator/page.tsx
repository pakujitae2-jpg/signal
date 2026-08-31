import { GoldPage, goldMetadata } from "@/components/pages/GoldPage";
import type { GoldParams } from "@/components/pages/GoldPage";

export const dynamic = "force-dynamic";
export const metadata = goldMetadata("en");

type Props = { searchParams: Promise<GoldParams> };

export default async function Page({ searchParams }: Props) {
  return GoldPage({ lang: "en", params: await searchParams });
}
