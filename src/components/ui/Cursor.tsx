import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Custom pointer.
 *
 * Two variants ship here — pick one with the `variant` prop on <Cursor/>:
 *
 *   "ring"    a precise dot with a hollow outlined circle trailing behind it,
 *             swelling into a labelled disc over flagged elements.
 *   "comet"   a precise dot with a solid shape trailing behind it. At rest it
 *             is a circle; in motion it draws into a tapered capsule pointing
 *             along the direction of travel.
 *
 * Elements opt into states through `data-cursor`: "hide" | "view" | "drag".
 */
export type CursorVariant = "ring" | "comet";
type State = "default" | "hide" | "view" | "drag";

/** How often to re-check what is under the pointer. */
const HIT_TEST_MS = 70;

export function Cursor({ variant = "ring" }: { variant?: CursorVariant }) {
  const fine = useMediaQuery("(pointer: fine)");
  const [state, setState] = useState<State>("default");
  const [visible, setVisible] = useState(false);

  // Raw pointer position. The dot binds to these directly; the followers
  // spring off them.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    if (!fine) return;
    document.body.classList.add("has-custom-cursor");

    let lastHitTest = 0;

    const onMove = (e: MouseEvent) => {
      // Motion values are written straight through — no React render per move.
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      // Hit testing is the expensive part, so it runs on its own slow cadence
      // rather than once per mouse event.
      const now = performance.now();
      if (now - lastHitTest < HIT_TEST_MS) return;
      lastHitTest = now;

      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const flagged = el?.closest<HTMLElement>("[data-cursor]");
      const next: State = flagged
        ? ((flagged.dataset.cursor as State) ?? "default")
        : el?.closest("a,button,input,textarea,select,[role='button']")
          ? "hide"
          : "default";
      // React bails out when the value is unchanged, so this only renders on
      // an actual state transition.
      setState(next);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [fine, x, y, visible]);

  if (!fine) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity .25s" }}
      aria-hidden="true"
    >
      {variant === "comet" ? (
        <CometFollower x={x} y={y} state={state} />
      ) : (
        <RingFollower x={x} y={y} state={state} />
      )}

      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-paper"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: state === "view" || state === "drag" ? 0 : 1 }}
      />
    </div>
  );
}

type MV = ReturnType<typeof useMotionValue<number>>;

/** Hollow circle that lags the dot and swells into a labelled disc. */
function RingFollower({ x, y, state }: { x: MV; y: MV; state: State }) {
  const rx = useSpring(x, { stiffness: 380, damping: 34, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 380, damping: 34, mass: 0.5 });

  const shape =
    state === "view"
      ? { width: 104, height: 104, borderWidth: 0, background: "#fd321c", opacity: 1 }
      : state === "drag"
        ? { width: 76, height: 76, borderWidth: 0, background: "#ffffff", opacity: 1 }
        : state === "hide"
          ? { width: 54, height: 54, borderWidth: 1, background: "rgba(255,255,255,0)", opacity: 0.5 }
          : { width: 34, height: 34, borderWidth: 1, background: "rgba(255,255,255,0)", opacity: 1 };

  return (
    <motion.div
      className="absolute left-0 top-0 grid place-items-center rounded-full border-paper"
      style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
      animate={shape}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      <CursorLabel state={state} />
    </motion.div>
  );
}

/**
 * Outline wrapping a head circle of radius R and a tail circle of radius r
 * whose centres sit `d` apart: the convex hull of the two, being the external
 * tangent lines plus an arc at each end. That reads as a rounded head easing
 * into a narrower tail. With d = 0 and R = r it degenerates to a plain circle,
 * so a resting pointer needs no special case.
 */
function taperedCapsule(R: number, r: number, d: number) {
  if (d < 0.001 || d <= Math.abs(R - r)) {
    const big = Math.max(R, r);
    return `M ${-big} 0 a ${big} ${big} 0 1 0 ${big * 2} 0 a ${big} ${big} 0 1 0 ${-big * 2} 0`;
  }

  const alpha = Math.asin((R - r) / d);
  const phi = Math.PI / 2 + alpha;
  // The head leads at +d along the local x axis; the tail trails at the origin.
  // The whole shape is then rotated so +x points along the direction of travel.
  const hx = d;
  const p = (n: number) => n.toFixed(2);

  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);

  return [
    `M ${p(hx - R * cosP)} ${p(R * sinP)}`,
    `A ${p(R)} ${p(R)} 0 1 0 ${p(hx - R * cosP)} ${p(-R * sinP)}`,
    `L ${p(-r * cosP)} ${p(-r * sinP)}`,
    `A ${p(r)} ${p(r)} 0 0 0 ${p(-r * cosP)} ${p(r * sinP)}`,
    "Z",
  ].join(" ");
}

