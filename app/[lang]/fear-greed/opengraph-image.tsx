import { ImageResponse } from "next/og";
import { OgFrame, OG_SIZE } from "@/components/OgCard";
import { classify, getFearGreed } from "@/lib/feargreed";
import { fmtTime } from "@/lib/format";
import { isLang } from "@/lib/i18n";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Crypto Fear & Greed Index";

function gaugeColor(v: number): string {
  if (v <= 24) return "#c62828";
  if (v <= 44) return "#c9752f";
  if (v <= 55) return "#8b877c";
  if (v <= 74) return "#5a9c6a";
  return "#0d7d55";
}

const LABELS = {
  ko: {
    title: "공포탐욕지수",
    tagline: "코인 시장 심리, 0~100",
    yesterday: "전일",
    week: "1주 전",
    month: "1개월 전",
    zones: { "Extreme Fear": "극도의 공포", Fear: "공포", Neutral: "중립", Greed: "탐욕", "Extreme Greed": "극도의 탐욕" } as Record<string, string>,
  },
  ja: {
    title: "恐怖・強欲指数",
    tagline: "暗号資産市場心理、0〜100",
    yesterday: "前日",
    week: "1週間前",
    month: "1カ月前",
    zones: { "Extreme Fear": "極度の恐怖", Fear: "恐怖", Neutral: "中立", Greed: "強欲", "Extreme Greed": "極度の強欲" } as Record<string, string>,
  },
};

export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = isLang(rawLang) && rawLang !== "en" ? rawLang : "ko";
  const t = LABELS[lang as "ko" | "ja"];
  const data = await getFearGreed();
  const v = data.now.value;
  const color = gaugeColor(v);

  return new ImageResponse(
    (
      <OgFrame asOf={`${fmtTime(data.updatedAt)} UTC`} tagline={t.tagline}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700 }}>{t.title}</div>
            <div style={{ fontSize: 30, color, marginTop: 16, fontWeight: 700 }}>{t.zones[classify(v)] ?? classify(v)}</div>
            <div style={{ display: "flex", gap: 40, marginTop: 30, fontSize: 26, color: "#55524a" }}>
              <span>{t.yesterday} {data.yesterday?.value ?? "—"}</span>
              <span>{t.week} {data.lastWeek?.value ?? "—"}</span>
              <span>{t.month} {data.lastMonth?.value ?? "—"}</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 260,
              height: 260,
              borderRadius: "50%",
              border: `16px solid ${color}`,
              fontSize: 100,
              fontWeight: 700,
              color,
            }}
          >
            {v}
          </div>
        </div>
      </OgFrame>
    ),
    size
  );
}
