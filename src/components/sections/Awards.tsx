import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, MaskLine, RevealGroup, RevealItem } from "../ui/Reveal";
import { awards, accolade } from "@/data/site";
import { MarqueeLabel } from "../ui/MarqueeLabel";

/** How far past its frame the plate starts, before scroll pulls it back. */
const START_SCALE = 1.45;

/**
 * Recognition. An oversized masthead, then the ledger of organisations beside a
 * plate that starts cropped and pulls back to full as the section rises.
 *
 * The pull-back is tied to the section crossing one viewport, so it finishes
 * while the ledger is still being read and then simply holds — `useTransform`
 * clamps at the ends of its range, so no extra guard is needed to stop it.
 */
export function Awards() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [START_SCALE, 1]);

  return (
    <section id="awards" ref={ref} className="relative py-24 md:py-36">
      <div className="shell">
        <Reveal className="mb-8">
          <MarqueeLabel text="Recognition" />
        </Reveal>

        {/* Masthead. The year range sits on the last line's baseline. */}
        <div className="mb-16 flex flex-col gap-4 md:mb-24 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(3.25rem,11vw,11rem)] font-semibold uppercase leading-[0.86] tracking-[-0.03em]">
            <MaskLine>Awards &amp;</MaskLine>
            <MaskLine delay={0.08}>Honors</MaskLine>
          </h2>
          <Reveal delay={0.2}>
            <span className="block font-sans text-sm font-medium tracking-wide text-accent md:pb-[0.35em] md:text-base">
              2017 — 2025
            </span>
          </Reveal>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="aspect-[2/3] overflow-hidden rounded-xl border border-hair bg-surface">
              <motion.img
                src={accolade.src}
                alt={accolade.alt}
                loading="lazy"
                style={{ scale }}
                className="h-full w-full object-cover will-change-transform"
              />
            </div>
          </div>

          <RevealGroup className="flex flex-col" stagger={0.09}>
            {awards.map((a) => (
              <RevealItem
                key={a.org}
                className="grid grid-cols-1 gap-4 border-t border-hair py-8 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-10 md:py-11"
              >
                <h3 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-semibold uppercase leading-none tracking-tight text-accent">
                  {a.org}
                </h3>
                <ul className="flex flex-col gap-2 sm:text-right">
                  {a.lines.map((l) => (
                    <li
                      key={l}
                      className="font-sans text-sm font-medium uppercase tracking-wide text-paper/85 md:text-[0.95rem]"
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
