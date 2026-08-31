import type { Holiday, MarketSchedule } from "@/lib/market-hours";
import { usHolidays } from "./us-market-calendar";

// Exchange sessions and holiday tables. US holidays are computed from
// published rules (see us-market-calendar.ts) and never go stale; KRX/JPX
// holidays and the three central banks' meeting dates are committee- or
// lunar-calendar-set and cannot be computed, so they are transcribed here
// from official sources, verified 2026-08-31. Where a market has not yet
// published the next year's calendar, its function simply returns [] for
// that year — callers must render "not yet announced", not a guess.

export type MarketKey = "us" | "korea" | "japan" | "crypto" | "fx";
export const MARKET_KEYS: MarketKey[] = ["us", "korea", "japan", "crypto", "fx"];
/** Markets with a real holiday calendar (crypto and FX trade every day). */
export const HOLIDAY_MARKET_KEYS: MarketKey[] = ["us", "korea", "japan"];

// ------------------------------------------------------------------- US ---
// Session + holiday rules: config/us-market-calendar.ts.
// Source: nyse.com/markets/hours-calendars, cross-checked against
// nasdaqtrader.com's calendar. Regular session 09:30-16:00 ET.

export const US: MarketSchedule = {
  key: "us",
  timeZone: "America/New_York",
  sessions: [{ key: "regular", days: [1, 2, 3, 4, 5], start: "09:30", end: "16:00" }],
  holidays: usHolidays,
};

// ---------------------------------------------------------------- Korea ---
// KRX regular session 09:00-15:30 KST, unchanged. An extended after-market
// session (16:00-20:00) is confirmed on track for 2026-09-14 (KRX
// announcement reported 2026-06-19/23); a separate 07:00-07:50 pre-market
// leg, originally planned alongside it, has been postponed again to "end of
// 2027" and is deliberately NOT modeled as a dated session below — only
// mentioned as a note — because that date is a soft target that has already
// slipped more than once.
//
// Holiday source: KRX-citing calendars (data.krx.co.kr itself is a dynamic
// page that could not be fetched programmatically), verified 2026-08-31.
// 2027 is announced each December — not yet published.

const KR_HOLIDAYS_2026: Holiday[] = [
  { date: "2026-01-01", name: { en: "New Year's Day", ko: "신정", ja: "元日(韓国)" } },
  { date: "2026-02-16", name: { en: "Lunar New Year holiday", ko: "설날 연휴", ja: "旧正月連休" } },
  { date: "2026-02-17", name: { en: "Lunar New Year", ko: "설날", ja: "旧正月" } },
  { date: "2026-02-18", name: { en: "Lunar New Year holiday", ko: "설날 연휴", ja: "旧正月連休" } },
  { date: "2026-03-02", name: { en: "Independence Movement Day (observed)", ko: "삼일절 대체공휴일", ja: "三・一節 振替休日" } },
  { date: "2026-05-01", name: { en: "Labor Day", ko: "근로자의 날", ja: "勤労者の日" } },
  { date: "2026-05-05", name: { en: "Children's Day", ko: "어린이날", ja: "こどもの日(韓国)" } },
  { date: "2026-05-25", name: { en: "Buddha's Birthday (observed)", ko: "부처님오신날 대체공휴일", ja: "釈迦誕生日 振替休日" } },
  { date: "2026-06-03", name: { en: "Local Elections", ko: "제9회 전국동시지방선거", ja: "統一地方選挙(韓国)" } },
  { date: "2026-07-17", name: { en: "Constitution Day", ko: "제헌절", ja: "制憲節" } },
  { date: "2026-08-17", name: { en: "Liberation Day (observed)", ko: "광복절 대체공휴일", ja: "光復節 振替休日" } },
  { date: "2026-09-24", name: { en: "Chuseok holiday", ko: "추석 연휴", ja: "秋夕連休" } },
  { date: "2026-09-25", name: { en: "Chuseok", ko: "추석", ja: "秋夕" } },
  { date: "2026-10-05", name: { en: "National Foundation Day (observed)", ko: "개천절 대체공휴일", ja: "開天節 振替休日" } },
  { date: "2026-10-09", name: { en: "Hangul Day", ko: "한글날", ja: "ハングルの日" } },
  { date: "2026-12-25", name: { en: "Christmas", ko: "크리스마스", ja: "クリスマス" } },
  { date: "2026-12-31", name: { en: "Year-end market closure", ko: "연말 휴장", ja: "年末休場" } },
];

