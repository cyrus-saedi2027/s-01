import { motion } from "framer-motion";
import { playgroundWall } from "@/data/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The playground wall: a masonry grid of studies.
 *
 * Heights come from each tile's row span rather than from its artwork, which
 * is what keeps the columns staggered — sizing to the images instead would let
 * two same-ratio files line up and flatten the rhythm. Rows are a few pixels
 * tall so a span reads as a height in a fine unit.
 *
 * The row gap is zero and the gutter is the tile's own bottom margin instead.
 * A row gap would fall between every one of the rows a tile spans, not just
 * between tiles, so `span 26` would buy 26 rows *plus 25 gaps* — which made
 * every tile several times its intended height.
 */
export function Wall() {
  return (
    <section className="relative py-16 md:py-24">
      <div
        className="shell grid grid-cols-2 gap-x-4 md:gap-x-[30px] lg:grid-cols-4"
        style={{ gridAutoRows: "8px", rowGap: 0 }}
      >
        {playgroundWall.map((t, i) => (
          <motion.figure
            key={t.src + i}
            className={cn(
              "relative mx-0 mt-0 overflow-hidden rounded-[10px] bg-surface",
              "mb-4 md:mb-[30px]",
              t.wide && "col-span-2"
            )}
            style={{ gridRowEnd: `span ${t.span}` }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: EASE, delay: (i % 4) * 0.06 }}
          >
            <img
              src={t.src}
              alt={t.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-soft hover:scale-[1.04]"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
