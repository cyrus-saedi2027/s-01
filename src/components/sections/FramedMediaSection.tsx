import type { ReactNode } from "react";

/**
 * Treatment 1 - shared frame.
 *
 * The photo and the copy live inside ONE container instead of floating as two
 * independent objects. The photo is a stretched grid item, so its top and
 * bottom edges are the frame's edges minus a single inset value: the ragged
 * bottom and the dead space under a short text column cannot happen, because
 * neither element sets its own height.
 *
 * Calm and contained. Use it for content sections inside a page.
 */

interface FramedMediaSectionProps {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  children?: ReactNode;
}

export function FramedMediaSection({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  children,
}: FramedMediaSectionProps) {
  return (
    <div
      className="overflow-hidden border border-border bg-card shadow-[0_18px_50px_-32px_rgba(69,16,31,0.45)]"
      style={{ borderRadius: "var(--frame-radius)", padding: "var(--frame-inset)" }}
    >
      <div className="grid items-stretch gap-0 md:grid-cols-[1fr_minmax(0,46%)]">
        {/* Copy column. Its padding is the only spacing in play. */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:py-14 lg:px-14">
          <p className="text-xs font-medium tracking-[0.14em] text-primary">{eyebrow}</p>

          <h2 className="mt-4 text-pretty text-3xl font-bold leading-tight text-foreground sm:text-[2.5rem]">
            {title}
          </h2>

          {/* Capped measure: long Persian lines are the hardest thing to read */}
          <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-[2.1] text-muted-foreground">
            {body}
          </p>

          {children && <div className="mt-8">{children}</div>}
        </div>

        {/* Photo panel: stretched, so it ends exactly where the frame ends */}
        <div
          className="relative overflow-hidden bg-muted ring-1 ring-inset ring-foreground/10 max-md:order-first max-md:aspect-[4/3] md:min-h-[26rem]"
          style={{ borderRadius: "var(--panel-radius)" }}
        >
          <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
