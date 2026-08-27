import { Reveal, MaskLine } from "../ui/Reveal";
import { Marquee } from "../ui/Marquee";
import { testimonials } from "@/data/site";
import { MarqueeLabel } from "../ui/MarqueeLabel";

/** Two counter-scrolling rows of quote cards; hovering pauses the row. */
export function Testimonials() {
  const half = Math.ceil(testimonials.length / 2);
  const rowA = testimonials.slice(0, half);
  const rowB = testimonials.slice(half);

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 md:py-36">
      <div className="shell mb-14 md:mb-20">
        <Reveal className="mb-6">
          <MarqueeLabel text="Testimonials" />
        </Reveal>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2.75rem,7vw,7.5rem)] font-medium leading-[0.9] tracking-tighter">
            <MaskLine>Trusted</MaskLine>
            <MaskLine delay={0.08} className="text-dimmer">
              Feedback
            </MaskLine>
          </h2>
          <Reveal delay={0.2}>
            <p className="max-w-sm font-sans text-sm leading-relaxed text-dim">
              A few words from the people whose projects ended up on this page.
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal amount={0.05}>
        <div className="flex flex-col gap-5">
          <Marquee duration={62} pauseOnHover fade>
            {rowA.map((t) => (
              <QuoteCard key={t.name} {...t} />
            ))}
          </Marquee>
          <Marquee duration={72} reverse pauseOnHover fade>
            {rowB.map((t) => (
              <QuoteCard key={t.name} {...t} />
            ))}
          </Marquee>
        </div>
      </Reveal>
    </section>
  );
}

function QuoteCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <figure
      data-cursor="drag"
      className="group mx-2.5 flex w-[86vw] shrink-0 flex-col justify-between rounded-lg border border-hair bg-surface p-7 transition-colors duration-500 hover:border-hairStrong hover:bg-surfaceUp sm:w-[420px] md:w-[480px] md:p-9"
    >
      <span aria-hidden="true" className="mb-5 block text-4xl leading-none text-accent">
        &ldquo;
      </span>
      <blockquote className="font-sans text-base leading-relaxed text-paper/85">
        {quote}
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-4 border-t border-hair pt-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-hairStrong font-sans text-2xs font-semibold tracking-wide transition-colors duration-500 group-hover:border-accent group-hover:bg-accent">
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-sans text-sm font-semibold">{name}</span>
          <span className="block truncate font-sans text-2xs uppercase tracking-wide text-dim">
            {role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
