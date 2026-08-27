import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Marquee } from "../ui/Marquee";
import { heroImage, heroMarquee, heroTagline, identity } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Opening screen. An oversized wordmark scrolls behind a centred portrait
 * card, with the tagline set beneath it — the card is the subject, the type
 * is the backdrop.
 */
export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The card lifts and fades as the next section arrives; the wordmark behind
  // it drifts the other way, which opens up a little parallax.
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const taglineWords = heroTagline.split(" ");

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-28 md:pt-32"
    >
      {/* Wordmark running behind the card. */}
      <motion.div
        aria-hidden="true"
        style={{ y: wordY, opacity: fade }}
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.5 }}
      >
        <Marquee duration={44}>
          <span className="whitespace-nowrap px-8 text-[clamp(7rem,20vw,17rem)] font-semibold uppercase leading-none tracking-tighter text-[#141414]">
            {heroMarquee}
          </span>
          <span className="px-8 text-[clamp(7rem,20vw,17rem)] font-semibold leading-none text-[#1c1c1c]">
            —
          </span>
        </Marquee>
      </motion.div>

      {/* Portrait card. */}
      <motion.div
        style={{ y: cardY, scale: cardScale }}
        className="relative z-10 flex justify-center px-[var(--shell-x)]"
      >
        <TiltCard ready={ready} />
      </motion.div>

      {/* Tagline. */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mt-10 px-[var(--shell-x)] md:mt-14"
      >
        <h1 className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-[0.32em] gap-y-1 text-center text-[clamp(0.95rem,1.7vw,1.375rem)] font-medium uppercase leading-[1.35] tracking-normalish">
          {taglineWords.map((word, i) => (
            <span key={`${word}-${i}`} className="clip-line inline-flex">
              <motion.span
                className="inline-block"
                initial={{ y: "115%" }}
                animate={ready ? { y: "0%" } : {}}
                transition={{ duration: 0.8, delay: 0.75 + i * 0.045, ease: EASE }}
              >
                {word === "&" ? <span className="text-accent">&amp;</span> : word}
              </motion.span>
            </span>
          ))}
        </h1>
      </motion.div>

      {/* Meta rail pinned to the bottom edge. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 1.25 }}
        className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-[var(--shell-x)] pb-6"
      >
        <span className="hidden items-center gap-2 font-sans text-2xs uppercase tracking-wider text-dim sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Available for work
        </span>

        <a
          href="#about"
          className="group flex items-center gap-3 font-sans text-2xs uppercase tracking-wider text-dim transition-colors hover:text-paper"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full border border-hairStrong transition-colors duration-500 group-hover:border-accent">
            <motion.svg
              width="11"
              height="13"
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
          Scroll
        </a>

        <span className="hidden font-sans text-2xs uppercase tracking-wider text-dim sm:block">
          Amsterdam, {identity.location}
        </span>
      </motion.div>
    </section>
  );
}

/**
 * The hero image, tilting toward the pointer.
 *
 * Pointer offset drives motion values through springs, and the image layer
 * counter-shifts a little so the picture drifts inside its frame — enough to
 * feel like it has depth without becoming a gimmick. Everything is written to
 * motion values, so moving the mouse never re-renders React.
 */
function TiltCard({ ready }: { ready: boolean }) {
  const box = useRef<HTMLDivElement>(null);

  // -0.5 .. 0.5 across the card in each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 150, damping: 18, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  // The picture drifts against the tilt for a touch of parallax.
  const shiftX = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const shiftY = useTransform(sy, [-0.5, 0.5], [12, -12]);

  const onMove = (e: React.MouseEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.figure
      ref={box}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" }}
      animate={ready ? { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" } : {}}
      transition={{ duration: 1.15, delay: 0.25, ease: EASE }}
      style={{ perspective: 900 }}
      className="group relative w-[min(80vw,340px)] md:w-[min(42vw,400px)]"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-xl"
      >
        <div className="aspect-[3/4] w-full overflow-hidden">
          <motion.img
            src={heroImage.src}
            alt={heroImage.alt}
            style={{ x: shiftX, y: shiftY }}
            className="h-full w-full scale-[1.12] object-cover"
          />
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10"
        />
      </motion.div>
    </motion.figure>
  );
}
