import { Reveal } from "@/components/ui/Reveal";
import { awards, honors } from "@/data/site";
import { SectionHead } from "./Experience";

/**
 * The recognition ledger: the plate holds the left column while the awards
 * list runs down the right, organisation and citations side by side.
 */
export function Honors() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="shell">
        <SectionHead
          eyebrow={honors.eyebrow}
          heading={honors.heading}
          years={honors.years}
        />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[10px]">
              <img
                src={honors.plate.src}
                alt={honors.plate.alt}
                className="aspect-[490/590] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>

          <div>
            {awards.map((a, i) => (
              <Reveal
                key={a.org}
                delay={i * 0.06}
                className="grid gap-4 border-b border-hair py-8 last:border-b-0 sm:grid-cols-2 sm:gap-10 md:py-10"
              >
                <h3 className="text-[clamp(1.35rem,2.1vw,1.9rem)] font-medium uppercase leading-[0.9] tracking-snug text-accent">
                  {a.org}
                </h3>
                <ul className="space-y-1.5">
                  {a.lines.map((line) => (
                    <li
                      key={line}
                      className="text-sm font-medium uppercase leading-[1.2] tracking-normalish"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
