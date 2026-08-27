import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Two-part pointer: a small solid dot that tracks precisely, and a lagging ring
 * that swells over interactive elements. Elements opt into states through a
 * `data-cursor` attribute ("hide" | "view" | "drag").
 */
export function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const [state, setState] = useState<"default" | "hide" | "view" | "drag">("default");
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  const dx = useMotionValue(-100);
  const dy = useMotionValue(-100);
  const rx = useSpring(dx, { stiffness: 380, damping: 34, mass: 0.5 });
  const ry = useSpring(dy, { stiffness: 380, damping: 34, mass: 0.5 });

  useEffect(() => {
    if (!fine) return;
    document.body.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        dx.set(e.clientX);
        dy.set(e.clientY);
        setVisible(true);

        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        const flagged = el?.closest<HTMLElement>("[data-cursor]");
        if (flagged) {
          setState((flagged.dataset.cursor as typeof state) ?? "default");
          return;
        }
        const clickable = el?.closest("a,button,input,textarea,select,[role='button']");
        setState(clickable ? "hide" : "default");
      });
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [fine, dx, dy]);

  if (!fine) return null;

  const ring =
    state === "view"
      ? { width: 104, height: 104, borderWidth: 0, background: "#fd321c", opacity: 1 }
      : state === "drag"
        ? { width: 76, height: 76, borderWidth: 0, background: "#ffffff", opacity: 1 }
        : state === "hide"
          ? { width: 54, height: 54, borderWidth: 1, background: "rgba(255,255,255,0)", opacity: 0.5 }
          : { width: 34, height: 34, borderWidth: 1, background: "rgba(255,255,255,0)", opacity: 1 };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity .25s" }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border-paper"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={ring}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        {state === "view" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-sans text-[10px] font-bold uppercase tracking-wider text-paper"
          >
            View
          </motion.span>
        )}
        {state === "drag" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-sans text-[10px] font-bold uppercase tracking-wider text-ink"
          >
            Drag
          </motion.span>
        )}
      </motion.div>

      {/* Precise dot — hidden while the ring is carrying a label. */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-paper"
        style={{ x: dx, y: dy, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: state === "view" || state === "drag" ? 0 : 1 }}
      />
    </div>
  );
}
