import type { ReactNode } from "react";

/**
 * 03 - Nested. Three arches echo outward behind the photo, each a hairline,
 * each fainter - the taq-nama of a facade, redrawn. The rectangle crops the
 * outermost echoes, which is what makes them read as a continuing series
 * rather than three decorative rings.
 */
export function ArchNested({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  children?: ReactNode;
}) {
  return (
    <div className="theme-dental-dark relative overflow-hidden bg-background px-7 py-12 text-foreground sm:px-12 sm:py-16">
      <div className="grid items-end gap-12 md:grid-cols-[1fr_minmax(0,40%)] md:gap-16">
        <div className="pb-2">
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
          <h3 className="mt-4 text-pretty text-3xl font-black leading-tight sm:text-[2.5rem]">
            {title}
          </h3>
          <p className="mt-5 max-w-[42ch] text-[0.9375rem] font-light leading-[2.1] text-muted-foreground">
            {body}
          </p>
          {children && <div className="mt-8">{children}</div>}
        </div>

        <div className="relative">
          {/* Echoes, cropped by the frame */}
          {[
            { inset: "-2rem", opacity: 0.5 },
            { inset: "-4rem", opacity: 0.3 },
            { inset: "-6rem", opacity: 0.16 },
          ].map(({ inset, opacity }) => (
            <div
              key={inset}
              aria-hidden
              className="shape-arch-flat pointer-events-none absolute border border-white"
              style={{ top: inset, right: inset, left: inset, bottom: 0, opacity }}
            />
          ))}

          <div className="shape-arch-flat relative aspect-[3/4] overflow-hidden bg-muted">
            <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
