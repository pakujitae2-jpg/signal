import type { Lang } from "./i18n";
import type { MarketKey } from "@/config/exchange-schedule";
import { MARKET_HOURS_COPY } from "./market-hours-copy.generated";

// Copy for the market-hours family: the /market-hours hub, one page per
// market, the quick-answer /is-the-market-open page, and /market-holidays
// year pages. One shared shape (below) covers all four, so a missing key
// fails the type-check instead of shipping blank text.

export type MarketHoursCopy = {
  marketName: Record<MarketKey, string>;
  sessionLabel: Record<string, string>;

  statusOpenNow: string;
  statusClosedNow: string;
  /** {T} */ closesIn: string;
  /** {T} */ opensIn: string;
  /** {NAME} */ holidayToday: string;
  /** {TIME} */ earlyCloseToday: string;
  asOf: string;

  hubTitle: string;
  hubDescription: string;
  hubH1: string;
  hubSub: string;
  colMarket: string;
  colStatus: string;
  colHours: string;
  colNext: string;

  /** {MARKET} */ marketTitle: string;
  /** {MARKET} */ marketDescription: string;
  sessionsHeading: string;
  upcomingHolidaysHeading: string;
  noUpcomingHolidays: string;
  centralBankHeading: Partial<Record<MarketKey, string>>;
  noUpcomingMeeting: string;
  calendarHeading: string;
  addToCalendar: string;
  /** {YEAR} */ holidayYearLink: string;
  koreaExtensionNote: string;
  koreaPremarketNote: string;
  aboutHeading: string;
  aboutP: string;

  quickTitle: string;
  quickDescription: string;
  quickH1: string;
  quickYes: string;
  quickNo: string;
  otherMarketsHeading: string;

  /** {MARKET} {YEAR} */ holidayYearTitle: string;
  /** {MARKET} {YEAR} */ holidayYearDescription: string;
  /** {MARKET} {YEAR} */ holidayYearH1: string;
  colDate: string;
  colDay: string;
  colHoliday: string;
  colType: string;
  fullClosureLabel: string;
  earlyCloseLabel: string;
  notYetAnnounced: string;
  otherYearsHeading: string;

  footer: string;
};

export const marketHoursCopy = (lang: Lang): MarketHoursCopy => MARKET_HOURS_COPY[lang];

/** "2h 14m" / "2시간 14분" / "2時間14分" style countdown, from a millisecond duration. */
export function countdownLabel(lang: Lang, ms: number): string {
  const totalMin = Math.max(0, Math.round(ms / 60_000));
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  if (lang === "ko") return d > 0 ? `${d}일 ${h}시간` : h > 0 ? `${h}시간 ${m}분` : `${m}분`;
  if (lang === "ja") return d > 0 ? `${d}日${h}時間` : h > 0 ? `${h}時間${m}分` : `${m}分`;
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Replace {TOKEN} placeholders. Unknown tokens are left as-is. */
export function fillMH(template: string, vars: Record<string, string>): string {
  return template.replace(/\{([A-Za-z]+)\}/g, (m, k) => vars[k] ?? m);
}
