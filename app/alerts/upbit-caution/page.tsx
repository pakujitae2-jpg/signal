import { UpbitCautionPage, upbitCautionMetadata } from "@/components/pages/UpbitCautionPage";

export const dynamic = "force-dynamic";
export const metadata = upbitCautionMetadata("en");

export default function Page() {
  return <UpbitCautionPage lang="en" />;
}
