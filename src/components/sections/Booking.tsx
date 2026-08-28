import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, MaskLine } from "../ui/Reveal";
import { MarqueeLabel } from "../ui/MarqueeLabel";
import { cn } from "@/lib/utils";
import { booking, identity } from "@/data/site";
import {
  type CivilDate,
  addMonths,
  civilDateIn,
  dateKey,
  formatTime,
  monthGrid,
  sameDate,
  slotsOn,
  timeZoneChoices,
  weekdayOf,
  zoneLabel,
} from "@/lib/schedule";

const EASE = [0.22, 1, 0.36, 1] as const;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Step = "pick" | "details" | "done";
type Guest = { id: number; email: string };

/**
 * The booking panel: choose a day and a time, leave your details, done.
 *
 * Availability is published as wall-clock hours in the host's zone and resolved
 * to instants before anything is displayed, so a visitor in another country —
 * or on the other side of a daylight-saving change — sees the right times. See
 * lib/schedule.ts.
 */
export function Booking() {
  const [now] = useState(() => Date.now());
  const zones = useMemo(() => timeZoneChoices(), []);

  const [zone, setZone] = useState(zones[0]);
  const [hour12, setHour12] = useState(true);
  const [duration, setDuration] = useState<number>(booking.defaultDuration);

  const today = useMemo(() => civilDateIn(now, zone), [now, zone]);
  const [month, setMonth] = useState<CivilDate>({ y: today.y, m: today.m, d: 1 });
  const [selected, setSelected] = useState<CivilDate | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("pick");

  const avail = booking.availability;

  const grid = useMemo(() => monthGrid(month.y, month.m, 0), [month]);

  // One pass over the visible month; the slot lists and the day dots both read
  // from it, so a day is never generated twice per render.
  const slotsByDay = useMemo(() => {
    const map = new Map<number, number[]>();
    for (const d of grid) map.set(dateKey(d), slotsOn(d, duration, avail, now));
    return map;
  }, [grid, duration, avail, now]);

  const daySlots = useMemo(
    () => (selected ? slotsByDay.get(dateKey(selected)) ?? [] : []),
    [selected, slotsByDay]
  );

  // Open on the first day that has time, so the panel arrives with something to
  // read rather than an empty column. Late in a month that day is next month,
  // so the view follows it.
  useEffect(() => {
    if (selected) return;
    const open = grid.find((d) => (slotsByDay.get(dateKey(d)) ?? []).length > 0);
    if (open) setSelected(open);
    else if (dateKey(month) < dateKey({ ...today, d: 1 }) + 300) setMonth((m) => addMonths(m, 1));
  }, [selected, grid, slotsByDay, month, today]);

  // Changing the duration can retire the chosen time.
  useEffect(() => {
    if (slot !== null && !daySlots.includes(slot)) setSlot(null);
  }, [slot, daySlots]);

  const atMonthStart = month.y === today.y && month.m === today.m;

  return (
    <section id="booking" className="relative border-t border-hair py-24 md:py-32">
      <div className="shell">
        <Reveal className="mb-6">
          <MarqueeLabel text="Book a call" />
        </Reveal>

        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2.5rem,6.5vw,6rem)] font-medium leading-[0.9] tracking-tighter">
            <MaskLine>Pick a</MaskLine>
            <MaskLine delay={0.08} className="text-dimmer">
              time
            </MaskLine>
          </h2>
          <Reveal delay={0.2}>
            <p className="max-w-sm font-sans text-sm leading-relaxed text-dim">
              {booking.blurb}
            </p>
          </Reveal>
        </div>

        <Reveal amount={0.05}>
          <div className="overflow-hidden rounded-2xl border border-hair bg-surface">
            <AnimatePresence mode="wait" initial={false}>
              {step === "done" ? (
                <Fade key="done">
                  <Confirmation
                    slot={slot!}
                    duration={duration}
                    zone={zone}
                    hour12={hour12}
                    onRestart={() => {
                      setStep("pick");
                      setSlot(null);
                    }}
                  />
                </Fade>
              ) : (
                <Fade key="flow">
                  <div
                    className={cn(
                      "grid divide-hair",
                      step === "pick"
                        ? "lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,15rem)] lg:divide-x"
                        : "md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:divide-x"
                    )}
                  >
                    <Summary
                      duration={duration}
                      onDuration={step === "pick" ? setDuration : undefined}
                      zone={zone}
                      onZone={step === "pick" ? setZone : undefined}
                      zones={zones}
                      now={now}
                      slot={step === "details" ? slot : null}
                      hour12={hour12}
                    />

                    {step === "pick" ? (
                      <>
                        <Calendar
                          month={month}
                          today={today}
                          grid={grid}
                          slotsByDay={slotsByDay}
                          selected={selected}
                          onSelect={(d) => {
                            setSelected(d);
                            setSlot(null);
                          }}
                          onMonth={(n) => setMonth((m) => addMonths(m, n))}
                          canGoBack={!atMonthStart}
                        />
                        <SlotList
                          selected={selected}
                          slots={daySlots}
                          zone={zone}
                          hour12={hour12}
                          onHour12={setHour12}
                          onPick={(at) => {
                            setSlot(at);
                            setStep("details");
                          }}
                        />
                      </>
                    ) : (
                      <DetailsForm
                        onBack={() => setStep("pick")}
                        onConfirm={() => setStep("done")}
                      />
                    )}
                  </div>
                </Fade>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.38, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ summary */

function Summary({
  duration,
  onDuration,
  zone,
  onZone,
  zones,
  now,
  slot,
  hour12,
}: {
  duration: number;
  onDuration?: (n: number) => void;
  zone: string;
  onZone?: (z: string) => void;
  zones: string[];
  now: number;
  slot: number | null;
  hour12: boolean;
}) {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent font-sans text-xs font-semibold tracking-wide">
          ZM
        </span>
        <span className="font-sans text-sm text-dim">{identity.name}</span>
      </div>

      <h3 className="text-2xl font-medium tracking-tight md:text-[1.75rem]">
        {booking.title}
      </h3>

      {slot !== null && (
        <Row icon="date">
          <span className="block">{longDate(slot, zone)}</span>
          <span className="block text-dim">
            {formatTime(slot, zone, hour12)} – {formatTime(slot + duration * 60000, zone, hour12)}
          </span>
        </Row>
      )}

      <Row icon="clock">
        {onDuration ? (
          <span className="flex flex-wrap gap-1.5">
            {booking.durations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onDuration(d)}
                aria-pressed={d === duration}
                className={cn(
                  "rounded-full border px-3 py-1 font-sans text-2xs font-medium transition-colors duration-300",
                  d === duration
                    ? "border-paper bg-paper text-ink"
                    : "border-hairStrong text-dim hover:border-paper/50 hover:text-paper"
                )}
              >
                {d}m
              </button>
            ))}
          </span>
        ) : (
          <span>{duration}m</span>
        )}
      </Row>

      <Row icon="place">{booking.place}</Row>

      <Row icon="globe">
        {onZone ? (
          <span className="relative inline-flex">
            <select
              value={zone}
              onChange={(e) => onZone(e.target.value)}
              aria-label="Time zone"
              className="peer w-full cursor-pointer appearance-none rounded-md border border-hairStrong bg-ink py-1.5 pl-2.5 pr-8 font-sans text-sm text-paper outline-none transition-colors duration-300 hover:border-paper/50 focus-visible:border-accent"
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {zoneLabel(z, now)}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-dim"
            >
              ▾
            </span>
          </span>
        ) : (
          <span>{zoneLabel(zone, now)}</span>
        )}
      </Row>
    </div>
  );
}

