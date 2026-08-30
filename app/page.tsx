import Dashboard from "@/components/Dashboard";
import { homeCopy } from "@/lib/home-copy";
import { getMarketData } from "@/lib/market";
import { homeMetadata, homeNames } from "@/components/pages/HomePage";

export const dynamic = "force-dynamic";

export const metadata = homeMetadata("en");

export default async function Home() {
  // 서버에서 첫 데이터를 채워 보내 첫 화면부터 완성된 상태로 렌더링한다.
  // 이후에는 클라이언트가 /api/market을 주기적으로 다시 불러온다.
  const initialData = await getMarketData();
  return <Dashboard initialData={initialData} t={homeCopy("en")} lang="en" names={homeNames("en", initialData)} />;
}
