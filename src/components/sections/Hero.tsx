import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedHeadline } from "../ui/AnimatedText";
import { Marquee } from "../ui/Marquee";
import { heroLine, identity } from "@/data/site";

/**
 * Opening screen: a giant character-animated statement, a scroll cue, and the
 * repeating name band that runs along the bottom edge.
 */
export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The statement drifts up and dims as the next section arrives.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 md:pt-32"
    >
      <motion.div style={{ y, opacity, scale }} className="shell flex-1">
        <div className="flex h-full flex-col justify-center">
          {/* Meta row above the statement */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-2 font-sans text-2xs uppercase tracking-wider text-dim md:mb-12"
          >
            <span className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Available for work
            </span>
            <span className="hidden md:inline">Amsterdam, {identity.location}</span>
            <span className="hidden lg:inline">Est. 2017</span>
          </motion.div>

          {ready && (
            <h1 className="max-w-[18ch] text-[clamp(2.75rem,8.4vw,9.375rem)] font-medium leading-[0.92] tracking-tighter">
              <AnimatedHeadline
                words={heroLine}
                stagger={0.014}
                delay={0.1}
                amount={0}
                className="gap-x-[0.06em]"
              />
            </h1>
          )}

          {/* Supporting line + scroll cue */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.15 }}
            className="mt-10 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-md font-sans text-sm leading-relaxed text-dim">
              Brand systems, interfaces and the front-end that carries them —
              designed and built end to end, from one desk.
            </p>

            <a
              href="#about"
              className="group flex items-center gap-4 font-sans text-2xs uppercase tracking-wider text-dim transition-colors hover:text-paper"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full border border-hairStrong transition-colors duration-500 group-hover:border-accent">
                <motion.svg
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path
                    d="M6 1v11m0 0L1 7.5M6 12l5-4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </span>
              Scroll to explore
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Name band along the bottom edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.3 }}
        className="relative border-t border-hair py-4"
      >
        <Marquee duration={34}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="flex items-center gap-6 whitespace-nowrap px-6 font-sans text-2xs font-semibold uppercase tracking-wider text-dim"
            >
              {identity.name}
              <span className="text-accent">—</span>
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
