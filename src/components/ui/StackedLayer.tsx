import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Most the pin will ever cut from the top of the section beneath, in px. */
const MAX_CROP = 80;

/**
 * Two sections stacked on top of each other instead of end to end: `beneath`
 * plays out in full, holds where it finishes, and `children` then rides up
 * over it as a separate sheet.
 *
 * The pin offset is measured rather than written. `top: 0` would freeze the
 * section the moment its heading reached the top of the screen, with the rest
 * of it never seen; the section has to stick at `viewport - its own height`, so
 * it catches exactly as its last line lands on the bottom edge. CSS cannot
 * express that — a percentage in `top` resolves against the containing block,
 * not the element — so it is measured here and kept current by a
 * ResizeObserver. (`bottom: 0` is not the mirror image it looks like: it holds
 * a box while you scroll *toward* it and lets go once it arrives.)
 *
 * `hold` is the beat after that, where the finished section sits still before
 * the sheet reaches it. It wants to be generous: at less than a viewport the
 * section is technically shown and still goes by too fast to read, which is
 * indistinguishable from never having been shown at all.
 *
 * Once the sheet covers the viewport the section underneath is hidden
 * outright. It stays in the layout, pinned, with its marquees running, and
 * painting all of that under an opaque cover for the rest of the scroll is the
 * kind of steady waste that reads as a stutter.
 */
export function StackedLayer({
  beneath,
  children,
  hold = "h-[60vh] md:h-[90vh]",
}: {
  beneath: ReactNode;
  children: ReactNode;
  /** Height class for the pause between the two, in viewport units. */
  hold?: string;
}) {
  const pin = useRef<HTMLDivElement>(null);
  const edge = useRef<HTMLSpanElement>(null);
  const [top, setTop] = useState(0);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const el = pin.current;
    if (!el) return;
    // Anchoring at `viewport - height` shows the section whole, but on a screen
    // shorter than the section that crops the top — and the top is where the
    // heading is. Cap the crop so the section always keeps its own title.
    const measure = () =>
      setTop(Math.max(Math.min(0, window.innerHeight - el.offsetHeight), -MAX_CROP));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const el = edge.current;
    if (!el) return;
    // Fires only when the sheet's top edge crosses the top of the screen, so
    // this costs two callbacks per pass rather than anything per frame.
    const io = new IntersectionObserver(
      ([entry]) => setCovered(entry.boundingClientRect.bottom <= 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative">
      <div
        ref={pin}
        style={{ top }}
        className={cn(
          "sticky z-0 [contain:layout_paint]",
          covered && "invisible"
        )}
      >
        {beneath}
      </div>

      <div aria-hidden="true" className={hold} />

      <div className="relative z-10">
        <span ref={edge} aria-hidden="true" className="absolute left-0 top-0 h-px w-px" />
        {children}
      </div>
    </div>
  );
}
