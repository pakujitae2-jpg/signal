// Timezone-aware open/closed engine for exchange trading sessions. Pure date
// math against IANA time zones via Intl (no date library dependency) so DST
// transitions in New York/Seoul/Tokyo are handled correctly without manual
// offset tables.

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export type SessionBlock = {
  /** Label key for this block, e.g. "premarket" | "regular" | "afterhours" | "morning" | "lunch" | "afternoon". */
  key: string;
  days: Weekday[];
  /** Local wall-clock "HH:MM", 24h. */
  start: string;
  end: string;
};

export type Holiday = {
  /** Market-local calendar date, "YYYY-MM-DD". */
  date: string;
  name: { en: string; ko: string; ja: string };
  /** If set, the market trades a shortened day ending at this local "HH:MM" instead of closing entirely. */
  earlyClose?: string;
};

export type MarketSchedule = {
  key: string;
  timeZone: string; // IANA zone
  sessions: SessionBlock[];
  holidays: (year: number) => Holiday[];
  /**
   * If set, `sessions` above are only valid from this local date onward;
   * `priorSessions` describes the schedule before that date. Used for the
   * 2026-09-14 KRX extension, which has already slipped once, so the site
   * must keep showing the current hours until the change is actually live.
   */
  effectiveFrom?: string;
  priorSessions?: SessionBlock[];
};

// ---------------------------------------------------------------- tz math --

function tzOffsetMinutes(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(instant)) parts[p.type] = p.value;
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) === 24 ? 0 : Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return (asUtc - instant.getTime()) / 60_000;
}

/** Converts a market-local wall-clock date+time to the real UTC instant it occurs at. */
export function zonedTimeToUtc(dateStr: string, timeStr: string, timeZone: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const off1 = tzOffsetMinutes(guess, timeZone);
  const corrected = new Date(guess.getTime() - off1 * 60_000);
  const off2 = tzOffsetMinutes(corrected, timeZone);
  return off2 === off1 ? corrected : new Date(guess.getTime() - off2 * 60_000);
}

/** The market-local calendar date ("YYYY-MM-DD") and weekday for a UTC instant. */
export function zonedDate(instant: Date, timeZone: string): { date: string; weekday: Weekday; time: string } {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(instant)) parts[p.type] = p.value;
  const WD: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const hh = parts.hour === "24" ? "00" : parts.hour;
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: WD[parts.weekday],
    time: `${hh}:${parts.minute}`,
  };
}

function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

function weekdayOf(dateStr: string): Weekday {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() as Weekday;
}

function holidayOn(schedule: MarketSchedule, date: string): Holiday | undefined {
  const year = Number(date.slice(0, 4));
  // A holiday can fall in the last days of December and roll into next
  // year's table lookup at the boundary, so check both adjacent years too.
  for (const y of [year - 1, year, year + 1]) {
    const hit = schedule.holidays(y).find((h) => h.date === date);
    if (hit) return hit;
  }
  return undefined;
}

/** The session list in effect on a given market-local date (handles a pending `effectiveFrom` switch). */
export function sessionsFor(schedule: MarketSchedule, date: string): SessionBlock[] {
  if (schedule.effectiveFrom && schedule.priorSessions && date < schedule.effectiveFrom) {
    return schedule.priorSessions;
  }
  return schedule.sessions;
}

// ------------------------------------------------------------- status API --

export type MarketStatus = {
  open: boolean;
  /** The session block currently running, if `open`. */
  activeSession: string | null;
  /** UTC instant of the next open→closed or closed→open transition. */
  changesAt: Date;
  /** True if today is a full holiday closure (not an early close). */
  isHoliday: boolean;
  holidayName: { en: string; ko: string; ja: string } | null;
};

const DAY_SCAN_LIMIT = 21; // covers the longest realistic holiday clusters (e.g. Seollal/Chuseok bridges)

