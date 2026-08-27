import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { MarqueeLabel } from "../ui/MarqueeLabel";
import { MaskLine, Reveal } from "../ui/Reveal";
import { MagneticButton } from "../ui/MagneticButton";
import { gallery, projects, type Project } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The long-form counterpart to the works index: each project gets a full row,
 * then a gallery closes the section out.
 */
export function CaseStudies() {
  return (
    <section id="case-studies" className="relative py-24 md:py-36">
      <div className="shell">
        <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal className="mb-6">
              <MarqueeLabel text="Case studies" />
            </Reveal>
            <h2 className="text-[clamp(2.75rem,7vw,7.5rem)] font-medium leading-[0.9] tracking-tighter">
              <MaskLine>In</MaskLine>
              <MaskLine delay={0.08} className="text-dimmer">
                Detail
              </MaskLine>
            </h2>
          </div>
          <Reveal delay={0.2}>
            <MagneticButton label="View all works" href="#projects" variant="outline" />
          </Reveal>
        </div>
      </div>

      {/* The covers are rotated, which widens their footprint and can push the
          page sideways on narrow screens. `clip` confines that without creating
          a scroll container — `hidden` would, and would break the sticky
          gallery further down. */}
      <div className="shell flex flex-col gap-28 overflow-x-clip md:gap-44">
        {projects.map((p, i) => (
          <FeatureRow key={p.title} project={p} index={i} flipped={i % 2 === 1} />
        ))}
      </div>

      <GalleryWall />
    </section>
  );
}

/**
 * One project row. The cover enters sheared over and unwinds to square as it
 * crosses the viewport, while the copy opposite rises into place. The two run
 * off the same scroll range so they resolve together.
 */
function FeatureRow({
  project,
  index,
  flipped,
}: {
  project: Project;
  index: number;
  flipped: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Smoothing keeps the shear from tracking every scroll jitter.
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  // Mirror the lean so each row tips away from its own side.
  const dir = flipped ? -1 : 1;
  const skewY = useTransform(p, [0, 1], [4.5 * dir, 0]);
  const rotate = useTransform(p, [0, 1], [-1.6 * dir, 0]);
  const scale = useTransform(p, [0, 1], [0.88, 1]);
  const lift = useTransform(p, [0, 1], [70, 0]);

  const textX = useTransform(p, [0, 1], [30 * -dir, 0]);
  const textOpacity = useTransform(p, [0.15, 0.75], [0, 1]);

  return (
    <div
      ref={ref}
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        flipped ? "" : "lg:[&>*:first-child]:order-2"
      }`}
    >
      {/* Cover */}
      <motion.div
        style={{ skewY, rotate, scale, y: lift }}
        className="relative overflow-hidden rounded-xl will-change-transform"
      >
        <div className="aspect-[3/2] w-full overflow-hidden">
          <img
            src={project.cover}
            alt={`${project.title} cover`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10"
        />
      </motion.div>

      {/* Copy */}
      <motion.div
        style={{ x: textX, opacity: textOpacity }}
        className={`flex flex-col ${flipped ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left"}`}
      >
        <span className="font-sans text-2xs font-semibold uppercase tracking-wider text-accent">
          / {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-4 text-[clamp(2.25rem,6vw,5rem)] font-medium leading-none tracking-tighter">
          {project.title}
        </h3>
        <p className="mt-4 font-sans text-2xs uppercase tracking-wider text-dim">
          {project.tags}
        </p>
        <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-dim">
          {project.blurb}
        </p>
        <div className="mt-8">
          <MagneticButton label="View project" href="#projects" variant="accent" />
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Closing gallery. The wall starts pushed up against the viewer and settles
 * back as the section scrolls, with the middle column running against the
 * outer two so the grid never moves as one slab.
 *
 * The wall is deliberately taller than the window it is seen through, so even
 * at rest it overflows the mask and the columns' parallax can never open a gap
 * at the top or bottom. Centring is done by the parent rather than a transform,
 * because Framer writes the whole `transform` property when it animates scale
 * and would drop a translate applied alongside it.
 */
function GalleryWall() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });

  const scale = useTransform(p, [0, 1], [1.5, 1]);
  const outer = useTransform(p, [0, 1], [40, -40]);
  const middle = useTransform(p, [0, 1], [-70, 90]);

  // Four tiles per column keeps every column full at any offset.
  const columns = [
    [gallery[0], gallery[3], gallery[6], gallery[1]],
    [gallery[1], gallery[4], gallery[7], gallery[2]],
    [gallery[2], gallery[5], gallery[8], gallery[0]],
  ];

  return (
    <div ref={track} className="relative mt-28 h-[220vh] md:mt-40">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            maskImage: "linear-gradient(to bottom, #000 0%, #000 46%, transparent 94%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 46%, transparent 94%)",
          }}
        >
          <motion.div
            style={{ scale }}
            className="grid h-[150vh] w-full max-w-[1600px] grid-cols-3 gap-3 px-3 will-change-transform md:gap-5 md:px-5"
          >
            {columns.map((col, i) => (
              <motion.div
                key={i}
                style={{ y: i === 1 ? middle : outer }}
                className="flex min-h-0 flex-col gap-3 will-change-transform md:gap-5"
              >
                {col.map((src, j) => (
                  <figure
                    key={`${src}-${j}`}
                    className="min-h-0 flex-1 overflow-hidden rounded-lg"
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </figure>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
