import { Reveal, MaskLine, RevealGroup, RevealItem } from "../ui/Reveal";
import { awards } from "@/data/site";
import { MarqueeLabel } from "../ui/MarqueeLabel";

/** Recognition ledger — a four-column list under one shared rule. */
export function Awards() {
  return (
    <section id="awards" className="relative py-24 md:py-36">
      <div className="shell">
        <div className="mb-14 md:mb-20">
          <Reveal className="mb-6">
            <MarqueeLabel text="Recognition" />
          </Reveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="text-[clamp(2.75rem,7vw,7.5rem)] font-medium leading-[0.9] tracking-tighter">
              <MaskLine>Awards &amp;</MaskLine>
              <MaskLine delay={0.08} className="text-dimmer">
                Honors
              </MaskLine>
            </h2>
            <Reveal delay={0.2}>
              <span className="font-sans text-2xs uppercase tracking-wider text-dim">
                2017 — 2025
              </span>
            </Reveal>
          </div>
        </div>

        <RevealGroup
          className="grid gap-px border-t border-hair sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.09}
        >
          {awards.map((a) => (
            <RevealItem
              key={a.org}
              className="group border-b border-hair py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <h3 className="mb-6 flex items-center gap-3 text-lg font-medium tracking-snug transition-colors duration-500 group-hover:text-accent">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {a.org}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {a.lines.map((l) => (
                  <li
                    key={l}
                    className="font-sans text-sm text-dim transition-colors duration-500 group-hover:text-paper/80"
                  >
                    {l}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
