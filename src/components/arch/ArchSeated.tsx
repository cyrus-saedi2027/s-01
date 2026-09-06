import type { ReactNode } from "react";

/**
 * 01 - Seated. The arch springs from the frame's own bottom line, the way a
 * doorway springs from a floor, and the copy sits on that same line. Nothing
 * floats: both columns are anchored to one edge of the rectangle.
 */
export function ArchSeated({
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
    <div className="border border-border bg-card px-7 pt-9 sm:px-10 sm:pt-12">
      <div className="grid items-end gap-10 md:grid-cols-[1fr_minmax(0,38%)] md:gap-14">
        <div className="pb-9 sm:pb-12">
          <p className="text-xs font-medium tracking-[0.16em] text-primary">{eyebrow}</p>
          <h3 className="mt-4 text-pretty text-3xl font-black leading-tight sm:text-[2.5rem]">
            {title}
          </h3>
          <p className="mt-5 max-w-[42ch] text-[0.9375rem] font-light leading-[2.1] text-muted-foreground">
            {body}
          </p>
          {children && <div className="mt-8">{children}</div>}
        </div>

        {/* Flush with the frame's inner bottom edge - the floor of the composition */}
        <div className="shape-arch-flat relative aspect-[3/4] overflow-hidden bg-muted">
          <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
