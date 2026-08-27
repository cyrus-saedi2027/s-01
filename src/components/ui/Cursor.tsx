import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
 * Solid disc that trails the dot and deforms with motion: it stretches along
 * the direction of travel and narrows across it, so fast movement reads as a
 * streak and a resting pointer settles back into a circle.
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
  // Softer spring than the ring, so the trailing lag is visible.
  const fx = useSpring(x, { stiffness: 190, damping: 22, mass: 0.7 });
  const fy = useSpring(y, { stiffness: 190, damping: 22, mass: 0.7 });

  const speed = useTransform<number, number>([vx, vy], ([a, b]) =>
    Math.min(Math.hypot(a as number, b as number), 3.4)
  );
  // Capped so the disc elongates noticeably without turning into a smear.
  const stretch = useTransform(speed, [0, 3.4], [1, 1.7]);
  const squash = useTransform(speed, [0, 3.4], [1, 0.62]);
  const angle = useTransform<number, number>([vx, vy], ([a, b]) => {
    const sp = Math.hypot(a as number, b as number);
    // Below a threshold the direction is noise, so hold the last stable angle.
    return sp < 0.06 ? 0 : (Math.atan2(b as number, a as number) * 180) / Math.PI;
  });
  const smoothAngle = useSpring(angle, { stiffness: 260, damping: 30 });
  // Keeps the label upright inside the tilted disc.
  const counterAngle = useTransform(smoothAngle, (a) => -a);

  const size = state === "view" ? 104 : state === "drag" ? 76 : state === "hide" ? 52 : 30;

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{ x: fx, y: fy, translateX: "-50%", translateY: "-50%", rotate: smoothAngle }}
    >
      <motion.div
        className="grid place-items-center rounded-full"
        style={{ scaleX: stretch, scaleY: squash }}
        animate={{
          width: size,
          height: size,
          backgroundColor: state === "view" ? "#fd321c" : "#ffffff",
          opacity: state === "hide" ? 0.45 : state === "default" ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <motion.span style={{ rotate: counterAngle }}>
          <CursorLabel state={state} inverted />
        </motion.span>
      </motion.div>
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
