import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { booking, identity } from "@/data/site";
import { GLASS_BLUR, GLASS_GRAIN, GLASS_GRAIN_OPACITY, GLASS_SATURATE } from "@/lib/glass";
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
/** Slow away, quick through the middle, slow in — the sweep between steps. */
const SWEEP_EASE = [0.65, 0, 0.35, 1] as const;
const SWEEP = 0.78;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Step = "pick" | "details" | "done";
type Guest = { id: number; email: string };
type Filled = { name: string; email: string; phone: string; notes: string; links: Record<string, string> };

/* ------------------------------------------------------------------ dialog */

/**
 * The booking panel, over the page rather than in it.
 *
 * The ground around the card is the same glass as the menu, read from the same
 * constants, so the two surfaces cannot drift apart. Clicking it closes, as
 * does Escape and the button on the card.
 */
export function BookingDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const card = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement;
    document.body.dataset.locked = "true";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      // Keep Tab inside the card while it is up.
      const focusable = card.current?.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const list = [...focusable].filter((el) => el.offsetParent !== null);
      const edge = e.shiftKey ? list[0] : list[list.length - 1];
      if (document.activeElement === edge) {
        e.preventDefault();
        (e.shiftKey ? list[list.length - 1] : list[0]).focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.dataset.locked = "false";
      (restoreTo.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {/* The glass. A button so a click anywhere off the card dismisses. */}
          <button
            type="button"
            aria-label="Close booking"
            onClick={onClose}
            className="fixed inset-0 cursor-default bg-[#0a0a0c]/55"
            style={{
              backdropFilter: `blur(${GLASS_BLUR}px) saturate(${GLASS_SATURATE})`,
              WebkitBackdropFilter: `blur(${GLASS_BLUR}px) saturate(${GLASS_SATURATE})`,
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 mix-blend-screen"
              style={{
                backgroundImage: GLASS_GRAIN,
                backgroundRepeat: "repeat",
                opacity: GLASS_GRAIN_OPACITY,
              }}
            />
          </button>

          <motion.div
            ref={card}
            role="dialog"
            aria-modal="true"
            aria-label={`${booking.title} — pick a time`}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative z-10 my-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-hairStrong bg-surface shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close booking"
              className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-hairStrong bg-ink/70 text-dim transition-colors duration-300 hover:border-paper hover:text-paper"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            <BookingFlow onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------- sweep */

type Frame = { key: string; node: ReactNode };

/**
 * Swaps one step for the next behind a line that travels right to left.
 *
 * The incoming step is laid over the outgoing one and revealed by a clip that
 * follows the line, so nothing pops: what you see appear is already in place.
 * The card's height is tweened alongside on the same curve, otherwise the swap
 * would end with a jump wherever the two steps differ in length.
 */
function Wipe({ frame }: { frame: Frame }) {
  // The live node is rendered every time. Only the *outgoing* step is frozen —
  // it is on its way out, so a snapshot is right for it, and snapshotting the
  // incoming one instead would leave the panel showing stale markup for as long
  // as the step lasted.
  const [outgoing, setOutgoing] = useState<ReactNode | null>(null);
  const [busy, setBusy] = useState(false);
  const shownKey = useRef(frame.key);
  const shownNode = useRef<ReactNode>(frame.node);

  const outBox = useRef<HTMLDivElement>(null);
  const inBox = useRef<HTMLDivElement>(null);

  const cut = useMotionValue(100);
  const clip = useMotionTemplate`inset(0 0 0 ${cut}%)`;
  const left = useMotionTemplate`${cut}%`;
  const height = useMotionValue(0);

  useEffect(() => {
    if (frame.key === shownKey.current) return;
    shownKey.current = frame.key;
    setOutgoing(shownNode.current);
    setBusy(true);
  }, [frame.key]);

  // Declared after the effect above, so on the render where the step changes
  // that one still sees the previous node before this replaces it.
  useEffect(() => {
    shownNode.current = frame.node;
  });

  useEffect(() => {
    if (!busy) return;
    const from = outBox.current?.offsetHeight ?? 0;
    const to = inBox.current?.offsetHeight ?? from;
    height.set(from);
    cut.set(100);

    const sweep = animate(cut, 0, { duration: SWEEP, ease: SWEEP_EASE });
    const grow = animate(height, to, { duration: SWEEP, ease: SWEEP_EASE });
    let finished = false;
    sweep.then(() => {
      finished = true;
      setOutgoing(null);
      setBusy(false);
    });
    return () => {
      if (!finished) {
        sweep.stop();
        grow.stop();
      }
    };
  }, [busy, cut, height]);

  return (
    <motion.div className="relative overflow-hidden" style={busy ? { height } : undefined}>
      {/* Outgoing sits underneath and still; incoming is clipped open over it. */}
      {outgoing && (
        <div ref={outBox} className="absolute inset-x-0 top-0 bg-surface" aria-hidden="true">
          {outgoing}
        </div>
      )}

      {/* Opaque, or the step underneath reads through the part already swept. */}
      <motion.div
        ref={inBox}
        style={busy ? { clipPath: clip, WebkitClipPath: clip } : undefined}
        className={busy ? "relative bg-surface" : undefined}
      >
        {frame.node}
      </motion.div>

      {busy && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-accent"
          style={{ left, boxShadow: "0 0 24px 2px rgba(253,50,28,0.55)" }}
        />
      )}
    </motion.div>
  );
}

/* --------------------------------------------------------------------- flow */

function BookingFlow({ onClose }: { onClose: () => void }) {
  const [now] = useState(() => Date.now());
  const zones = useMemo(() => timeZoneChoices(), []);

  const [zone, setZone] = useState(zones[0]);
  const [hour12, setHour12] = useState(true);
  const [duration, setDuration] = useState<number>(booking.defaultDuration);

  const today = useMemo(() => civilDateIn(now, zone), [now, zone]);
  const [month, setMonth] = useState<CivilDate>({ y: today.y, m: today.m, d: 1 });
  const [selected, setSelected] = useState<CivilDate | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [filled, setFilled] = useState<Filled | null>(null);
  const [step, setStep] = useState<Step>("pick");

  const avail = booking.availability;
  const grid = useMemo(() => monthGrid(month.y, month.m, 0), [month]);

  const slotsByDay = useMemo(() => {
    const map = new Map<number, number[]>();
    for (const d of grid) map.set(dateKey(d), slotsOn(d, duration, avail, now));
    return map;
  }, [grid, duration, avail, now]);

  const daySlots = useMemo(
    () => (selected ? slotsByDay.get(dateKey(selected)) ?? [] : []),
    [selected, slotsByDay]
  );

  useEffect(() => {
    if (selected) return;
    const open = grid.find((d) => (slotsByDay.get(dateKey(d)) ?? []).length > 0);
    if (open) setSelected(open);
  }, [selected, grid, slotsByDay]);

  useEffect(() => {
    if (slot !== null && !daySlots.includes(slot)) setSlot(null);
  }, [slot, daySlots]);

  const atMonthStart = month.y === today.y && month.m === today.m;

  const summary = (
    <Summary
      duration={duration}
      onDuration={step === "pick" ? setDuration : undefined}
      zone={zone}
      onZone={step === "pick" ? setZone : undefined}
      zones={zones}
      now={now}
      slot={step === "pick" ? null : slot}
      hour12={hour12}
    />
  );

  const node =
    step === "done" ? (
      <Confirmation
        slot={slot!}
        duration={duration}
        zone={zone}
        hour12={hour12}
        filled={filled!}
        onRestart={() => {
          setFilled(null);
          setSlot(null);
          setStep("pick");
        }}
        onClose={onClose}
      />
    ) : (
      <div
        className={cn(
          "grid divide-hair",
          step === "pick"
            ? "lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_minmax(0,15rem)] lg:divide-x"
            : "md:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] md:divide-x"
        )}
      >
        {summary}
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
            onConfirm={(v) => {
              setFilled(v);
              setStep("done");
            }}
          />
        )}
      </div>
    );

  return <Wipe frame={{ key: step, node }} />;
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

      <h3 className="text-2xl font-medium tracking-tight md:text-[1.75rem]">{booking.title}</h3>

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
          <ZonePicker zone={zone} zones={zones} now={now} onPick={onZone} />
        ) : (
          <span>{zoneLabel(zone, now)}</span>
        )}
      </Row>
    </div>
  );
}

