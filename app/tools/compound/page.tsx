import type { Metadata } from "next";
import { CompoundPage, compoundMetadata, type CompoundParams } from "@/components/pages/CompoundPage";

export const dynamic = "force-dynamic";
export const metadata = compoundMetadata("en");

type Props = { searchParams: Promise<CompoundParams> };

export default async function Page({ searchParams }: Props) {
  return <CompoundPage lang="en" params={await searchParams} />;
}