function krHolidays(year: number): Holiday[] {
  return year === 2026 ? KR_HOLIDAYS_2026 : [];
}

export const KOREA: MarketSchedule = {
  key: "korea",
  timeZone: "Asia/Seoul",
  sessions: [
    { key: "regular", days: [1, 2, 3, 4, 5], start: "09:00", end: "15:30" },
    { key: "afterhours", days: [1, 2, 3, 4, 5], start: "16:00", end: "20:00" },
  ],
  effectiveFrom: "2026-09-14",
  priorSessions: [{ key: "regular", days: [1, 2, 3, 4, 5], start: "09:00", end: "15:30" }],
  holidays: krHolidays,
};

// Nextrade (NXT) — Korea's alternative trading system. Own hours (already
// running an evening session today), same holiday calendar as KRX. Source:
// nextrade.co.kr market overview, verified 2026-08-31.
export const NXT: MarketSchedule = {
  key: "nxt",
  timeZone: "Asia/Seoul",
  sessions: [
    { key: "premarket", days: [1, 2, 3, 4, 5], start: "08:00", end: "08:50" },
    { key: "main", days: [1, 2, 3, 4, 5], start: "09:00", end: "15:20" },
    { key: "afterhours", days: [1, 2, 3, 4, 5], start: "15:40", end: "20:00" },
  ],
  holidays: krHolidays,
};

// ---------------------------------------------------------------- Japan ---
// JPX/TSE session: morning 09:00-11:30, lunch break, afternoon 12:30-15:30
// JST (the close moved 15:00->15:30 on 2024-11-05). Holiday source: Japan
// Cabinet Office's gazetted national-holiday list plus JPX's standing rule
// (closed Sat/Sun, national holidays, and Dec 31-Jan 3); cross-checked for
// 2026. jpx.co.jp's own calendar page blocks automated fetching, so treat
// 2027 as derived-and-likely-correct rather than hand-confirmed on JPX.

