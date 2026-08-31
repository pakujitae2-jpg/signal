// Minimal RFC 5545 (iCalendar) builder for all-day events — holiday and
// central-bank-meeting feeds only, so no timed-event or recurrence support
// is needed.

export type IcsEvent = {
  uid: string;
  /** "YYYY-MM-DD", inclusive. */
  startDate: string;
  /** "YYYY-MM-DD", EXCLUSIVE per RFC 5545 (the day after the last day the event covers). */
  endDateExclusive: string;
  summary: string;
  description?: string;
};

function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function ymd(dateStr: string): string {
  return dateStr.replaceAll("-", "");
}

export function buildIcs(calName: string, events: IcsEvent[], dtstamp: string): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PNL404//Market Hours//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsEscape(calName)}`,
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}@pnl404.com`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${ymd(e.startDate)}`,
      `DTEND;VALUE=DATE:${ymd(e.endDateExclusive)}`,
      `SUMMARY:${icsEscape(e.summary)}`
    );
    if (e.description) lines.push(`DESCRIPTION:${icsEscape(e.description)}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
