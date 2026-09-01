import { motion } from "framer-motion";
import { useState } from "react";
import { HoverStaggerLabel } from "../ui/AnimatedText";
import { projects, type Project } from "@/data/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The projects index: one plate per project, hung off alternating edges at a
 * slight tilt, with the details opposite it.
 *
 * The plates deliberately run past the shell's margin — they are wider than
 * their column and pulled outward — which is what makes the column of text
 * read as the still thing and the work as the thing passing by. The page's own
 * `overflow-x: hidden` on the body keeps that from adding a scrollbar.
 */
export function ProjectIndex() {
  return (
    // `clip` rather than `hidden`: hidden on one axis forces the other to
    // `auto`, which would make this a scroll container and cost the page its
    // ability to hold anything sticky inside.
    <section id="projects" className="relative overflow-x-clip py-20 md:py-28">
      <div className="flex flex-col gap-16 md:gap-24 lg:gap-8">
        {projects.map((p, i) => (
          <Row key={p.title} project={p} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function Row({ project, flip }: { project: Project; flip: boolean }) {
  const [hover, setHover] = useState(false);

  return (
    <article
      className={cn(
        "shell grid items-center gap-8 lg:min-h-[36rem] lg:grid-cols-2 lg:gap-16",
        // The plate leads on the left for the flipped rows; on small screens it
        // always comes first, because the tilt needs the full width to read.
        flip && "lg:[&>*:first-child]:order-2"
      )}
    >
      {/* Plate */}
      <motion.a
        href="#contact"
        aria-label={`${project.title} — view project`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="block overflow-hidden rounded-[10px] will-change-transform"
        style={{
          // Hung past the shell margin on the side it already sits: a normal
          // row puts the plate left, a flipped one right. Bleeding the other
          // way would run it over the copy in the opposite column.
          marginInline: flip ? "0 -14%" : "-14% 0",
        }}
        initial={{ opacity: 0, y: 90, rotate: flip ? 5 : -5 }}
        whileInView={{ opacity: 1, y: 0, rotate: flip ? 5 : -5 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.95, ease: EASE }}
      >
        <motion.img
          src={project.cover}
          alt={`${project.title} — cover artwork`}
          loading="lazy"
          decoding="async"
          className="aspect-[840/580] w-full object-cover"
          animate={{ scale: hover ? 1.05 : 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </motion.a>

      {/* Details. They rise further than an ordinary reveal — the reference
          carries them a full 150px — so they arrive after the plate. */}
      <motion.div
        initial={{ opacity: 0, y: 150 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: EASE, delay: 0.1 }}
        className={cn(flip && "lg:pr-6", !flip && "lg:pl-6")}
      >
        <p className="font-sans text-2xs font-semibold uppercase tracking-wider text-accent">
          {project.index}
        </p>

        <h2 className="mt-4 text-[clamp(2.25rem,5.2vw,4.5rem)] font-medium leading-[0.95] tracking-tighter">
          {project.title}
        </h2>

        <p className="mt-4 max-w-[34ch] font-sans text-2xs uppercase tracking-wider text-dim md:text-xs">
          {project.tags}
        </p>

        <p className="mt-6 max-w-[40ch] font-sans text-sm leading-relaxed text-dim">
          {project.blurb}
        </p>

        <a
          href="#contact"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="mt-8 inline-flex items-center gap-3 font-sans text-2xs font-semibold uppercase tracking-wider"
        >
          <HoverStaggerLabel text="View project" active={hover} />
          <span className="h-px w-8 bg-accent" />
        </a>
      </motion.div>
    </article>
  );
}
