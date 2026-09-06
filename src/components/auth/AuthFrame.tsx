import { useState, type ReactNode } from "react";

/**
 * The big rounded frame, with a media panel inset inside it.
 *
 * The gap between the panel and the frame is a single value (--frame-inset),
 * applied as padding on the frame. The panel is a stretched grid item, so it
 * fills its column edge to edge and the gap it leaves on the top, side and
 * bottom is that one value — identical on every edge, by construction.
 *
 * Its corner radius is --panel-radius (= --frame-radius - --frame-inset), which
 * keeps the inner curve parallel to the outer one, so the gap stays uniform
 * around the corners too.
 */

interface AuthFrameProps {
  image: string;
  imageAlt: string;
  headline: string[];
  caption: string;
  children: ReactNode;
}

export function AuthFrame({ image, imageAlt, headline, caption, children }: AuthFrameProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="w-full max-w-[1120px] bg-card shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)]"
      style={{
        borderRadius: "var(--frame-radius)",
        padding: "var(--frame-inset)",
      }}
    >
      <div className="grid lg:min-h-[660px] lg:grid-cols-2">
        {/* Media panel — stretches to the full height of the row */}
        <div
          className="relative isolate overflow-hidden bg-gradient-to-b from-[#2a2d2c] via-[#1b1e1d] to-[#3f4a2c] max-lg:h-[22rem] sm:max-lg:h-[26rem]"
          style={{ borderRadius: "var(--panel-radius)" }}
        >
          <img
            src={image}
            alt={imageAlt}
            loading="eager"
            onLoad={() => setImageLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Tonal wash: keeps the panel moody and the caption legible on any photo */}
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-8 text-center sm:p-10">
            <p className="text-sm font-light leading-relaxed text-white/95 sm:text-[0.95rem] lg:text-base">
              {headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-4 text-xs font-light text-white/65 sm:mt-5">{caption}</p>
          </div>
        </div>

        {/* Form column */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
          <div className="w-full max-w-[320px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
