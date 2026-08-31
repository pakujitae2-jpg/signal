import { InflationHub, inflationHubMetadata } from "@/components/pages/InflationPage";

export const dynamic = "force-static";
export const metadata = inflationHubMetadata("en");

export default function Page() {
  return <InflationHub lang="en" />;
}
