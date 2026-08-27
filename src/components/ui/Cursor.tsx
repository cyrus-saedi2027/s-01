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
 *   "comet"   a precise dot with a solid disc trailing behind it, stretched
 *             along the direction of travel and thinned as it goes faster.
 *
 * Elements opt into states through `data-cursor`: "hide" | "view" | "drag".
 */
export type CursorVariant = "ring" | "comet";
type State = "default" | "hide" | "view" | "drag";

export function Cursor({ variant = "ring" }: { variant?: CursorVariant }) {
  const fine = useMediaQuery("(pointer: fine)");
  const [state, setState] = useState<State>("default");
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  // Raw pointer position — the dot reads this directly.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Velocity, sampled per move and decayed each frame so the comet relaxes
  // back to a circle when the pointer stops.
  const vx = useMotionValue(0);
  const vy = useMotionValue(0);

  useEffect(() => {
    if (!fine) return;
    document.body.classList.add("has-custom-cursor");

    let last = { x: -100, y: -100, t: performance.now() };

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const now = performance.now();
        const dt = Math.max(1, now - last.t);
        vx.set((e.clientX - last.x) / dt);
        vy.set((e.clientY - last.y) / dt);
        last = { x: e.clientX, y: e.clientY, t: now };

        x.set(e.clientX);
        y.set(e.clientY);
        setVisible(true);

        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        const flagged = el?.closest<HTMLElement>("[data-cursor]");
        if (flagged) {
          setState((flagged.dataset.cursor as State) ?? "default");
          return;
        }
        const clickable = el?.closest("a,button,input,textarea,select,[role='button']");
        setState(clickable ? "hide" : "default");
      });
    };

    // Bleed velocity off so a stationary pointer settles.
    let decay = 0;
    const tick = () => {
      vx.set(vx.get() * 0.86);
      vy.set(vy.get() * 0.86);
      decay = requestAnimationFrame(tick);
    };
    decay = requestAnimationFrame(tick);

    const onLeave = () => setVisible(false);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      cancelAnimationFrame(raf.current);
      cancelAnimationFrame(decay);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [fine, x, y, vx, vy]);

  if (!fine) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity .25s" }}
      aria-hidden="true"
    >
      {variant === "comet" ? (
        <CometFollower x={x} y={y} vx={vx} vy={vy} state={state} />
      ) : (
        <RingFollower x={x} y={y} state={state} />
      )}

      {/* Precise dot, shared by both variants. */}
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
 * Builds a "tapered capsule": the outline wrapping a head circle of radius R
 * and a tail circle of radius r whose centres sit `d` apart. It is the convex
 * hull of the two circles — the two external tangent lines plus an arc at each
 * end — which gives a rounded head easing into a narrower tail. With d = 0 and
 * R = r it degenerates to a plain circle, so a resting pointer is just a dot.
 */
function taperedCapsule(R: number, r: number, d: number) {
  // Guard the degenerate case: one circle swallowing the other.
  if (d < 0.001 || d <= Math.abs(R - r)) {
    const big = Math.max(R, r);
    return `M ${-big} 0 a ${big} ${big} 0 1 0 ${big * 2} 0 a ${big} ${big} 0 1 0 ${-big * 2} 0`;
  }

  // Tangent contact angle, measured off the axis joining the centres.
  const alpha = Math.asin((R - r) / d);
  const phi = Math.PI / 2 + alpha;

  // The head leads at +d along the local x axis; the tail trails at the origin.
  // The shape is then rotated so +x points along the direction of travel.
  const hx = d;
  const p = (n: number) => n.toFixed(2);

  const h1 = [hx - R * Math.cos(phi), R * Math.sin(phi)];
  const h2 = [hx - R * Math.cos(phi), -R * Math.sin(phi)];
  const t1 = [-r * Math.cos(phi), r * Math.sin(phi)];
  const t2 = [-r * Math.cos(phi), -r * Math.sin(phi)];

  return [
    `M ${p(h1[0])} ${p(h1[1])}`,
    // Around the head, the long way, past the leading edge.
    `A ${p(R)} ${p(R)} 0 1 0 ${p(h2[0])} ${p(h2[1])}`,
    `L ${p(t2[0])} ${p(t2[1])}`,
    // Around the tail, the short way.
    `A ${p(r)} ${p(r)} 0 0 0 ${p(t1[0])} ${p(t1[1])}`,
    "Z",
  ].join(" ");
}

/**
 * Solid shape that trails the dot. Standing still it is a circle; moving, it
 * draws out into a tapered capsule pointing along the direction of travel.
 * The spring is deliberately loose so the shape lags and settles softly rather
 * than snapping to the pointer.
 */
function CometFollower({
  x,
  y,
  vx,
  vy,
  state,
}: {
  x: MV;
  y: MV;
  vx: MV;
  vy: MV;
  state: State;
}) {
  // Loose and well damped: this is the "magnet strength". Lower stiffness
  // means more trailing lag and a gentler settle.
  const fx = useSpring(x, { stiffness: 145, damping: 21, mass: 0.8 });
  const fy = useSpring(y, { stiffness: 145, damping: 21, mass: 0.8 });

  const BASE = state === "view" ? 52 : state === "drag" ? 38 : state === "hide" ? 26 : 15;

  const [path, setPath] = useState(() => taperedCapsule(BASE, BASE, 0));
  const [angle, setAngle] = useState(0);
  const lastAngle = useRef(0);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const sx = vx.get();
      const sy = vy.get();
      const speed = Math.hypot(sx, sy);

      // Ease the response so small movements barely deform the shape and fast
      // ones taper off rather than running away.
      const t = Math.min(speed / 2.6, 1);
      const eased = t * t * (3 - 2 * t); // smoothstep

      const head = BASE * (1 + eased * 0.1);
      const tail = BASE * (1 - eased * 0.55);
      const gap = BASE * eased * 1.15;

      setPath(taperedCapsule(head, tail, gap));

      // Direction is noise at low speed, so hold the previous angle.
      if (speed > 0.12) lastAngle.current = (Math.atan2(sy, sx) * 180) / Math.PI;
      setAngle(lastAngle.current);

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [vx, vy, BASE]);

  const EXTENT = BASE * 3;

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{ x: fx, y: fy, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        style={{ rotate: angle }}
        transition={{ type: "spring", stiffness: 170, damping: 24 }}
      >
        <svg
          width={EXTENT * 2}
          height={EXTENT * 2}
          viewBox={`${-EXTENT} ${-EXTENT} ${EXTENT * 2} ${EXTENT * 2}`}
          style={{ display: "block", transform: "translate(-50%,-50%)", marginLeft: "50%", marginTop: "50%" }}
        >
          <path
            d={path}
            fill={state === "view" ? "#fd321c" : "#ffffff"}
            opacity={state === "hide" ? 0.4 : state === "default" ? 0.8 : 1}
          />
        </svg>
      </motion.div>
      {(state === "view" || state === "drag") && (
        <span className="absolute inset-0 grid place-items-center">
          <CursorLabel state={state} />
        </span>
      )}
    </motion.div>
  );
}

function CursorLabel({ state, inverted }: { state: State; inverted?: boolean }) {
  if (state !== "view" && state !== "drag") return null;
  const tone = state === "view" ? (inverted ? "text-paper" : "text-paper") : "text-ink";
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`font-sans text-[10px] font-bold uppercase tracking-wider ${tone}`}
    >
      {state === "view" ? "View" : "Drag"}
    </motion.span>
  );
}
