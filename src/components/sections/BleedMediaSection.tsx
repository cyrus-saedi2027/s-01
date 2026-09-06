import type { ReactNode } from "react";

/**
 * Treatment 2 - full bleed split.
 *
 * The opposite move from the shared frame: no container at all. The photo runs
 * to the section's own edges - top, bottom and the outer side - so the section
 * boundary IS the photo's frame. What holds it together instead of a box is a
 * single alignment line: the copy column is one grid track, and the photo fills
 * the other completely, so the two columns are exactly the same height.
 *
 * Immersive and editorial. Use it for a hero or a section opener, once a page.
 */

interface BleedMediaSectionProps {
  eyebrow?: string;
  title: ReactNode;
  body: string;
  image: string;
  imageAlt: string;
  caption?: string;
  children?: ReactNode;
}

export function BleedMediaSection({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  caption,
  children,
}: BleedMediaSectionProps) {
  return (
    <section className="theme-dental-dark relative overflow-hidden bg-background text-foreground">
      {/* Warm depth behind the copy, so white type never sits on flat colour */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_15%,hsl(343_58%_26%)_0%,transparent_60%)]" />

      <div className="relative grid lg:grid-cols-[minmax(0,52%)_1fr] lg:items-stretch">
        {/* Copy column */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:py-24 lg:pr-16 xl:pr-24">
          {eyebrow && (
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
          )}

          <h1 className="mt-5 text-pretty text-[2.125rem] font-black leading-[1.25] sm:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>

          <p className="mt-6 max-w-[48ch] text-[0.9375rem] leading-[2.1] text-muted-foreground sm:text-base">
            {body}
          </p>

          {children && <div className="mt-10">{children}</div>}
        </div>

        {/* Photo: bleeds to the top, bottom and outer edge of the section */}
        <div className="relative min-h-[22rem] lg:min-h-[34rem]">
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 40%" }}
          />
          {/* Only the inner edge is softened, so the photo joins the copy. The
              direction is physical: in this RTL layout the photo sits on the
              left, so its inner edge is the right one. */}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-[hsl(343_62%_17%/0.9)] lg:block" />

          {caption && (
            <p className="absolute bottom-5 left-5 rounded-full bg-black/45 px-3.5 py-1.5 text-[0.6875rem] font-medium text-white backdrop-blur-sm">
              {caption}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
