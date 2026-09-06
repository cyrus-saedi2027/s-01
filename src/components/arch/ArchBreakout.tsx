import type { ReactNode } from "react";

/**
 * 02 - Breakout. The rectangle is a filled block and the arch rises straight
 * out of its top edge, so the photo is half inside the frame and half on the
 * page. The crossing is the whole idea: it gives depth without a shadow.
 */
export function ArchBreakout({
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
    <div className="theme-dental-dark bg-background px-7 pb-12 pt-12 text-foreground sm:px-12 sm:pb-14">
      <div className="grid items-center gap-10 md:grid-cols-[1fr_minmax(0,34%)] md:gap-14">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
          <h3 className="mt-4 text-pretty text-3xl font-black leading-tight sm:text-[2.5rem]">
            {title}
          </h3>
          <p className="mt-5 max-w-[42ch] text-[0.9375rem] font-light leading-[2.1] text-muted-foreground">
            {body}
          </p>
          {children && <div className="mt-8">{children}</div>}
        </div>

        {/* Rises past the frame's top edge */}
        <div className="shape-arch relative aspect-[3/4] overflow-hidden bg-muted md:-translate-y-28">
          <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
