import type { ReactNode } from "react";

/**
 * 02 - Organic. No straight edges at all: the photo is masked with an
 * eight-value radius so every corner bends differently, and a soft colour form
 * sits behind it on a different curve. The mask drifts slowly between two
 * shapes, which reads as breathing rather than animation.
 */
export function OrganicMedia({
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
    <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
      <div className="relative mx-auto w-full max-w-[26rem]">
        <div
          aria-hidden
          className="shape-organic-alt absolute -inset-7 bg-primary/20"
        />
        <div className="shape-organic shape-organic-drift relative aspect-square overflow-hidden bg-muted">
          <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
        </div>
      </div>

      <div>
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
