import { PulseHub, pulseHubMetadata } from "@/components/pages/PulsePage";

export const dynamic = "force-static";
export const metadata = pulseHubMetadata("en");

export default function Page() {
  return <PulseHub lang="en" />;
}
