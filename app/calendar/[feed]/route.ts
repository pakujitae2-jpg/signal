import { NextResponse } from "next/server";
import {
  BOJ_MEETINGS,
  BOK_MEETINGS,
  FOMC_MEETINGS,
  JAPAN,
  KOREA,
  US,
  type CentralBankMeeting,
} from "@/config/exchange-schedule";
import { holidaysInYears, type Holiday } from "@/lib/market-hours";
import { buildIcs, type IcsEvent } from "@/lib/ics";

// Subscribable .ics feeds for the market-hours pages: three holiday
// calendars and three central-bank meeting calendars. Not an indexable page
// (no HTML, not in the sitemap) — linked directly from the market-hours
// pages via a webcal:// button.

export const dynamic = "force-dynamic";

function nextDay(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

function holidayEvents(prefix: string, holidays: Holiday[]): IcsEvent[] {
  return holidays.map((h) => ({
    uid: `${prefix}-${h.date}`,
    startDate: h.date,
    endDateExclusive: nextDay(h.date),
    summary: h.earlyClose ? `${h.name.en} (early close ${h.earlyClose})` : `${h.name.en} — market closed`,
  }));
}

function meetingEvents(prefix: string, name: string, meetings: CentralBankMeeting[]): IcsEvent[] {
  return meetings.map((m) => ({
    uid: `${prefix}-${m.decision}`,
    startDate: m.start,
    endDateExclusive: nextDay(m.decision),
    summary: m.start === m.decision ? `${name} rate decision` : `${name} meeting (decision ${m.decision})`,
  }));
}

function feedContent(feed: string, dtstamp: string): { name: string; ics: string } | null {
  const years = [2026, 2027, 2028];
  if (feed === "holidays-us.ics") {
    const events = holidayEvents("us-holiday", holidaysInYears(US, years));
    return { name: "PNL404 — US Market Holidays (NYSE/Nasdaq)", ics: buildIcs("PNL404 — US Market Holidays", events, dtstamp) };
  }
  if (feed === "holidays-kr.ics") {
    const events = holidayEvents("kr-holiday", holidaysInYears(KOREA, years));
    return { name: "PNL404 — Korea Market Holidays (KRX)", ics: buildIcs("PNL404 — Korea Market Holidays", events, dtstamp) };
  }
  if (feed === "holidays-jp.ics") {
    const events = holidayEvents("jp-holiday", holidaysInYears(JAPAN, years));
    return { name: "PNL404 — Japan Market Holidays (TSE)", ics: buildIcs("PNL404 — Japan Market Holidays", events, dtstamp) };
  }
  if (feed === "fomc.ics") {
    const events = meetingEvents("fomc", "FOMC", FOMC_MEETINGS);
    return { name: "PNL404 — FOMC Meetings", ics: buildIcs("PNL404 — FOMC Meetings", events, dtstamp) };
  }
  if (feed === "boj.ics") {
    const events = meetingEvents("boj", "BOJ", BOJ_MEETINGS);
    return { name: "PNL404 — BOJ Policy Meetings", ics: buildIcs("PNL404 — BOJ Policy Meetings", events, dtstamp) };
  }
  if (feed === "bok.ics") {
    const events = meetingEvents("bok", "BOK", BOK_MEETINGS);
    return { name: "PNL404 — BOK Rate Decisions", ics: buildIcs("PNL404 — BOK Rate Decisions", events, dtstamp) };
  }
  return null;
}

export async function GET(_req: Request, { params }: { params: Promise<{ feed: string }> }) {
  const { feed } = await params;
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const content = feedContent(feed, dtstamp);
  if (!content) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(content.ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${feed}"`,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
