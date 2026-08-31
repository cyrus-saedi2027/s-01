import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FitText } from "@/components/ui/FitText";
import { Reveal } from "@/components/ui/Reveal";
import { aboutPage } from "@/data/site";

/**
 * The page opener: the word ABOUT set edge to edge in the accent gradient,
 * the two-part standfirst beneath it, and the portrait plate alongside.
 *
 * The plate drifts a little slower than the page, which is what separates it
 * from the copy column as you scroll rather than the two moving as one block.
 */
export function Intro() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section ref={ref} className="relative pt-[calc(var(--shell-x)+3.5rem)]">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <FitText
            text={aboutPage.title}
            style={{
              backgroundImage: "linear-gradient(273deg, #ff8a00 0%, #fd321c 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          />
        </motion.div>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col justify-start">
            <Reveal delay={0.12}>
              <h2 className="max-w-[22ch] text-[clamp(1.6rem,3.05vw,2.75rem)] font-semibold uppercase leading-[1] tracking-tight">
                {aboutPage.lead}
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-7 max-w-[24ch] text-[clamp(1.6rem,3.05vw,2.75rem)] font-semibold uppercase leading-[1] tracking-tight text-white/35">
                {aboutPage.secondary}
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-auto pt-12">
              <Signature />
            </Reveal>
          </div>

          <motion.div style={{ y: plateY }} className="lg:justify-self-end lg:pl-6">
            <Reveal delay={0.18}>
              <div className="overflow-hidden rounded-[10px]">
                <img
                  src={aboutPage.portrait.src}
                  alt={aboutPage.portrait.alt}
                  className="aspect-[675/770] w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </Reveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * The signed-off flourish under the copy. Drawn as a stroke so it can be
 * written on rather than faded in.
 */
function Signature() {
  return (
    <svg
      viewBox="0 0 250 150"
      className="h-[clamp(5rem,9vw,8.5rem)] w-auto"
      fill="none"
      role="img"
      aria-label="Zayla's signature"
    >
      <motion.path
        d="M16 40 C40 18 84 12 128 16 C100 52 70 88 40 122 C74 108 112 104 152 110
           C176 114 196 104 206 84 C212 70 202 60 192 68 C182 76 186 96 200 108
           C212 118 228 116 236 106"
        stroke="#fd321c"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
      />
    </svg>
  );
}