/**
 * Time-zone picker.
 *
 * A listbox rather than a native select: the native control cannot be animated
 * or styled to match anything around it, and on desktop it drops a menu in the
 * operating system's colours in the middle of a dark panel.
 */
function ZonePicker({
  zone,
  zones,
  now,
  onPick,
}: {
  zone: string;
  zones: string[];
  now: number;
  onPick: (z: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, zones.indexOf(zone)));
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      setActive((i) => (i + (e.key === "ArrowDown" ? 1 : zones.length - 1)) % zones.length);
    }
    if (open && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onPick(zones[active]);
      setOpen(false);
    }
  };

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-hairStrong bg-ink py-1.5 pl-2.5 pr-2 font-sans text-sm text-paper transition-colors duration-300 hover:border-paper/50"
      >
        <span className="truncate">{zoneLabel(zone, now)}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="shrink-0 text-dim"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3.5 w-3.5">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.24, ease: EASE }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-30 max-h-56 overflow-y-auto rounded-md border border-hairStrong bg-ink p-1 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]"
          >
            {zones.map((z, i) => (
              <li key={z}>
                <button
                  type="button"
                  role="option"
                  aria-selected={z === zone}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    onPick(z);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded px-2.5 py-1.5 text-left font-sans text-xs transition-colors duration-200",
                    i === active ? "bg-surfaceUp text-paper" : "text-dim"
                  )}
                >
                  <span className="truncate">{zoneLabel(z, now)}</span>
                  {z === zone && <span className="shrink-0 text-accent">✓</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const ICONS = {
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.4 3.75-5.4 3.75-9S14.5 5.4 12 3M12 21c-2.5-2.4-3.75-5.4-3.75-9S9.5 5.4 12 3M3.5 9h17M3.5 15h17",
  place: "M15 10.5V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2.5l6 3.5V7l-6 3.5Z",
  date: "M8 3v3m8-3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z",
} as const;

function Row({ icon, children }: { icon: keyof typeof ICONS; children: ReactNode }) {
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

  useEffect(() => {
    if (!grid.some((d) => dateKey(d) === roving)) {
      setRoving(dateKey(firstOpen(grid, slotsByDay) ?? grid[0]));
    }
  }, [grid, slotsByDay, roving]);

  const move = (from: number, by: number) => {
    const i = grid.findIndex((d) => dateKey(d) === from);
    const next = grid[Math.max(0, Math.min(grid.length - 1, i + by))];
    if (!next) return;
    setRoving(dateKey(next));
    cells.current.get(dateKey(next))?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const by = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (by !== undefined) {
      e.preventDefault();
      return move(roving, by);
    }
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      if (e.key === "PageUp" && !canGoBack) return;
      onMonth(e.key === "PageUp" ? -1 : 1);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto mb-5 flex max-w-[32rem] items-center justify-between">
        <h3 className="font-sans text-base font-medium">
          {monthName(month)} <span className="text-dim">{month.y}</span>
        </h3>
        <div className="flex gap-1">
          <Step dir="prev" onClick={() => onMonth(-1)} disabled={!canGoBack} />
          <Step dir="next" onClick={() => onMonth(1)} />
        </div>
      </div>

      <div role="grid" aria-label="Choose a day" onKeyDown={onKeyDown} className="mx-auto max-w-[32rem]">
        <div role="row" className="mb-1.5 grid grid-cols-7">
          {WEEKDAYS.map((w) => (
            <span
              key={w}
              role="columnheader"
              aria-label={w}
              className="py-1 text-center font-sans text-2xs font-medium uppercase tracking-wider text-dim"
            >
              {w}
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
                  "relative aspect-square rounded-md font-sans text-sm outline-none transition-colors duration-300",
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
                {open > 0 && !isSelected && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 bottom-1 mx-auto h-1 w-1 rounded-full",
                      open <= 3 ? "bg-accent" : "bg-paper/45"
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

function Step({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled?: boolean }) {
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
      <div className="mb-4 flex items-center justify-between gap-3 pr-10">
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

      <div className="-mr-2 flex max-h-[24rem] flex-col gap-2 overflow-y-auto pr-2">
        {selected == null ? (
          <p className="font-sans text-sm text-dimmer">Days with a mark have time open.</p>
        ) : slots.length === 0 ? (
          <p className="font-sans text-sm text-dimmer">Nothing open on this day.</p>
        ) : (
          slots.map((at, i) => (
            <motion.button
              key={at}
              type="button"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.32, ease: EASE, delay: Math.min(i * 0.025, 0.3) }}
              onClick={() => onPick(at)}
              className="shrink-0 rounded-md border border-hairStrong py-2.5 text-center font-sans text-sm transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
            >
              {formatTime(at, zone, hour12)}
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ socials */

type Platform = { key: string; name: string; brand: string; hint: string; icon: ReactNode };

const PLATFORMS: Platform[] = [
  {
    key: "telegram",
    name: "Telegram",
    brand: "#229ED9",
    hint: "@username",
    icon: (
      <path d="M21.6 3.7 2.7 11c-.9.35-.9 1.6.03 1.9l4.7 1.5 1.8 5.5c.28.85 1.35 1.05 1.9.36l2.5-3.1 4.9 3.6c.7.5 1.7.13 1.9-.72l3-15.4c.2-.95-.75-1.7-1.6-1.36Z" />
    ),
  },
  {
    key: "instagram",
    name: "Instagram",
    brand: "#E1306C",
    hint: "@username",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="12" cy="12" r="3.9" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="17.2" cy="6.8" r="1.2" />
      </>
    ),
  },
  {
    key: "discord",
    name: "Discord",
    brand: "#5865F2",
    hint: "username#0000",
    icon: (
      <path d="M18.9 5.6A16 16 0 0 0 15 4.4l-.25.5a12 12 0 0 1 3.2 1.6 15 15 0 0 0-11.9 0 12 12 0 0 1 3.2-1.6L9 4.4A16 16 0 0 0 5.1 5.6C2.7 9.2 2 12.7 2.3 16.2a16 16 0 0 0 4.9 2.5l1-1.7a10 10 0 0 1-1.6-.8l.4-.3a11 11 0 0 0 10 0l.4.3a10 10 0 0 1-1.6.8l1 1.7a16 16 0 0 0 4.9-2.5c.4-4-.6-7.5-2.8-10.6ZM8.7 14.2c-1 0-1.7-.9-1.7-1.9s.75-2 1.7-2 1.75.9 1.73 2c0 1-.75 1.9-1.73 1.9Zm6.6 0c-1 0-1.7-.9-1.7-1.9s.75-2 1.7-2 1.74.9 1.72 2c0 1-.74 1.9-1.72 1.9Z" />
    ),
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    brand: "#0A66C2",
    hint: "linkedin.com/in/…",
    icon: (
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3.2 9h3.6v12H3.2zM10 9h3.5v1.7h.05A3.9 3.9 0 0 1 17.1 8.7c3.7 0 4.4 2.4 4.4 5.6V21h-3.6v-5.6c0-1.3 0-3-1.85-3s-2.15 1.4-2.15 2.9V21H10z" />
    ),
  },
  {
    key: "facebook",
    name: "Facebook",
    brand: "#1877F2",
    hint: "facebook.com/…",
    icon: (
      <path d="M14.2 8.6h2.6V5.4h-2.6c-2.3 0-4.1 1.9-4.1 4.2v2.1H7.6v3.2h2.5V21h3.3v-6.1h2.6l.6-3.2h-3.2V9.6c0-.6.4-1 .8-1Z" />
    ),
  },
];

/**
 * Social handles.
 *
 * The bar opens from the trigger, an icon opens a field beneath it, and
 * confirming folds the field back into the icon that opened it — the field's
 * transform origin is set to that icon's column, so it collapses toward the
 * thing it belongs to rather than toward the middle of the row.
 */
function SocialBar({
  links,
  onChange,
}: {
  links: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) input.current?.focus();
  }, [editing]);

  const start = (key: string) => {
    if (editing === key) return setEditing(null);
    setDraft(links[key] ?? "");
    setEditing(key);
  };

  const commit = () => {
    if (!editing) return;
    const value = draft.trim();
    const next = { ...links };
    if (value) next[editing] = value;
    else delete next[editing];
    onChange(next);
    setEditing(null);
  };

  const index = PLATFORMS.findIndex((p) => p.key === editing);
  const origin = index < 0 ? "50%" : `${((index + 0.5) / PLATFORMS.length) * 100}%`;
  const filled = PLATFORMS.filter((p) => links[p.key]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-full border border-hairStrong px-4 py-1.5 font-sans text-2xs font-medium uppercase tracking-wider text-dim transition-colors duration-300 hover:border-paper/60 hover:text-paper"
        >
          {open ? "Profiles" : filled.length ? "Edit profiles" : "+ Add profiles"}
        </button>

        {/* When the bar is closed, the ones that were filled stay on show. */}
        <AnimatePresence>
          {!open && filled.length > 0 && (
            <motion.span
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {filled.map((p) => (
                <span key={p.key} title={`${p.name}: ${links[p.key]}`} style={{ color: p.brand }}>
                  <Glyph platform={p} />
                </span>
              ))}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex items-stretch gap-1 rounded-lg border border-hairStrong bg-ink p-1.5">
              <div className="flex flex-1 items-center justify-around gap-1">
                {PLATFORMS.map((p, i) => {
                  const on = Boolean(links[p.key]);
                  return (
                    <motion.button
                      key={p.key}
                      type="button"
                      onClick={() => start(p.key)}
                      aria-label={`${p.name}${on ? ` — ${links[p.key]}` : ""}`}
                      aria-pressed={editing === p.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: EASE, delay: 0.05 + i * 0.045 }}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-md transition-colors duration-300",
                        editing === p.key && "bg-surfaceUp",
                        !on && "text-dimmer hover:text-paper"
                      )}
                      style={on ? { color: p.brand } : undefined}
                    >
                      <Glyph platform={p} />
                    </motion.button>
                  );
                })}
              </div>

              <span aria-hidden="true" className="w-px shrink-0 bg-hairStrong" />

              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setOpen(false);
                }}
                aria-label="Close profiles"
                className="grid w-10 shrink-0 place-items-center rounded-md text-dim transition-colors duration-300 hover:bg-surfaceUp hover:text-paper"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {editing && (
                <motion.div
                  key={editing}
                  initial={{ opacity: 0, scaleX: 0.15, scaleY: 0.4, y: -6 }}
                  animate={{ opacity: 1, scaleX: 1, scaleY: 1, y: 0 }}
                  exit={{ opacity: 0, scaleX: 0.15, scaleY: 0.4, y: -6 }}
                  transition={{ duration: 0.34, ease: EASE }}
                  style={{ transformOrigin: `${origin} 0%` }}
                  className="mt-2 flex gap-2"
                >
                  <input
                    ref={input}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        commit();
                      }
                      if (e.key === "Escape") setEditing(null);
                    }}
                    placeholder={PLATFORMS[index]?.hint}
                    aria-label={`${PLATFORMS[index]?.name} handle`}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={commit}
                    aria-label="Save handle"
                    className="shrink-0 rounded-md border border-hairStrong px-4 text-dim transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Glyph({ platform }: { platform: Platform }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1.15rem] w-[1.15rem]" aria-hidden="true">
      {platform.icon}
    </svg>
  );
}

/* -------------------------------------------------------------- the details */

function DetailsForm({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: (v: Filled) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [links, setLinks] = useState<Record<string, string>>({});
  const [guests, setGuests] = useState<Guest[]>([]);
  const [touched, setTouched] = useState(false);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => first.current?.focus(), []);

  const mail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const errors = {
    name: name.trim() ? "" : "Please tell me your name.",
    email: mail(email) ? "" : "That does not look like an email address.",
    // Optional, but if given it has to be dialable.
    phone: !phone.trim() || /^\+?[\d\s()-]{6,}$/.test(phone.trim()) ? "" : "That does not look like a phone number.",
    guests: guests.some((g) => g.email && !mail(g.email)) ? "One of the guest addresses is not valid." : "",
  };
  const valid = !errors.name && !errors.email && !errors.phone && !errors.guests;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (valid) onConfirm({ name: name.trim(), email: email.trim(), phone: phone.trim(), notes: notes.trim(), links });
      }}
      className="flex flex-col gap-5 p-6 md:p-8"
    >
      <Field label="Your name" required error={touched ? errors.name : ""}>
        <input ref={first} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
      </Field>

      {/* Email does not need a whole row to itself; the phone shares it. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email address" required error={touched ? errors.email : ""}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={inputClass}
          />
        </Field>
        <Field label="Phone number" error={touched ? errors.phone : ""}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="+31 6 1234 5678"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="What would you like to cover?">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="A sentence or two is plenty — it just means we can skip the warm-up."
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      <Field label="Social profiles">
        <SocialBar links={links} onChange={setLinks} />
      </Field>

      <Field label="Guests" error={touched ? errors.guests : ""}>
        <div className="flex flex-col gap-2">
          {guests.map((g, i) => (
            <div key={g.id} className="flex gap-2">
              <input
                type="email"
                value={g.email}
                onChange={(e) =>
                  setGuests((list) => list.map((x) => (x.id === g.id ? { ...x, email: e.target.value } : x)))
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

      <div className="mt-1 flex items-center justify-end gap-4">
        <button type="button" onClick={onBack} className="font-sans text-sm text-dim transition-colors duration-300 hover:text-paper">
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
  children: ReactNode;
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

/* ------------------------------------------------------------- confirmation */

function Confirmation({
  slot,
  duration,
  zone,
  hour12,
  filled,
  onRestart,
  onClose,
}: {
  slot: number;
  duration: number;
  zone: string;
  hour12: boolean;
  filled: Filled;
  onRestart: () => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const end = slot + duration * 60000;

  const profiles = PLATFORMS.filter((p) => filled.links[p.key]);
  const when = `${longDate(slot, zone)}, ${formatTime(slot, zone, hour12)} – ${formatTime(end, zone, hour12)} (${zoneLabel(zone, slot)})`;

  /**
   * Everything the invite should carry, in the order it reads best. Google
   * takes the times as UTC stamps with a trailing Z, which is unambiguous —
   * no separate zone parameter to contradict them.
   */
  const details = [
    `${booking.title} — ${duration} minutes`,
    `Host: ${identity.name} (${identity.email})`,
    `Guest: ${filled.name} (${filled.email})`,
    filled.phone && `Phone: ${filled.phone}`,
    profiles.length && profiles.map((p) => `${p.name}: ${filled.links[p.key]}`).join("\n"),
    filled.notes && `\nNotes\n${filled.notes}`,
  ]
    .filter(Boolean)
    .join("\n");

  const gcal =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(`${booking.title}: ${identity.name} & ${filled.name}`)}` +
    `&dates=${stamp(slot)}/${stamp(end)}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(booking.place)}` +
    `&add=${encodeURIComponent([identity.email, filled.email].join(","))}`;

  const copyText = `${booking.title}\n${when}\n${booking.place}\n\n${details}`;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 p-8 text-center md:p-12">
      <motion.span
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
        className="grid h-12 w-12 place-items-center rounded-full border border-accent text-accent"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <motion.path
            d="m5 13 4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          />
        </svg>
      </motion.span>

      <div>
        <h3 className="text-2xl font-medium tracking-tight md:text-3xl">This time is held</h3>
        <p className="mt-2 font-sans text-sm text-dim">Add it to your calendar and I will see you then.</p>
      </div>

      <dl className="w-full divide-y divide-hair border-y border-hair text-left">
        <Line term="What">
          {booking.title} with {identity.name}
        </Line>
        <Line term="When">
          {longDate(slot, zone)}
          <span className="block text-dim">
            {formatTime(slot, zone, hour12)} – {formatTime(end, zone, hour12)} · {zoneLabel(zone, slot)}
          </span>
        </Line>
        <Line term="Who">
          {filled.name}
          <span className="block text-dim">{filled.email}</span>
          {filled.phone && <span className="block text-dim">{filled.phone}</span>}
          {profiles.length > 0 && (
            <span className="mt-2 flex flex-wrap items-center gap-3">
              {profiles.map((p) => (
                <span key={p.key} className="flex items-center gap-1.5 text-dim" style={{ color: p.brand }}>
                  <Glyph platform={p} />
                  <span className="font-sans text-2xs">{filled.links[p.key]}</span>
                </span>
              ))}
            </span>
          )}
        </Line>
        <Line term="Where">{booking.place}</Line>
        {filled.notes && <Line term="Notes">{filled.notes}</Line>}
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
              await navigator.clipboard.writeText(copyText);
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
        <button type="button" onClick={onRestart} className="underline underline-offset-4 transition-colors duration-300 hover:text-paper">
          Pick another time
        </button>
        {" · "}
        <button type="button" onClick={onClose} className="underline underline-offset-4 transition-colors duration-300 hover:text-paper">
          Back to the site
        </button>
      </p>
    </div>
  );
}

function Line({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-4">
      <dt className="font-sans text-2xs font-medium uppercase tracking-wider text-dim">{term}</dt>
      <dd className="font-sans text-sm text-paper/90">{children}</dd>
    </div>
  );
}

/* -------------------------------------------------------------------- dates */

const monthName = (d: CivilDate) =>
  new Intl.DateTimeFormat("en-GB", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(d.y, d.m, 1)));

const longDate = (at: number, timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(at)
  );

const longDateOf = (d: CivilDate) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(
    new Date(Date.UTC(d.y, d.m, d.d))
  );

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"][((n % 100) - 20) % 10] ?? ["th", "st", "nd", "rd"][n % 100] ?? "th";
  return `${n}${s}`;
};

/** Google Calendar wants UTC basic-format stamps. */
const stamp = (at: number) => new Date(at).toISOString().replace(/[-:]|\.\d{3}/g, "");
