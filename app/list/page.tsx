import { ListsHub, listsHubMetadata } from "@/components/pages/ListsPage";

export const dynamic = "force-static";
export const metadata = listsHubMetadata("en");

export default function Page() {
  return <ListsHub lang="en" />;
}
