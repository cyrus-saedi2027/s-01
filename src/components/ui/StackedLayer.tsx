import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Two sections stacked on top of each other instead of end to end: `beneath`
 * plays out in full, holds where it finishes, and `children` then rides up
 * over it as a separate sheet.
 *
 * The pinned box is exactly one viewport tall, and that is the whole trick.
 * Anything else has a part of the section that cannot be on screen during the
 * hold, and which part that is only moves with the arithmetic: pinning at
 * `viewport - height` holds the section by its last line and pushes its
 * heading off the top; clamping that offset to keep the heading pins it early
 * and the end never arrives. Both were tried. A box the size of the screen has
 * no such part — the section catches at `top: 0` with all of it in view — so
 * `beneath` is handed a screen-sized box and is expected to lay itself out
 * inside it. The height is measured rather than written as `100vh`, because on
 * a phone `100vh` is the viewport with the browser's chrome hidden, which is
 * taller than the screen you are actually looking at.
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
  hold = "h-[85vh] md:h-[115vh]",
}: {
  beneath: ReactNode;
  children: ReactNode;
  /** Height class for the pause between the two, in viewport units. */
  hold?: string;
}) {
  const edge = useRef<HTMLSpanElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const measure = () => setHeight(window.innerHeight);
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
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
        style={{ top: 0, height }}
        className={cn(
          "sticky z-0 [contain:layout_paint]",
          // Before the measurement lands there is no height to give it, and a
          // box of nothing would collapse the layout under it for one frame.
          height === undefined && "h-screen",
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
