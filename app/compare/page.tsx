import { CompareHub, compareHubMetadata } from "@/components/pages/ComparePage";

export const dynamic = "force-static";
export const metadata = compareHubMetadata("en");

export default function Page() {
  return <CompareHub lang="en" />;
}
