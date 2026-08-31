import type { Holiday, Weekday } from "@/lib/market-hours";

// NYSE/Nasdaq holidays are computed from their published RULES (Nth weekday
// of month, Easter offset, weekend-observance shift) rather than a hardcoded
// date table. This is deliberate: a rule never goes stale, so the schedule
// extends indefinitely into the future with no risk of a missed yearly
// update. The rules themselves are exchange-published and unchanged in
// decades; only Juneteenth (added 2022) is a recent addition.
//
// Source for the rule set and the two recurring 1:00pm ET early closes (day
// after Thanksgiving, Christmas Eve when a weekday): nyse.com/markets/hours-calendars.

function nthWeekday(year: number, month: number, weekday: Weekday, n: number): string {
  // month: 1-12. Finds the n-th occurrence of `weekday` in that month.
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const offset = (weekday - first + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function lastWeekday(year: number, month: number, weekday: Weekday): string {
  const lastOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lastDow = new Date(Date.UTC(year, month - 1, lastOfMonth)).getUTCDay();
  const day = lastOfMonth - ((lastDow - weekday + 7) % 7);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Anonymous Gregorian algorithm (Meeus/Jones/Butcher) for Easter Sunday. */
function easterSunday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addDaysIso(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

function weekdayOfIso(dateStr: string): Weekday {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() as Weekday;
}

/** NYSE weekend-observance rule: Sat → preceding Fri, Sun → following Mon. */
function observed(dateStr: string): string {
  const wd = weekdayOfIso(dateStr);
  if (wd === 6) return addDaysIso(dateStr, -1);
  if (wd === 0) return addDaysIso(dateStr, 1);
  return dateStr;
}

type Name = { en: string; ko: string; ja: string };

const NAMES: Record<string, Name> = {
  newYear: { en: "New Year's Day", ko: "신정", ja: "元日" },
  mlk: { en: "Martin Luther King, Jr. Day", ko: "마틴 루터 킹 데이", ja: "キング牧師記念日" },
  presidents: { en: "Washington's Birthday", ko: "대통령의 날", ja: "大統領の日" },
  goodFriday: { en: "Good Friday", ko: "성금요일", ja: "聖金曜日" },
  memorial: { en: "Memorial Day", ko: "메모리얼 데이", ja: "戦没将兵追悼記念日" },
  juneteenth: { en: "Juneteenth National Independence Day", ko: "준틴스(노예 해방 기념일)", ja: "ジューンティーンス" },
  independence: { en: "Independence Day", ko: "독립기념일", ja: "独立記念日" },
  labor: { en: "Labor Day", ko: "노동절", ja: "レイバーデー" },
  thanksgiving: { en: "Thanksgiving Day", ko: "추수감사절", ja: "感謝祭" },
  christmas: { en: "Christmas Day", ko: "크리스마스", ja: "クリスマス" },
  blackFriday: { en: "Day after Thanksgiving (early close, 1:00pm ET)", ko: "추수감사절 다음날(오후 1시 조기 마감)", ja: "感謝祭翌日(午後1時 短縮取引)" },
  christmasEve: { en: "Christmas Eve (early close, 1:00pm ET)", ko: "크리스마스 이브(오후 1시 조기 마감)", ja: "クリスマスイブ(午後1時 短縮取引)" },
};

/** Full-day NYSE/Nasdaq closures for a given year, computed from the exchange's published rules. */
export function usHolidays(year: number): Holiday[] {
  const list: Holiday[] = [
    { date: observed(`${year}-01-01`), name: NAMES.newYear },
    { date: nthWeekday(year, 1, 1, 3), name: NAMES.mlk },
    { date: nthWeekday(year, 2, 1, 3), name: NAMES.presidents },
    { date: addDaysIso(easterSunday(year), -2), name: NAMES.goodFriday },
    { date: lastWeekday(year, 5, 1), name: NAMES.memorial },
    { date: observed(`${year}-06-19`), name: NAMES.juneteenth },
    { date: observed(`${year}-07-04`), name: NAMES.independence },
    { date: nthWeekday(year, 9, 1, 1), name: NAMES.labor },
    { date: nthWeekday(year, 11, 4, 4), name: NAMES.thanksgiving },
    { date: observed(`${year}-12-25`), name: NAMES.christmas },
  ];

  // Two recurring 1:00pm ET early closes. Modeled as a holiday entry with
  // `earlyClose` set rather than a full closure — the marketStatus engine
  // treats these as a shortened trading day, not a closed one.
  const blackFriday = addDaysIso(nthWeekday(year, 11, 4, 4), 1);
  list.push({ date: blackFriday, name: NAMES.blackFriday, earlyClose: "13:00" });
  const christmasObserved = observed(`${year}-12-25`);
  const christmasEveWd = weekdayOfIso(`${year}-12-24`);
  // Skip the early close if Dec 25 falls on Saturday: the observed-Christmas
  // full closure lands on Dec 24 that year, and a full closure wins over an
  // early close on the same date rather than stacking two entries on it.
  if (christmasEveWd >= 1 && christmasEveWd <= 5 && `${year}-12-24` !== christmasObserved) {
    list.push({ date: `${year}-12-24`, name: NAMES.christmasEve, earlyClose: "13:00" });
  }

  return list.sort((a, b) => a.date.localeCompare(b.date));
}
