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
    <section id="testimonials" className="relative overflow-hidden py-14 md:py-16">
      <div className="shell mb-8 md:mb-12">
        <Reveal className="mb-6">
          <MarqueeLabel text="Testimonials" />
        </Reveal>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2.25rem,5.5vw,5rem)] font-medium leading-[0.9] tracking-tighter">
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
        <div className="flex flex-col gap-4">
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
      className="group mx-2 flex w-[80vw] shrink-0 flex-col justify-between rounded-lg border border-hair bg-surface p-5 transition-colors duration-500 hover:border-hairStrong hover:bg-surfaceUp sm:w-[380px] md:w-[420px] md:p-6"
    >
      <span aria-hidden="true" className="mb-3 block text-3xl leading-none text-accent">
        &ldquo;
      </span>
      <blockquote className="font-sans text-sm leading-relaxed text-paper/85">
        {quote}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-hair pt-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-hairStrong font-sans text-2xs font-semibold tracking-wide transition-colors duration-500 group-hover:border-accent group-hover:bg-accent">
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
