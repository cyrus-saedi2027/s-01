import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { aboutPage, identity } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The pull quote: an attribution card on the left, an oversized quote mark,
 * and the statement itself rising a character at a time.
 *
 * Characters are staggered rather than words because the reference does the
 * same, and at this size a word-level stagger reads as a series of jumps.
 */
export function Statement() {
  return (
    <section className="relative py-24 md:py-36">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
        <Reveal className="self-start">
          <figcaption className="flex items-center gap-4 not-italic">
            <img
              src={aboutPage.avatar.src}
              alt={aboutPage.avatar.alt}
              className="h-[70px] w-[70px] shrink-0 rounded-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <span className="block">
              <span className="block text-md font-medium uppercase leading-[1.1] tracking-normalish">
                {identity.name}
              </span>
              <span className="mt-1 block font-sans text-xs uppercase text-[#8f8f8f]">
                {identity.role}
              </span>
            </span>
          </figcaption>
        </Reveal>

        <blockquote className="relative">
          <Reveal>
            <span
              aria-hidden="true"
              className="block text-[clamp(3.25rem,5.5vw,5rem)] font-bold leading-[0.55] text-paper"
            >
              &ldquo;
            </span>
          </Reveal>

          <p className="mt-8 text-[clamp(1.6rem,3.05vw,2.75rem)] font-semibold uppercase leading-[1] tracking-tight md:mt-10">
            <RisingChars text={aboutPage.statement} />
          </p>
        </blockquote>
      </div>
    </section>
  );
}

/**
 * Per-character rise.
 *
 * Words stay whole so the line still breaks on spaces, and each character is
 * an inline-block inside it — splitting on characters alone would let a word
 * break mid-way across a line end.
 */
function RisingChars({ text }: { text: string }) {
  let i = 0;
  return (
    <motion.span
      className="inline"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {[...word].map((ch, ci) => {
            const delay = i++ * 0.012;
            return (
              <motion.span
                key={ci}
                className="inline-block will-change-transform"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay } },
                }}
              >
                {ch}
              </motion.span>
            );
          })}
          {/* A real space, so the browser can still break the line here. */}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </motion.span>
  );
}
