import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import LangNav from "@/components/LangNav";
import MarketStatusBadge, { type StatusJson } from "@/components/MarketStatusBadge";
import {
  BOJ_MEETINGS,
  BOK_MEETINGS,
  FOMC_MEETINGS,
  HOLIDAY_MARKET_KEYS,
  MARKET_KEYS,
  SCHEDULES,
  upcomingMeetings,
  type CentralBankMeeting,
  type MarketKey,
} from "@/config/exchange-schedule";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import {
  holidaysInYears,
  marketStatus,
  sessionInZone,
  sessionsFor,
  upcomingHolidays,
  zonedDate,
  type Holiday,
} from "@/lib/market-hours";
import { countdownLabel, fillMH, marketHoursCopy } from "@/lib/market-hours-copy";
import { SITE_URL } from "@/lib/site";

// Four page types sharing one schedule engine (lib/market-hours.ts) and one
// data source (config/exchange-schedule.ts): a hub, one page per market, a
// quick-answer page, and a per-year holiday table. Central-bank meeting
// dates and the .ics feeds are wired in only for us/korea/japan — crypto and
// FX have no holidays or rate decisions.

const HOLIDAY_FEED: Partial<Record<MarketKey, string>> = { us: "holidays-us.ics", korea: "holidays-kr.ics", japan: "holidays-jp.ics" };
const MEETING_FEED: Partial<Record<MarketKey, string>> = { us: "fomc.ics", korea: "bok.ics", japan: "boj.ics" };
const MEETINGS: Partial<Record<MarketKey, CentralBankMeeting[]>> = { us: FOMC_MEETINGS, korea: BOK_MEETINGS, japan: BOJ_MEETINGS };
const HOLIDAY_YEARS = [2026, 2027]; // sitemap fan-out; the route itself accepts a wider band
const MIN_YEAR = 2024;
const MAX_YEAR = 2035;

function toStatusJson(market: MarketKey, now: Date): StatusJson {
  const s = marketStatus(SCHEDULES[market], now);
  return {
    now: now.toISOString(),
    open: s.open,
    activeSession: s.activeSession,
    changesAt: s.changesAt.toISOString(),
    isHoliday: s.isHoliday,
    holidayName: s.holidayName,
  };
}

function marketPath(market: MarketKey): string {
  return `/market-hours/${market}`;
}

// ------------------------------------------------------------------- hub --

export function marketHoursHubMetadata(lang: Lang): Metadata {
  const t = marketHoursCopy(lang);
  const path = "/market-hours";
  const canonical = `${prefix(lang)}${path}`;
  return {
    title: t.hubTitle,
    description: t.hubDescription,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title: t.hubTitle, description: t.hubDescription, url: canonical },
    twitter: { card: "summary_large_image", title: t.hubTitle, description: t.hubDescription },
  };
}

