import type { ReactNode } from "react";

/**
 * 04 - Window. The rectangle is a wall and the arch is an opening cut into it.
 * An inset shadow around the opening and a sill line under it give the cut a
 * thickness, so the photo reads as seen through the wall rather than pasted on.
 */
export function ArchWindow({
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
    <div className="border border-border bg-secondary px-7 py-12 sm:px-12 sm:py-14">
      <div className="grid items-center gap-12 md:grid-cols-[minmax(0,36%)_1fr] md:gap-16">
        <div className="relative">
          <div className="shape-arch relative aspect-[3/4] overflow-hidden bg-card">
            <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
            {/* Thickness of the cut */}
            <div
              aria-hidden
              className="shape-arch pointer-events-none absolute inset-0"
              style={{ boxShadow: "inset 0 0 0 1px rgba(28,16,19,0.18), inset 0 8px 34px rgba(28,16,19,0.38)" }}
            />
          </div>
          {/* Sill */}
          <div aria-hidden className="mt-2.5 h-px w-full bg-foreground/15" />
        </div>

        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-primary">{eyebrow}</p>
          <h3 className="mt-4 text-pretty text-3xl font-black leading-tight sm:text-[2.5rem]">
            {title}
          </h3>
          <p className="mt-5 max-w-[42ch] text-[0.9375rem] font-light leading-[2.1] text-muted-foreground">
            {body}
          </p>
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </div>
  );
}
