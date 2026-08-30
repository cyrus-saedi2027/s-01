import { Reveal, MaskLine } from "../ui/Reveal";
import { Marquee } from "../ui/Marquee";
import { testimonials } from "@/data/site";
import { MarqueeLabel } from "../ui/MarqueeLabel";

/**
 * Two counter-scrolling rows of quote cards; hovering pauses the row.
 *
 * Kept deliberately short. This section is pinned under the archive wall that
 * follows it (see StackedLayer), and it holds still there while the sheet
 * approaches — so anything taller than a laptop's viewport spends that hold
 * with its own heading pushed off the top of the screen.
 */
export function Testimonials() {
  const half = Math.ceil(testimonials.length / 2);
  const rowA = testimonials.slice(0, half);
  const rowB = testimonials.slice(half);

  return (
    <section id="testimonials" className="relative overflow-hidden py-10 md:py-11">
      <div className="shell mb-7 md:mb-8">
        <Reveal className="mb-4">
          <MarqueeLabel text="Testimonials" />
        </Reveal>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2rem,5vw,4.25rem)] font-medium leading-[0.9] tracking-tighter">
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
        <div className="flex flex-col gap-3">
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
      <figcaption className="mt-4 flex items-center gap-3 border-t border-hair pt-4">
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
