import { useState } from "react";
import { Marquee } from "../ui/Marquee";
import { Reveal } from "../ui/Reveal";
import { HoverStaggerLabel } from "../ui/AnimatedText";
import { identity, navLinks, socials } from "@/data/site";

export function Footer() {
  const [hover, setHover] = useState<string | null>(null);
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-hair pt-16 md:pt-20">
      <div className="shell">
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Identity */}
          <Reveal className="lg:col-span-2">
            <h3 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-none tracking-tighter">
              {identity.name}
            </h3>
            <p className="mt-3 font-sans text-2xs uppercase tracking-wider text-accent">
              {identity.role}
            </p>
            <address className="mt-8 max-w-xs font-sans text-sm not-italic leading-relaxed text-dim">
              {identity.address}
            </address>
            <a
              href={`mailto:${identity.email}`}
              onMouseEnter={() => setHover("email")}
              onMouseLeave={() => setHover(null)}
              className="mt-6 inline-flex items-center gap-3 font-sans text-2xs font-semibold uppercase tracking-wider"
            >
              <HoverStaggerLabel text="Email me" active={hover === "email"} />
              <span className="h-px w-8 bg-accent" />
            </a>
          </Reveal>

          {/* Sitemap */}
          <Reveal delay={0.08}>
            <p className="mb-6 font-sans text-2xs uppercase tracking-wider text-dim">Sitemap</p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    onMouseEnter={() => setHover(l)}
                    onMouseLeave={() => setHover(null)}
                    className="inline-flex font-sans text-sm font-medium uppercase tracking-wide transition-colors duration-300 hover:text-accent"
                  >
                    <HoverStaggerLabel text={l} active={hover === l} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Socials */}
          <Reveal delay={0.16}>
            <p className="mb-6 font-sans text-2xs uppercase tracking-wider text-dim">Elsewhere</p>
            <ul className="flex flex-col gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    onMouseEnter={() => setHover(s.label)}
                    onMouseLeave={() => setHover(null)}
                    className="inline-flex font-sans text-sm font-medium uppercase tracking-wide transition-colors duration-300 hover:text-accent"
                  >
                    <HoverStaggerLabel text={s.label} active={hover === s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="flex flex-col gap-4 border-t border-hair py-7 font-sans text-2xs uppercase tracking-wider text-dim sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {identity.name}. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Designed &amp; built in Amsterdam
          </span>
          <a href="#top" className="transition-colors hover:text-paper">
            Back to top ↑
          </a>
        </div>
      </div>

      {/* Oversized closing wordmark */}
      <div className="border-t border-hair py-8 md:py-12">
        <Marquee duration={40}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="flex select-none items-center gap-8 whitespace-nowrap px-8 text-[clamp(3rem,11vw,12.5rem)] font-medium leading-none tracking-tighter text-paper/[0.09]"
            >
              {identity.name}
              <span className="text-accent/30">—</span>
            </span>
          ))}
        </Marquee>
      </div>
    </footer>
  );
}
