import { zonedTimeToInstant, zoneOffset, slotsOn, formatTime, civilDateIn, monthGrid } from "../src/lib/schedule";

let fails = 0;
const check = (name: string, got: unknown, want: unknown) => {
  const ok = String(got) === String(want);
  if (!ok) fails++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: got ${got}${ok ? "" : `, want ${want}`}`);
};

// 10:00 Amsterdam in winter (CET, UTC+1) is 09:00 UTC.
check("winter wall->instant",
  new Date(zonedTimeToInstant({ y: 2026, m: 0, d: 14 }, 10, 0, "Europe/Amsterdam")).toISOString(),
  "2026-01-14T09:00:00.000Z");

// 10:00 Amsterdam in summer (CEST, UTC+2) is 08:00 UTC — offset is NOT fixed.
check("summer wall->instant",
  new Date(zonedTimeToInstant({ y: 2026, m: 6, d: 14 }, 10, 0, "Europe/Amsterdam")).toISOString(),
  "2026-07-14T08:00:00.000Z");

// The day the EU springs forward (2026-03-29): 10:00 local is 08:00 UTC.
check("DST-transition day",
  new Date(zonedTimeToInstant({ y: 2026, m: 2, d: 29 }, 10, 0, "Europe/Amsterdam")).toISOString(),
  "2026-03-29T08:00:00.000Z");

check("offset winter", zoneOffset(Date.UTC(2026, 0, 14), "Europe/Amsterdam") / 3600000, 1);
check("offset summer", zoneOffset(Date.UTC(2026, 6, 14), "Europe/Amsterdam") / 3600000, 2);
check("offset UTC", zoneOffset(Date.now(), "UTC"), 0);

// A slot generated in Amsterdam hours reads correctly in New York.
const avail = { days: [0, 1, 2, 3, 4, 5, 6], start: 8, end: 21, horizon: 90 };
const now = Date.UTC(2026, 6, 1, 6, 0);
const slots = slotsOn({ y: 2026, m: 6, d: 14 }, 30, avail, now, "Europe/Amsterdam");
check("slots are ascending", slots.every((v, i) => i === 0 || v > slots[i - 1]), true);
check("slots within published hours", slots.every((at) => {
  const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Amsterdam", hour: "2-digit", hourCycle: "h23" }).format(new Date(at)));
  return h >= 8 && h < 21;
}), true);
check("some slots dropped", slots.length > 0 && slots.length < 26, true);
check("first slot in NY", formatTime(slots[0], "America/New_York", false).length > 0, true);

// Weekend and past days are closed.
check("weekend open", slotsOn({ y: 2026, m: 6, d: 18 }, 30, avail, now, "Europe/Amsterdam").length > 0, true);
check("past day closed", slotsOn({ y: 2026, m: 5, d: 1 }, 30, avail, now, "Europe/Amsterdam").length, 0);

// Today only offers what has not already gone by.
const midday = Date.UTC(2026, 6, 14, 12, 0); // 14:00 in Amsterdam
check("today's past slots dropped",
  slotsOn({ y: 2026, m: 6, d: 14 }, 30, avail, midday, "Europe/Amsterdam").every((at) => at > midday), true);

// Stability: the same day generates the same slots every time.
check("deterministic", JSON.stringify(slotsOn({ y: 2026, m: 6, d: 14 }, 30, avail, now, "Europe/Amsterdam")) ===
  JSON.stringify(slotsOn({ y: 2026, m: 6, d: 14 }, 30, avail, now, "Europe/Amsterdam")), true);

// The grid always covers the month in six rows.
const grid = monthGrid(2026, 1, 0);
check("grid length", grid.length, 42);
check("grid covers month start", grid.some((d) => d.m === 1 && d.d === 1), true);
check("grid covers month end", grid.some((d) => d.m === 1 && d.d === 28), true);

check("civilDateIn rolls over the date line",
  JSON.stringify(civilDateIn(Date.UTC(2026, 6, 14, 23, 0), "Asia/Tokyo")),
  JSON.stringify({ y: 2026, m: 6, d: 15 }));

// The day must read 08:00-21:00 on the visitor's own clock, in any zone, and
// the thinning must actually be the share it claims. Both of these were wrong.
for (const zone of ["Europe/Amsterdam", "Asia/Tehran", "America/New_York", "UTC"]) {
  const day = slotsOn({ y: 2026, m: 7, d: 31 }, 30, avail, Date.UTC(2026, 7, 28, 9, 0), zone);
  const hours = day.map((at) =>
    Number(new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", hourCycle: "h23" }).format(new Date(at)))
  );
  check(`${zone} starts at 08`, Math.min(...hours), 8);
  check(`${zone} ends before 21`, Math.max(...hours) < 21, true);
}

let kept = 0, cells = 0;
for (let d = 1; d <= 60; d++) {
  kept += slotsOn({ y: 2026, m: 8, d }, 30, avail, Date.UTC(2026, 7, 28, 9, 0), "UTC").length;
  cells += 26;
}
const share = kept / cells;
check("thinning keeps roughly three quarters", share > 0.68 && share < 0.84, true);
console.log(`     (kept ${(share * 100).toFixed(1)}%)`);

console.log(fails ? `\n${fails} FAILED` : "\nall passed");
process.exit(fails ? 1 : 0);
