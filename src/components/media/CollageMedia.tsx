import type { ReactNode } from "react";

/**
 * 05 - Collage. Two photos at different scales and a copy card that overlaps
 * the larger one. The small photo carries a thick ring in the page colour, so
 * it reads as cut out and laid on top rather than tucked behind. The only
 * asymmetric treatment of the five.
 */
export function CollageMedia({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  inset,
  insetAlt,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  inset: string;
  insetAlt: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative grid gap-8 md:grid-cols-[minmax(0,54%)_1fr] md:items-center md:gap-0">
      <div className="relative">
        <div className="aspect-[5/4] overflow-hidden rounded-[2rem] bg-muted">
          <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
        </div>

        <div className="absolute -bottom-6 start-4 aspect-square w-32 overflow-hidden rounded-[1.25rem] bg-muted ring-8 ring-background sm:-bottom-8 sm:w-40">
          <img src={inset} alt={insetAlt} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Overlaps the large photo's inner edge */}
      <div className="relative z-10 rounded-[1.75rem] border border-border bg-card p-7 shadow-[0_20px_50px_-30px_rgba(69,16,31,0.5)] sm:p-9 md:-mr-14 md:py-12">
        <p className="text-xs font-medium tracking-[0.16em] text-primary">{eyebrow}</p>
        <h3 className="mt-4 text-pretty text-2xl font-black leading-tight sm:text-3xl">{title}</h3>
        <p className="mt-4 max-w-[38ch] text-[0.9375rem] font-light leading-[2.1] text-muted-foreground">
          {body}
        </p>
        {children && <div className="mt-7">{children}</div>}
      </div>
    </div>
  );
}