export function MarketHoursHub({ lang }: { lang: Lang }) {
  const t = marketHoursCopy(lang);
  const p = prefix(lang);
  const now = new Date();

  const rows = MARKET_KEYS.map((key) => {
    const schedule = SCHEDULES[key];
    const status = marketStatus(schedule, now);
    const ms = status.changesAt.getTime() - now.getTime();
    return { key, status, countdown: countdownLabel(lang, ms) };
  });

  return (
    <div className="paper">
      <LangNav lang={lang} path="/market-hours" />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{t.hubH1}</h1>
          <p className="quote-sub">{t.hubSub}</p>
        </div>
      </div>

      <section className="block">
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>{t.colMarket}</th>
                <th style={{ textAlign: "left" }}>{t.colStatus}</th>
                <th style={{ textAlign: "left" }}>{t.colNext}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ key, status, countdown }) => (
                <tr key={key}>
                  <td style={{ textAlign: "left" }}>
                    <Link className="qlink" href={`${p}${marketPath(key)}`}>
                      <span className="cell-name">{t.marketName[key]}</span>
                    </Link>
                  </td>
                  <td style={{ textAlign: "left" }}>
                    <span className={`status-dot${status.open ? "" : " closed"}`} aria-hidden="true" />{" "}
                    <span className={status.open ? "live-badge" : "closed-badge"}>
                      {status.open ? t.statusOpenNow : t.statusClosedNow}
                    </span>
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {status.activeSession === "always" ? t.sessionLabel.always : fillMH(status.open ? t.closesIn : t.opensIn, { T: countdown })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot slot="0000000013" format="leaderboard" />

      <section className="block">
        <div className="pair-grid">
          <Link className="pair-link" href={`${p}/is-the-market-open`}>
            {t.quickH1}
          </Link>
          {HOLIDAY_MARKET_KEYS.flatMap((key) =>
            HOLIDAY_YEARS.map((year) => (
              <Link className="pair-link" key={`${key}-${year}`} href={`${p}/market-holidays/${key}/${year}`}>
                {fillMH(t.holidayYearLink, { YEAR: String(year) }).replace(" →", "")} · {t.marketName[key]}
              </Link>
            ))
          )}
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{t.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------- market --

export function marketHoursMetadata(lang: Lang, market: MarketKey): Metadata {
  const t = marketHoursCopy(lang);
  const name = t.marketName[market];
  const title = fillMH(t.marketTitle, { MARKET: name });
  const description = fillMH(t.marketDescription, { MARKET: name });
  const path = marketPath(market);
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function MarketHoursMarketPage({ lang, market }: { lang: Lang; market: MarketKey }) {
  const t = marketHoursCopy(lang);
  const p = prefix(lang);
  const now = new Date();
  const schedule = SCHEDULES[market];
  const name = t.marketName[market];
  const path = marketPath(market);

  const { date: todayLocal } = zonedDate(now, schedule.timeZone);
  const sessions = sessionsFor(schedule, todayLocal);
  const holidays = HOLIDAY_MARKET_KEYS.includes(market) ? upcomingHolidays(schedule, now, 6) : [];
  const meetings = MEETINGS[market] ? upcomingMeetings(MEETINGS[market]!, now, 3) : [];
  const holidayFeed = HOLIDAY_FEED[market];
  const meetingFeed = MEETING_FEED[market];

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}/market-hours`, label: t.hubH1 }} />

      <h1 className="quote-name">{name}</h1>
      <MarketStatusBadge market={market} lang={lang} initial={toStatusJson(market, now)} t={t} />

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.sessionsHeading}</h2>
        </div>
        <div className="board">
          {sessions.map((block) => {
            const kst = market === "us" ? sessionInZone(schedule, block, todayLocal, "Asia/Seoul") : null;
            const jst = market === "us" ? sessionInZone(schedule, block, todayLocal, "Asia/Tokyo") : null;
            return (
              <div className="board-cell" key={block.key}>
                <span className="b-name">{t.sessionLabel[block.key] ?? block.key}</span>
                <span className="b-value stat-value">
                  {block.start}–{block.end}
                </span>
                {(kst || jst) && (
                  <div className="b-foot">
                    {kst && <span className="quote-sub">KST {kst.start}–{kst.end}</span>}
                    {jst && <span className="quote-sub"> · JST {jst.start}–{jst.end}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {market === "korea" && (
          <>
            {todayLocal < (schedule.effectiveFrom ?? "0000-00-00") && <p className="wire-note">{t.koreaExtensionNote}</p>}
            <p className="wire-note">{t.koreaPremarketNote}</p>
          </>
        )}
      </section>

      {HOLIDAY_MARKET_KEYS.includes(market) && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{t.upcomingHolidaysHeading}</h2>
            {holidayFeed && (
              <span className="kicker-note">
                <a className="statline-link" href={`/calendar/${holidayFeed}`}>{t.addToCalendar}</a>
              </span>
            )}
          </div>
          {holidays.length > 0 ? (
            <div className="table-scroll">
              <table className="mkt">
                <tbody>
                  {holidays.map((h) => (
                    <tr key={h.date}>
                      <td style={{ textAlign: "left" }}>{h.date}</td>
                      <td style={{ textAlign: "left" }}>{h.name[lang]}</td>
                      <td>{h.earlyClose ? t.earlyCloseLabel : t.fullClosureLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="wire-note">{t.noUpcomingHolidays}</p>
          )}
          <div className="pair-grid">
            {HOLIDAY_YEARS.map((year) => (
              <Link className="pair-link" key={year} href={`${p}/market-holidays/${market}/${year}`}>
                {fillMH(t.holidayYearLink, { YEAR: String(year) })}
              </Link>
            ))}
          </div>
        </section>
      )}

      {t.centralBankHeading[market] && (
        <section className="block">
          <div className="kicker">
            <h2 className="kicker-label">{t.centralBankHeading[market]}</h2>
            {meetingFeed && (
              <span className="kicker-note">
                <a className="statline-link" href={`/calendar/${meetingFeed}`}>{t.addToCalendar}</a>
              </span>
            )}
          </div>
          {meetings.length > 0 ? (
            <div className="pair-grid">
              {meetings.map((m) => (
                <span className="pair-link" key={m.decision} style={{ cursor: "default" }}>
                  {m.decision}
                </span>
              ))}
            </div>
          ) : (
            <p className="wire-note">{t.noUpcomingMeeting}</p>
          )}
        </section>
      )}

      <AdSlot slot="0000000014" format="leaderboard" />

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{t.aboutHeading}</h2>
        </div>
        <p>{t.aboutP}</p>
      </section>

      <section className="block">
        <div className="pair-grid">
          {MARKET_KEYS.filter((k) => k !== market).map((k) => (
            <Link className="pair-link" key={k} href={`${p}${marketPath(k)}`}>
              {t.marketName[k]}
            </Link>
          ))}
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{t.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}

// -------------------------------------------------------- is-market-open --

export function isMarketOpenMetadata(lang: Lang): Metadata {
  const t = marketHoursCopy(lang);
  const path = "/is-the-market-open";
  const canonical = `${prefix(lang)}${path}`;
  return {
    title: t.quickTitle,
    description: t.quickDescription,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title: t.quickTitle, description: t.quickDescription, url: canonical },
    twitter: { card: "summary_large_image", title: t.quickTitle, description: t.quickDescription },
  };
}

export function IsMarketOpenPage({ lang }: { lang: Lang }) {
  const t = marketHoursCopy(lang);
  const p = prefix(lang);
  const now = new Date();
  const usStatus = marketStatus(SCHEDULES.us, now);

  return (
    <div className="paper">
      <LangNav lang={lang} path="/is-the-market-open" />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{t.quickH1}</h1>
        </div>
      </div>

      <section className="block prose">
        <p style={{ fontSize: 18 }}>
          <b>{usStatus.open ? t.quickYes : t.quickNo}</b>
        </p>
      </section>

      <MarketStatusBadge market="us" lang={lang} initial={toStatusJson("us", now)} t={t} />

      <AdSlot slot="0000000015" format="leaderboard" />

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.otherMarketsHeading}</h2>
        </div>
        <div className="pair-grid">
          {MARKET_KEYS.map((k) => (
            <Link className="pair-link" key={k} href={`${p}${marketPath(k)}`}>
              {t.marketName[k]}
            </Link>
          ))}
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{t.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------- holiday year --

export function isHolidayMarket(market: string): market is MarketKey {
  return (HOLIDAY_MARKET_KEYS as string[]).includes(market);
}

export function isValidHolidayYear(year: number): boolean {
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;
}

export function marketHolidaysMetadata(lang: Lang, market: MarketKey, year: number): Metadata {
  const t = marketHoursCopy(lang);
  const name = t.marketName[market];
  const vars = { MARKET: name, YEAR: String(year) };
  const title = fillMH(t.holidayYearTitle, vars);
  const description = fillMH(t.holidayYearDescription, vars);
  const path = `/market-holidays/${market}/${year}`;
  const canonical = `${prefix(lang)}${path}`;
  return {
    title,
    description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function MarketHolidaysYearPage({ lang, market, year }: { lang: Lang; market: MarketKey; year: number }) {
  if (!isHolidayMarket(market) || !isValidHolidayYear(year)) notFound();
  const t = marketHoursCopy(lang);
  const p = prefix(lang);
  const name = t.marketName[market];
  const path = `/market-holidays/${market}/${year}`;
  const vars = { MARKET: name, YEAR: String(year) };

  // Include the adjacent years too and filter to this calendar year: a
  // year-end holiday can be shifted into next year's table by that year's
  // weekend-observance rule (see lib/market-hours.ts holidayOn), so a
  // single-year query alone can miss it at the boundary.
  const holidays: Holiday[] = holidaysInYears(SCHEDULES[market], [year - 1, year, year + 1]).filter((h) =>
    h.date.startsWith(String(year))
  );

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} crumb={{ href: `${p}/market-hours/${market}`, label: name }} />
      <div className="quote-head">
        <div>
          <h1 className="quote-name">{fillMH(t.holidayYearH1, vars)}</h1>
        </div>
      </div>

      {holidays.length > 0 ? (
        <section className="block">
          <div className="table-scroll">
            <table className="mkt">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>{t.colDate}</th>
                  <th style={{ textAlign: "left" }}>{t.colHoliday}</th>
                  <th>{t.colType}</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h) => (
                  <tr key={h.date}>
                    <td style={{ textAlign: "left" }}>{h.date}</td>
                    <td style={{ textAlign: "left" }}>{h.name[lang]}</td>
                    <td>{h.earlyClose ? t.earlyCloseLabel : t.fullClosureLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="block">
          <p className="wire-note">{fillMH(t.notYetAnnounced, vars)}</p>
        </section>
      )}

      <AdSlot slot="0000000016" format="leaderboard" />

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{t.otherYearsHeading}</h2>
        </div>
        <div className="pair-grid">
          {[year - 1, year + 1].filter(isValidHolidayYear).map((y) => (
            <Link className="pair-link" key={y} href={`${p}/market-holidays/${market}/${y}`}>
              {y}
            </Link>
          ))}
        </div>
      </section>

      <footer className="colophon">
        <p className="fine">{t.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
