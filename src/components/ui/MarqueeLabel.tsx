import { cn } from "@/lib/utils";

/**
 * Section eyebrow as a horizontal ticker.
 *
 * The label repeats inside a narrow clipped window, so a word slides out one
 * edge and the next copy enters from the other. Both edges are masked, which
 * is what makes text dissolve at the boundary instead of being cut by a hard
 * line.
 */
export function MarqueeLabel({
  text,
  className,
  duration = 12,
  width = "13rem",
  reverse = false,
}: {
  text: string;
  className?: string;
  /** Seconds for one full cycle. Longer copy wants a longer duration. */
  duration?: number;
  /** Width of the clipped window. */
  width?: string;
  reverse?: boolean;
}) {
  // Four copies keep the track wider than the window at any label length, so
  // the loop never shows a gap.
  const copies = Array.from({ length: 4 });

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ width }}
      aria-label={text}
    >
      {/* Soft edges — the reason the text fades out rather than clipping. */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)",
        }}
      />
      <div
        className={cn(
          "flex w-max flex-nowrap",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          maskImage:
            "linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)",
        }}
      >
        {/* Two halves so translating by -50% lands on an identical frame. */}
        {[0, 1].map((half) => (
          <div key={half} className="flex flex-nowrap" aria-hidden={half === 1}>
            {copies.map((_, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center gap-3 whitespace-nowrap px-3 font-sans text-2xs font-semibold uppercase tracking-wider text-accent"
              >
                <span aria-hidden="true">—</span>
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
