import { useEffect } from "react";

/**
 * Lerp-based smooth scrolling, in the spirit of the reference site's inertial feel.
 * Drives window.scrollTo rather than transforming a wrapper, so `position: sticky`,
 * IntersectionObserver and anchor links all keep working normally.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices already have momentum scrolling; hijacking it feels worse.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let frame = 0;
    let running = false;

    // Cached, not read per wheel event. `scrollHeight` is a forced synchronous
    // layout, and during a scroll the tree is always dirty — so reading it on
    // every tick made the page pay for a full layout per wheel event, which is
    // felt most over a tall `position: sticky` subtree. A ResizeObserver on the
    // root keeps the number honest as sections reveal and images settle.
    let limit = document.documentElement.scrollHeight - window.innerHeight;
    const measure = () => {
      limit = document.documentElement.scrollHeight - window.innerHeight;
    };
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);

    const tick = () => {
      current += (target - current) * 0.11;
      if (Math.abs(target - current) < 0.35) {
        current = target;
        running = false;
        window.scrollTo(0, current);
        return;
      }
      window.scrollTo(0, current);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom
      if (document.documentElement.dataset.locked === "true") return;
      e.preventDefault();
      target = Math.max(0, Math.min(limit, target + e.deltaY));
      start();
    };

    // Keyboard, anchor jumps and programmatic scrolls resync the target.
    const onScroll = () => {
      if (!running) {
        target = window.scrollY;
        current = window.scrollY;
      }
    };

    const onResize = () => {
      measure();
      target = Math.max(0, Math.min(limit, target));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [enabled]);
}
