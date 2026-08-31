import { ToolsHub, toolsHubMetadata } from "@/components/pages/ToolsHub";

export const dynamic = "force-static";
export const metadata = toolsHubMetadata("en");

export default function Page() {
  return <ToolsHub lang="en" />;
}
