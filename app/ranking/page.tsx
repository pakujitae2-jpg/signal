import { RankingHub, rankingHubMetadata } from "@/components/pages/RankingPage";

export const dynamic = "force-static";
export const metadata = rankingHubMetadata("en");

export default function Page() {
  return <RankingHub lang="en" />;
}