const JP_HOLIDAYS: Record<number, Holiday[]> = {
  2026: [
    { date: "2026-01-01", name: { en: "New Year's Day", ko: "신정(일본)", ja: "元日" } },
    { date: "2026-01-02", name: { en: "New Year market closure", ko: "정월 휴장", ja: "正月休場" } },
    { date: "2026-01-12", name: { en: "Coming of Age Day", ko: "성인의 날", ja: "成人の日" } },
    { date: "2026-02-11", name: { en: "National Foundation Day", ko: "건국기념일", ja: "建国記念の日" } },
    { date: "2026-02-23", name: { en: "Emperor's Birthday", ko: "천황탄생일", ja: "天皇誕生日" } },
    { date: "2026-03-20", name: { en: "Vernal Equinox Day", ko: "춘분의 날", ja: "春分の日" } },
    { date: "2026-04-29", name: { en: "Showa Day", ko: "쇼와의 날", ja: "昭和の日" } },
    { date: "2026-05-04", name: { en: "Greenery Day", ko: "녹색의 날", ja: "みどりの日" } },
    { date: "2026-05-05", name: { en: "Children's Day", ko: "어린이날(일본)", ja: "こどもの日" } },
    { date: "2026-05-06", name: { en: "Constitution Day (observed)", ko: "헌법기념일 대체휴일", ja: "憲法記念日 振替休日" } },
    { date: "2026-07-20", name: { en: "Marine Day", ko: "바다의 날", ja: "海の日" } },
    { date: "2026-08-11", name: { en: "Mountain Day", ko: "산의 날", ja: "山の日" } },
    { date: "2026-09-21", name: { en: "Respect for the Aged Day", ko: "경로의 날", ja: "敬老の日" } },
    { date: "2026-09-22", name: { en: "Citizens' Holiday", ko: "국민휴일", ja: "国民の休日" } },
    { date: "2026-09-23", name: { en: "Autumnal Equinox Day", ko: "추분의 날", ja: "秋分の日" } },
    { date: "2026-10-12", name: { en: "Sports Day", ko: "체육의 날", ja: "スポーツの日" } },
    { date: "2026-11-03", name: { en: "Culture Day", ko: "문화의 날", ja: "文化の日" } },
    { date: "2026-11-23", name: { en: "Labor Thanksgiving Day", ko: "근로감사의 날", ja: "勤労感謝の日" } },
    { date: "2026-12-31", name: { en: "Year-end market closure", ko: "연말 휴장", ja: "年末休場" } },
  ],
  2027: [
    { date: "2027-01-01", name: { en: "New Year's Day", ko: "신정(일본)", ja: "元日" } },
    { date: "2027-01-11", name: { en: "Coming of Age Day", ko: "성인의 날", ja: "成人の日" } },
    { date: "2027-02-11", name: { en: "National Foundation Day", ko: "건국기념일", ja: "建国記念の日" } },
    { date: "2027-02-23", name: { en: "Emperor's Birthday", ko: "천황탄생일", ja: "天皇誕生日" } },
    { date: "2027-03-22", name: { en: "Vernal Equinox Day (observed)", ko: "춘분의 날 대체휴일", ja: "春分の日 振替休日" } },
    { date: "2027-04-29", name: { en: "Showa Day", ko: "쇼와의 날", ja: "昭和の日" } },
    { date: "2027-05-03", name: { en: "Constitution Day", ko: "헌법기념일", ja: "憲法記念日" } },
    { date: "2027-05-04", name: { en: "Greenery Day", ko: "녹색의 날", ja: "みどりの日" } },
    { date: "2027-05-05", name: { en: "Children's Day", ko: "어린이날(일본)", ja: "こどもの日" } },
    { date: "2027-07-19", name: { en: "Marine Day", ko: "바다의 날", ja: "海の日" } },
    { date: "2027-08-11", name: { en: "Mountain Day", ko: "산의 날", ja: "山の日" } },
    { date: "2027-09-20", name: { en: "Respect for the Aged Day", ko: "경로의 날", ja: "敬老の日" } },
    { date: "2027-09-23", name: { en: "Autumnal Equinox Day", ko: "추분의 날", ja: "秋分の日" } },
    { date: "2027-10-11", name: { en: "Sports Day", ko: "체육의 날", ja: "スポーツの日" } },
    { date: "2027-11-03", name: { en: "Culture Day", ko: "문화의 날", ja: "文化の日" } },
    { date: "2027-11-23", name: { en: "Labor Thanksgiving Day", ko: "근로감사의 날", ja: "勤労感謝の日" } },
    { date: "2027-12-31", name: { en: "Year-end market closure", ko: "연말 휴장", ja: "年末休場" } },
  ],
};

function jpHolidays(year: number): Holiday[] {
  return JP_HOLIDAYS[year] ?? [];
}

export const JAPAN: MarketSchedule = {
  key: "japan",
  timeZone: "Asia/Tokyo",
  sessions: [
    { key: "morning", days: [1, 2, 3, 4, 5], start: "09:00", end: "11:30" },
    { key: "afternoon", days: [1, 2, 3, 4, 5], start: "12:30", end: "15:30" },
  ],
  holidays: jpHolidays,
};

// --------------------------------------------------------------- Crypto ---
// True 24/7: one block per weekday, "24:00" rolls into the next day's start
// with no gap (JS Date normalizes an out-of-range hour), so there is never a
// moment the engine reports "closed".
export const CRYPTO: MarketSchedule = {
  key: "crypto",
  timeZone: "UTC",
  sessions: [{ key: "always", days: [0, 1, 2, 3, 4, 5, 6], start: "00:00", end: "24:00" }],
  holidays: () => [],
};