const BASE_FOR: Record<State, number> = {
  view: 52,
  drag: 38,
  hide: 26,
  default: 15,
};

/**
 * Solid shape trailing the dot, tapering along the direction of travel.
 *
 * The whole animation runs in one rAF loop that writes to the DOM directly.
 * An earlier version called setState for the path and the angle on every
 * frame, which re-rendered React ~120 times a second and made the pointer
 * stutter; it also fed a spring from that state, so the spring restarted each
 * frame and jittered. Velocity is measured here from the pointer's own motion
 * values rather than in a second loop, and the heading is accumulated
 * unwrapped — atan2 flips between +pi and -pi, and following that jump
 * literally spun the shape a full turn.
 */
function CometFollower({ x, y, state }: { x: MV; y: MV; state: State }) {
  // Loose and well damped: this is the "magnet strength". Lower stiffness
  // means more trailing lag and a gentler settle.
  const fx = useSpring(x, { stiffness: 190, damping: 24, mass: 0.6 });
  const fy = useSpring(y, { stiffness: 190, damping: 24, mass: 0.6 });

  const pathRef = useRef<SVGPathElement>(null);
  const rotorRef = useRef<HTMLDivElement>(null);
  const base = BASE_FOR[state];

  useEffect(() => {
    let frame = 0;
    let prevX = x.get();
    let prevY = y.get();
    let speed = 0;      // smoothed
    let deform = 0;     // smoothed 0..1
    let heading = 0;    // unwrapped radians
    let shown = 0;      // smoothed heading

    const tick = () => {
      const cx = x.get();
      const cy = y.get();
      const dx = cx - prevX;
      const dy = cy - prevY;
      prevX = cx;
      prevY = cy;

      // Low-pass the raw per-frame delta; raw values are far too noisy to
      // drive a shape with.
      const raw = Math.hypot(dx, dy);
      speed += (raw - speed) * 0.2;

      // Smoothstep keeps small movements from deforming the shape at all and
      // stops fast ones from running away.
      const t = Math.min(speed / 22, 1);
      const target = t * t * (3 - 2 * t);
      deform += (target - deform) * 0.14;

      // Only trust the direction when actually moving; below that the vector
      // is noise and the shape would spin on the spot.
      if (raw > 1.2) {
        const want = Math.atan2(dy, dx);
        let delta = want - heading;
        // Unwrap to the equivalent angle nearest the current heading.
        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;
        heading += delta;
      }
      shown += (heading - shown) * 0.18;

      const head = base * (1 + deform * 0.12);
      const tail = base * (1 - deform * 0.5);
      const gap = base * deform * 1.05;

      pathRef.current?.setAttribute("d", taperedCapsule(head, tail, gap));
      if (rotorRef.current) {
        rotorRef.current.style.transform = `rotate(${shown}rad)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [x, y, base]);

  const extent = base * 3;

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{ x: fx, y: fy, translateX: "-50%", translateY: "-50%" }}
    >
      <div ref={rotorRef} style={{ willChange: "transform" }}>
        <svg
          width={extent * 2}
          height={extent * 2}
          viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
          className="block"
          style={{ margin: -extent }}
        >
          <path
            ref={pathRef}
            d={taperedCapsule(base, base, 0)}
            fill={state === "view" ? "#fd321c" : "#ffffff"}
            opacity={state === "hide" ? 0.4 : state === "default" ? 0.8 : 1}
          />
        </svg>
      </div>

      {(state === "view" || state === "drag") && (
        <span className="absolute left-0 top-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
          <CursorLabel state={state} />
        </span>
      )}
    </motion.div>
  );
}

function CursorLabel({ state }: { state: State }) {
  if (state !== "view" && state !== "drag") return null;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`font-sans text-[10px] font-bold uppercase tracking-wider ${
        state === "view" ? "text-paper" : "text-ink"
      }`}
    >
      {state === "view" ? "View" : "Drag"}
    </motion.span>
  );
}
