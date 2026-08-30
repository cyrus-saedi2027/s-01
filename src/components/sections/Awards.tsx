import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, MaskLine, RevealGroup, RevealItem } from "../ui/Reveal";
import { awards, accolade } from "@/data/site";
import { MarqueeLabel } from "../ui/MarqueeLabel";

/** How far past its frame the plate starts, before scroll pulls it back. */
const START_SCALE = 1.7;

/**
 * Recognition. An oversized masthead, then the ledger of organisations beside a
 * plate that starts cropped and pulls back to full as the section rises.
 *
 * The pull-back is timed against when the plate is actually in frame, not
 * against the section's arrival. Ending it at `start start` — one viewport of
 * scroll — put the plate at full size slightly *before* its bottom edge had
 * cleared the screen, so the whole pull-back happened while it was still cut
 * off and there was nothing left to watch by the time you could see all of it.
 * Ending at the section's foot three quarters down the screen spends the last
 * stretch of it, 1.15 back to 1.0, exactly over the window where the seal is
 * wholly visible. After that it holds: `useTransform` clamps at the ends of its
 * range, so nothing extra is needed to stop it.
 */
export function Awards() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 75%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [START_SCALE, 1]);

  return (
    <section id="awards" ref={ref} className="relative py-16 md:py-20">
      <div className="shell">
        <Reveal className="mb-5">
          <MarqueeLabel text="Recognition" />
        </Reveal>

        {/* Masthead. The year range sits on the last line's baseline. */}
        <div className="mb-10 flex flex-col gap-3 md:mb-12 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2.75rem,7vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-tighter">
            <MaskLine>Awards &amp;</MaskLine>
            <MaskLine delay={0.08}>Honors</MaskLine>
          </h2>
          <Reveal delay={0.2}>
            <span className="block font-sans text-sm font-medium tracking-wide text-accent md:pb-[0.35em] md:text-base">
              2017 — 2025
            </span>
          </Reveal>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="aspect-[8/9] overflow-hidden rounded-xl border border-hair bg-surface">
              <motion.img
                src={accolade.src}
                alt={accolade.alt}
                loading="lazy"
                style={{ scale }}
                className="h-full w-full object-cover will-change-transform"
              />
            </div>
          </div>

          <RevealGroup className="flex flex-col lg:self-center" stagger={0.09}>
            {awards.map((a) => (
              <RevealItem
                key={a.org}
                className="grid grid-cols-1 gap-2 border-t border-hair py-5 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8 md:py-6"
              >
                <h3 className="text-[clamp(1.15rem,2.1vw,1.6rem)] font-semibold uppercase leading-none tracking-tight text-accent">
                  {a.org}
                </h3>
                <ul className="flex flex-col gap-1 sm:text-right">
                  {a.lines.map((l) => (
                    <li
                      key={l}
                      className="font-sans text-2xs font-medium uppercase tracking-wide text-paper/80 md:text-xs"
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