/** Open/closed state right now, plus the next transition instant, for a schedule. */
export function marketStatus(schedule: MarketSchedule, now: Date = new Date()): MarketStatus {
  const { date, weekday, time } = zonedDate(now, schedule.timeZone);
  const holiday = holidayOn(schedule, date);
  // A full holiday closure today; an early close is handled as a shortened
  // session below instead, so it does not count here.
  const todayFullHoliday = holiday && !holiday.earlyClose ? holiday : null;
  const sessions = sessionsFor(schedule, date);

  if (!todayFullHoliday) {
    for (const block of sessions) {
      if (!block.days.includes(weekday)) continue;
      const end = holiday?.earlyClose ?? block.end;
      if (time >= block.start && time < end) {
        return {
          open: true,
          activeSession: block.key,
          changesAt: zonedTimeToUtc(date, end, schedule.timeZone),
          isHoliday: false,
          holidayName: null,
        };
      }
    }
  }

  // Closed: scan forward for the next session start. `isHoliday`/`holidayName`
  // always describe *today* (captured above), regardless of which future day
  // the scan below lands on to compute `changesAt`.
  for (let i = 0; i <= DAY_SCAN_LIMIT; i++) {
    const d = i === 0 ? date : addDays(date, i);
    const wd = weekdayOf(d);
    const h = holidayOn(schedule, d);
    if (h && !h.earlyClose) continue;
    const blocksToday = sessionsFor(schedule, d).filter((b) => b.days.includes(wd));
    for (const block of blocksToday) {
      if (i === 0 && block.start <= time) continue; // already passed today
      return {
        open: false,
        activeSession: null,
        changesAt: zonedTimeToUtc(d, block.start, schedule.timeZone),
        isHoliday: Boolean(todayFullHoliday),
        holidayName: todayFullHoliday ? todayFullHoliday.name : null,
      };
    }
  }

  // No session found within the scan window — schedule data is stale.
  return {
    open: false,
    activeSession: null,
    changesAt: zonedTimeToUtc(addDays(date, DAY_SCAN_LIMIT), "00:00", schedule.timeZone),
    isHoliday: false,
    holidayName: null,
  };
}

/** "2h 14m" / "45m" style countdown to a target instant. */
export function countdown(target: Date, now: Date = new Date()): string {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const totalMin = Math.round(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (h < 48) return `${h}h ${m}m`;
  return `${Math.floor(h / 24)}d ${h % 24}h`;
}

/** All holidays for a market across the given years, sorted, deduped by date. */
export function holidaysInYears(schedule: MarketSchedule, years: number[]): Holiday[] {
  const seen = new Map<string, Holiday>();
  for (const y of years) for (const h of schedule.holidays(y)) seen.set(h.date, h);
  return [...seen.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** Next N upcoming holidays (today or later) for a market, from `now`. */
export function upcomingHolidays(schedule: MarketSchedule, now: Date, n: number): Holiday[] {
  const { date: today } = zonedDate(now, schedule.timeZone);
  const years = [Number(today.slice(0, 4)), Number(today.slice(0, 4)) + 1];
  return holidaysInYears(schedule, years)
    .filter((h) => h.date >= today)
    .slice(0, n);
}

/**
 * A session block's start/end converted into another IANA zone, anchored to
 * a specific market-local calendar date — DST-correct for that exact date,
 * which is why this takes a date rather than assuming a fixed offset. May
 * land on the following (or preceding) calendar day in the target zone.
 */
export function sessionInZone(
  schedule: MarketSchedule,
  block: SessionBlock,
  localDate: string,
  targetTz: string
): { startDate: string; start: string; endDate: string; end: string } {
  const s = zonedDate(zonedTimeToUtc(localDate, block.start, schedule.timeZone), targetTz);
  const e = zonedDate(zonedTimeToUtc(localDate, block.end, schedule.timeZone), targetTz);
  return { startDate: s.date, start: s.time, endDate: e.date, end: e.time };
}