const ICONS = {
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.4 3.75-5.4 3.75-9S14.5 5.4 12 3M12 21c-2.5-2.4-3.75-5.4-3.75-9S9.5 5.4 12 3M3.5 9h17M3.5 15h17",
  place: "M15 10.5V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2.5l6 3.5V7l-6 3.5Z",
  date: "M8 3v3m8-3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z",
} as const;

function Row({ icon, children }: { icon: keyof typeof ICONS; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 font-sans text-sm text-paper/85">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 h-4 w-4 shrink-0 text-dim"
      >
        <path d={ICONS[icon]} />
      </svg>
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}

/* ----------------------------------------------------------------- calendar */

/**
 * The month grid.
 *
 * One roving tab stop, as a grid widget should have: Tab reaches the calendar,
 * then the arrows walk it. Every cell rendering its own tab stop would put 42
 * of them between the calendar and the times beside it.
 */
function Calendar({
  month,
  today,
  grid,
  slotsByDay,
  selected,
  onSelect,
  onMonth,
  canGoBack,
}: {
  month: CivilDate;
  today: CivilDate;
  grid: CivilDate[];
  slotsByDay: Map<number, number[]>;
  selected: CivilDate | null;
  onSelect: (d: CivilDate) => void;
  onMonth: (n: number) => void;
  canGoBack: boolean;
}) {
  const cells = useRef(new Map<number, HTMLButtonElement>());
  const [roving, setRoving] = useState<number>(() =>
    dateKey(selected ?? firstOpen(grid, slotsByDay) ?? today)
  );

  // Paging the month leaves the old date behind; land on something that exists.
  useEffect(() => {
    if (!grid.some((d) => dateKey(d) === roving)) {
      setRoving(dateKey(firstOpen(grid, slotsByDay) ?? grid[0]));
    }
  }, [grid, slotsByDay, roving]);

  const move = (from: number, by: number) => {
    const i = grid.findIndex((d) => dateKey(d) === from);
    const next = grid[Math.max(0, Math.min(grid.length - 1, i + by))];
    if (!next) return;
    const key = dateKey(next);
    setRoving(key);
    cells.current.get(key)?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const by = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (by !== undefined) {
      e.preventDefault();
      move(roving, by);
      return;
    }
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      if (e.key === "PageUp" && !canGoBack) return;
      onMonth(e.key === "PageUp" ? -1 : 1);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto mb-6 flex max-w-[34rem] items-center justify-between">
        <h3 className="font-sans text-base font-medium">
          {monthName(month)} <span className="text-dim">{month.y}</span>
        </h3>
        <div className="flex gap-1">
          <Step dir="prev" onClick={() => onMonth(-1)} disabled={!canGoBack} />
          <Step dir="next" onClick={() => onMonth(1)} />
        </div>
      </div>

      {/* Capped so the cells stay the size of a day rather than stretching to
          fill the column. */}
      <div
        role="grid"
        aria-label="Choose a day"
        onKeyDown={onKeyDown}
        className="mx-auto max-w-[34rem]"
      >
        <div role="row" className="mb-2 grid grid-cols-7">
          {WEEKDAYS.map((w) => (
            <span
              key={w}
              role="columnheader"
              aria-label={w}
              className="py-1 text-center font-sans text-2xs font-medium uppercase tracking-wider text-dim"
            >
              {w.slice(0, 3)}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((d) => {
            const key = dateKey(d);
            const open = (slotsByDay.get(key) ?? []).length;
            const inMonth = d.m === month.m;
            const isSelected = selected != null && sameDate(d, selected);
            const isToday = sameDate(d, today);

            return (
              <button
                key={key}
                ref={(el) => {
                  if (el) cells.current.set(key, el);
                  else cells.current.delete(key);
                }}
                type="button"
                role="gridcell"
                aria-selected={isSelected}
                aria-current={isToday ? "date" : undefined}
                aria-label={`${longDateOf(d)}${open ? `, ${open} times` : ", no times"}`}
                disabled={!open}
                tabIndex={key === roving ? 0 : -1}
                onFocus={() => setRoving(key)}
                onClick={() => onSelect(d)}
                className={cn(
                  "relative aspect-square rounded-md font-sans text-sm transition-colors duration-300 outline-none",
                  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                  isSelected
                    ? "bg-paper font-semibold text-ink"
                    : open
                      ? "bg-surfaceUp text-paper hover:bg-hairStrong"
                      : "text-dimmer",
                  !inMonth && !isSelected && "opacity-45"
                )}
              >
                {d.d}
                {/* Availability tick: present on open days, brighter when busy. */}
                {open > 0 && !isSelected && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 bottom-1 mx-auto h-1 w-1 rounded-full",
                      open <= 2 ? "bg-accent" : "bg-paper/45"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const firstOpen = (grid: CivilDate[], slots: Map<number, number[]>) =>
  grid.find((d) => (slots.get(dateKey(d)) ?? []).length > 0);

function Step({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous month" : "Next month"}
      className="grid h-8 w-8 place-items-center rounded-md border border-hairStrong text-dim transition-colors duration-300 hover:border-paper/50 hover:text-paper disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
        <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ---------------------------------------------------------------- slot list */

function SlotList({
  selected,
  slots,
  zone,
  hour12,
  onHour12,
  onPick,
}: {
  selected: CivilDate | null;
  slots: number[];
  zone: string;
  hour12: boolean;
  onHour12: (v: boolean) => void;
  onPick: (at: number) => void;
}) {
  return (
    <div className="flex min-h-[22rem] flex-col p-6 md:p-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="whitespace-nowrap font-sans text-sm font-medium">
          {selected ? (
            <>
              {WEEKDAYS[weekdayOf(selected)]} <span className="text-dim">{ordinal(selected.d)}</span>
            </>
          ) : (
            <span className="text-dim">Choose a day</span>
          )}
        </h3>
        <div className="flex overflow-hidden rounded-md border border-hairStrong">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              onClick={() => onHour12(v)}
              aria-pressed={hour12 === v}
              className={cn(
                "px-2 py-1 font-sans text-2xs font-medium transition-colors duration-300",
                hour12 === v ? "bg-paper text-ink" : "text-dim hover:text-paper"
              )}
            >
              {v ? "12h" : "24h"}
            </button>
          ))}
        </div>
      </div>

      <div className="-mr-2 flex max-h-[26rem] flex-col gap-2 overflow-y-auto pr-2">
        {selected == null ? (
          <p className="font-sans text-sm text-dimmer">
            Days with a mark have time open.
          </p>
        ) : slots.length === 0 ? (
          <p className="font-sans text-sm text-dimmer">Nothing open on this day.</p>
        ) : (
          slots.map((at) => (
            <button
              key={at}
              type="button"
              onClick={() => onPick(at)}
              className="shrink-0 rounded-md border border-hairStrong py-2.5 text-center font-sans text-sm transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
            >
              {formatTime(at, zone, hour12)}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- the details */

function DetailsForm({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [touched, setTouched] = useState(false);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => first.current?.focus(), []);

  const errors = {
    name: name.trim() ? "" : "Please tell me your name.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "" : "That does not look like an email address.",
    guests: guests.some((g) => g.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email.trim()))
      ? "One of the guest addresses is not valid."
      : "",
  };
  const valid = !errors.name && !errors.email && !errors.guests;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (valid) onConfirm();
      }}
      className="flex flex-col gap-5 p-6 md:p-8"
    >
      <Field label="Your name" required error={touched ? errors.name : ""}>
        <input
          ref={first}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className={inputClass}
        />
      </Field>

      <Field label="Email address" required error={touched ? errors.email : ""}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className={inputClass}
        />
      </Field>

      <Field label="What would you like to cover?">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="A sentence or two is plenty — it just means we can skip the warm-up."
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <Field label="Guests" error={touched ? errors.guests : ""}>
        <div className="flex flex-col gap-2">
          {guests.map((g, i) => (
            <div key={g.id} className="flex gap-2">
              <input
                type="email"
                value={g.email}
                autoFocus={i === guests.length - 1}
                onChange={(e) =>
                  setGuests((list) =>
                    list.map((x) => (x.id === g.id ? { ...x, email: e.target.value } : x))
                  )
                }
                placeholder="name@company.com"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setGuests((list) => list.filter((x) => x.id !== g.id))}
                aria-label={`Remove guest ${i + 1}`}
                className="shrink-0 rounded-md border border-hairStrong px-3 text-dim transition-colors duration-300 hover:border-paper/50 hover:text-paper"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setGuests((list) => [...list, { id: Date.now(), email: "" }])}
            className="self-start font-sans text-sm text-dim transition-colors duration-300 hover:text-accent"
          >
            + Add {guests.length ? "another" : "a guest"}
          </button>
        </div>
      </Field>

      <div className="mt-2 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onBack}
          className="font-sans text-sm text-dim transition-colors duration-300 hover:text-paper"
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-full bg-paper px-6 py-2.5 font-sans text-sm font-semibold text-ink transition-opacity duration-300 hover:opacity-85"
        >
          Confirm
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-hairStrong bg-ink px-3 py-2.5 font-sans text-sm text-paper outline-none transition-colors duration-300 placeholder:text-dimmer hover:border-paper/40 focus-visible:border-accent";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-2xs font-medium uppercase tracking-wider text-dim">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="font-sans text-2xs text-accent">
          {error}
        </span>
      )}
    </label>
  );
}

/* ----------------------------------------------------------- confirmation */

function Confirmation({
  slot,
  duration,
  zone,
  hour12,
  onRestart,
}: {
  slot: number;
  duration: number;
  zone: string;
  hour12: boolean;
  onRestart: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const end = slot + duration * 60000;

  const summary = `${booking.title} with ${identity.name}\n${longDate(slot, zone)}\n${formatTime(slot, zone, hour12)} – ${formatTime(end, zone, hour12)} (${zoneLabel(zone, slot)})\n${booking.place}`;

  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${booking.title} — ${identity.name}`
  )}&dates=${stamp(slot)}/${stamp(end)}&details=${encodeURIComponent(booking.place)}`;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 p-8 text-center md:p-12">
      <span className="grid h-12 w-12 place-items-center rounded-full border border-accent text-accent">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      <div>
        <h3 className="text-2xl font-medium tracking-tight md:text-3xl">This time is held</h3>
        <p className="mt-2 font-sans text-sm text-dim">
          Add it to your calendar and I will see you then.
        </p>
      </div>

      <dl className="w-full divide-y divide-hair border-y border-hair text-left">
        <Line term="What">{booking.title} with {identity.name}</Line>
        <Line term="When">
          {longDate(slot, zone)}
          <span className="block text-dim">
            {formatTime(slot, zone, hour12)} – {formatTime(end, zone, hour12)} · {zoneLabel(zone, slot)}
          </span>
        </Line>
        <Line term="Where">{booking.place}</Line>
      </dl>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={gcal}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-paper px-5 py-2.5 font-sans text-sm font-semibold text-ink transition-opacity duration-300 hover:opacity-85"
        >
          Add to calendar
        </a>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(summary);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              setCopied(false);
            }
          }}
          className="rounded-full border border-hairStrong px-5 py-2.5 font-sans text-sm transition-colors duration-300 hover:border-paper"
        >
          {copied ? "Copied" : "Copy details"}
        </button>
      </div>

      <p className="font-sans text-2xs text-dimmer">
        Need a different time?{" "}
        <button
          type="button"
          onClick={onRestart}
          className="underline underline-offset-4 transition-colors duration-300 hover:text-paper"
        >
          Pick another
        </button>
      </p>
    </div>
  );
}

function Line({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-4">
      <dt className="font-sans text-2xs font-medium uppercase tracking-wider text-dim">{term}</dt>
      <dd className="font-sans text-sm text-paper/90">{children}</dd>
    </div>
  );
}

/* -------------------------------------------------------------------- dates */

const monthName = (d: CivilDate) =>
  new Intl.DateTimeFormat("en-GB", { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(d.y, d.m, 1))
  );

const longDate = (at: number, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(at));

const longDateOf = (d: CivilDate) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(Date.UTC(d.y, d.m, d.d)));

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"][((n % 100) - 20) % 10] ?? ["th", "st", "nd", "rd"][n % 100] ?? "th";
  return `${n}${s}`;
};

/** Google Calendar wants UTC basic-format stamps. */
const stamp = (at: number) => new Date(at).toISOString().replace(/[-:]|\.\d{3}/g, "");
