import type { ReactNode } from "react";

/**
 * 04 - Crest. A full-width coloured band whose top edge is a shallow ellipse,
 * with the photo straddling that curve: half on the paper above, half on the
 * colour below. The curve is what separates the section from the page, so no
 * rule or border is needed.
 */
export function CrestMedia({
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
    <section className="theme-dental-dark shape-crest relative bg-background pb-20 pt-28 text-foreground sm:pt-32">
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 sm:px-10 md:grid-cols-[1fr_minmax(0,44%)] md:gap-14">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
          <h3 className="mt-4 text-pretty text-3xl font-black leading-tight sm:text-[2.5rem]">
            {title}
          </h3>
          <p className="mt-5 max-w-[44ch] text-[0.9375rem] font-light leading-[2.1] text-muted-foreground">
            {body}
          </p>
          {children && <div className="mt-8">{children}</div>}
        </div>

        {/* Straddles the crest: pulled up so it crosses the curve */}
        <div className="relative mx-auto w-full max-w-[22rem] md:-mt-40">
          <div className="aspect-[4/5] overflow-hidden rounded-[8rem_8rem_1.5rem_1.5rem] bg-muted shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]">
            <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
