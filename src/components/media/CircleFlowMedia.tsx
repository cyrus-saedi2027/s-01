import type { ReactNode } from "react";

/**
 * 03 - Circle with flowing text. The only treatment where the copy itself
 * follows the curve: the photo is floated and given shape-outside, so each
 * line ends on the circle's edge instead of on a straight column. Needs a
 * paragraph long enough to wrap past the widest point of the circle.
 */
export function CircleFlowMedia({
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
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium tracking-[0.16em] text-primary">{eyebrow}</p>
      <h3 className="mt-4 max-w-[16ch] text-pretty text-3xl font-black leading-tight sm:text-[2.5rem]">
        {title}
      </h3>

      <div className="mt-8">
        <div
          className="float-left aspect-square w-[min(48%,17rem)] overflow-hidden rounded-full bg-muted"
          style={{ shapeOutside: "circle(50%)", shapeMargin: "1.5rem", marginLeft: "0.5rem" }}
        >
          <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
        </div>

        <p className="text-[0.9375rem] font-light leading-[2.2] text-muted-foreground">{body}</p>

        {children && <div className="mt-7">{children}</div>}
      </div>
    </div>
  );
}
