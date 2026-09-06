import type { ReactNode } from "react";

/**
 * 05 - Arcade. Two arches on one floor line, unequal in width so the pair has
 * a rhythm rather than a mirror. The copy spans the full width beneath them,
 * which is what keeps the rectangle reading as one object.
 */
export function ArchPair({
  eyebrow,
  title,
  body,
  images,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  images: { src: string; alt: string }[];
  children?: ReactNode;
}) {
  return (
    <div className="border border-border bg-card px-7 pb-10 pt-10 sm:px-12 sm:pb-12 sm:pt-12">
      <p className="text-xs font-medium tracking-[0.16em] text-primary">{eyebrow}</p>

      <div className="mt-8 grid grid-cols-[1.25fr_1fr] items-end gap-4 sm:gap-6">
        {images.map(({ src, alt }, i) => (
          <div
            key={src}
            className={`shape-arch-flat relative overflow-hidden bg-muted ${
              i === 0 ? "aspect-[4/5]" : "aspect-[3/5]"
            }`}
          >
            <img src={src} alt={alt} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      {/* The floor the two arches stand on */}
      <div aria-hidden className="h-px w-full bg-border" />

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h3 className="text-pretty text-3xl font-black leading-tight sm:text-[2.5rem]">{title}</h3>
          <p className="mt-4 max-w-[52ch] text-[0.9375rem] font-light leading-[2.1] text-muted-foreground">
            {body}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