// -------------------------------------------------------------------- FX --
// Interbank FX week: continuously open Sunday 17:00 ET through Friday 17:00
// ET, closed the rest of the weekend. Modeled as one block per weekday in
// New York time, the conventional reference zone for "the FX week."
export const FX: MarketSchedule = {
  key: "fx",
  timeZone: "America/New_York",
  sessions: [
    { key: "week", days: [1, 2, 3, 4], start: "00:00", end: "24:00" },
    { key: "week", days: [5], start: "00:00", end: "17:00" },
    { key: "week", days: [0], start: "17:00", end: "24:00" },
  ],
  holidays: () => [],
};

export const SCHEDULES: Record<MarketKey, MarketSchedule> = { us: US, korea: KOREA, japan: JAPAN, crypto: CRYPTO, fx: FX };

// -------------------------------------------------------- Central banks ---
// Meeting dates are committee-set, not computable. Source: federalreserve.gov
// (FOMC), boj.or.jp (BOJ), bok.or.kr (BOK) — verified 2026-08-31. BOK has not
// yet published its 2027 schedule (announced each October).

export type CentralBankMeeting = { start: string; decision: string };

export const FOMC_MEETINGS: CentralBankMeeting[] = [
  { start: "2026-01-27", decision: "2026-01-28" },
  { start: "2026-03-17", decision: "2026-03-18" },
  { start: "2026-04-28", decision: "2026-04-29" },
  { start: "2026-06-16", decision: "2026-06-17" },
  { start: "2026-07-28", decision: "2026-07-29" },
  { start: "2026-09-15", decision: "2026-09-16" },
  { start: "2026-10-27", decision: "2026-10-28" },
  { start: "2026-12-08", decision: "2026-12-09" },
  { start: "2027-01-26", decision: "2027-01-27" },
  { start: "2027-03-16", decision: "2027-03-17" },
  { start: "2027-04-27", decision: "2027-04-28" },
  { start: "2027-06-08", decision: "2027-06-09" },
  { start: "2027-07-27", decision: "2027-07-28" },
  { start: "2027-09-14", decision: "2027-09-15" },
  { start: "2027-10-26", decision: "2027-10-27" },
  { start: "2027-12-07", decision: "2027-12-08" },
];

export const BOJ_MEETINGS: CentralBankMeeting[] = [
  { start: "2026-01-22", decision: "2026-01-23" },
  { start: "2026-03-18", decision: "2026-03-19" },
  { start: "2026-04-27", decision: "2026-04-28" },
  { start: "2026-06-15", decision: "2026-06-16" },
  { start: "2026-07-30", decision: "2026-07-31" },
  { start: "2026-09-17", decision: "2026-09-18" },
  { start: "2026-10-29", decision: "2026-10-30" },
  { start: "2026-12-17", decision: "2026-12-18" },
  { start: "2027-01-21", decision: "2027-01-22" },
  { start: "2027-03-17", decision: "2027-03-18" },
  { start: "2027-04-27", decision: "2027-04-28" },
  { start: "2027-06-10", decision: "2027-06-11" },
  { start: "2027-07-21", decision: "2027-07-22" },
  { start: "2027-09-21", decision: "2027-09-22" },
  { start: "2027-10-28", decision: "2027-10-29" },
  { start: "2027-12-16", decision: "2027-12-17" },
];

// BOK meetings are single-day (start === decision).
export const BOK_MEETINGS: CentralBankMeeting[] = [
  { start: "2026-01-15", decision: "2026-01-15" },
  { start: "2026-02-26", decision: "2026-02-26" },
  { start: "2026-04-10", decision: "2026-04-10" },
  { start: "2026-05-28", decision: "2026-05-28" },
  { start: "2026-07-16", decision: "2026-07-16" },
  { start: "2026-08-27", decision: "2026-08-27" },
  { start: "2026-10-22", decision: "2026-10-22" },
  { start: "2026-11-26", decision: "2026-11-26" },
];

export function upcomingMeetings(meetings: CentralBankMeeting[], now: Date, n: number): CentralBankMeeting[] {
  const today = now.toISOString().slice(0, 10);
  return meetings.filter((m) => m.decision >= today).slice(0, n);
}
