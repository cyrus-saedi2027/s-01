import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/data/site";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Navigation panel that drops from the top edge over roughly half the
 * viewport.
 *
 * Two things keep it smooth. The panel has a fixed height and animates
 * `translateY`, so opening is a composited transform rather than a per-frame
 * layout pass. And the warm tint is a static radial gradient — an animated
 * element with a large `blur()` has to re-rasterise every frame, which is what
 * made the earlier version stutter.
 */
export function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.dataset.locked = open ? "true" : "false";
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="fixed inset-0 z-[70] cursor-default bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          <motion.nav
            id="site-menu"
            className="fixed inset-x-0 top-0 z-[72] h-[min(56svh,560px)] overflow-hidden rounded-b-2xl border-b border-white/10 bg-[#08080a]/72 backdrop-blur-2xl"
            style={{ willChange: "transform" }}
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.68, ease: EASE }}
          >
            {/* Warm tint — a plain gradient, no filters. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_62%_at_50%_56%,rgba(253,50,28,0.30)_0%,rgba(255,138,0,0.11)_42%,transparent_74%)]"
            />

            <div className="relative flex h-full items-center justify-center px-[var(--shell-x)] pt-14">
              <ul className="flex flex-col items-center">
                {navLinks.map((link, i) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={onClose}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      className="block px-4 py-[0.15em]"
                    >
                      <SwapLabel
                        text={link.label}
                        active={hovered === i}
                        delay={0.26 + i * 0.055}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * One nav label. The resting copy rises out of the mask while a tinted copy
 * rises in behind it, each letter a beat after the last.
 */
function SwapLabel({
  text,
  active,
  delay,
}: {
  text: string;
  active: boolean;
  delay: number;
}) {
  const chars = [...text];

  return (
    <motion.span
      className="relative block overflow-hidden text-[clamp(1.05rem,2.6vw,2.1rem)] font-semibold uppercase leading-[1.2] tracking-tight"
      initial={{ y: "110%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      exit={{ y: "110%", opacity: 0 }}
      transition={{ duration: 0.62, delay, ease: EASE }}
    >
      <span className="flex">
        {chars.map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre will-change-transform"
            animate={{ y: active ? "-105%" : "0%" }}
            transition={{ duration: 0.4, ease: EASE, delay: i * 0.018 }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </span>
      <span className="absolute inset-0 flex text-accent" aria-hidden="true">
        {chars.map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre will-change-transform"
            initial={{ y: "105%" }}
            animate={{ y: active ? "0%" : "105%" }}
            transition={{ duration: 0.4, ease: EASE, delay: i * 0.018 }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}
