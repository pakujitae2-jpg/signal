import { AthHub, athHubMetadata } from "@/components/pages/AthPage";

export const dynamic = "force-dynamic";
export const metadata = athHubMetadata("en");

export default async function Page() {
  return AthHub({ lang: "en" });
}
