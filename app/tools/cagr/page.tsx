import type { Metadata } from "next";
import { CagrPage, cagrMetadata, type CagrParams } from "@/components/pages/CagrPage";

export const dynamic = "force-dynamic";
export const metadata = cagrMetadata("en");

type Props = { searchParams: Promise<CagrParams> };

export default async function Page({ searchParams }: Props) {
  return <CagrPage lang="en" params={await searchParams} />;
}
