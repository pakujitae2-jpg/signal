import { WidgetPage, widgetMetadata } from "@/components/pages/WidgetPage";

export const dynamic = "force-static";
export const metadata = widgetMetadata("en");

export default function Page() {
  return <WidgetPage lang="en" />;
}
