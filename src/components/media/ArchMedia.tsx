import type { ReactNode } from "react";

/**
 * 01 - Arch. The photo is cut as a doorway: a true semicircle on top, a soft
 * square below. A second arch in outline sits behind it, offset, so the shape
 * reads as deliberate architecture rather than a rounded corner.
 */
export function ArchMedia({
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
    <div className="grid items-center gap-12 md:grid-cols-[minmax(0,40%)_1fr] md:gap-16">
      <div className="relative mx-auto w-full max-w-[22rem] md:mx-0">
        {/* The echo: same arch, outlined, pushed down and out */}
        <div
          aria-hidden
          className="shape-arch absolute inset-0 translate-x-5 translate-y-5 border border-primary/35"
        />
        <div className="shape-arch relative aspect-[3/4] overflow-hidden bg-muted">
          <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="border-primary/25 md:border-r md:pr-10">
        <p className="text-xs font-medium tracking-[0.16em] text-primary">{eyebrow}</p>
        <h3 className="mt-4 text-pretty text-3xl font-black leading-tight sm:text-[2.5rem]">
          {title}
        </h3>
        <p className="mt-5 max-w-[44ch] text-[0.9375rem] font-light leading-[2.1] text-muted-foreground">
          {body}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
