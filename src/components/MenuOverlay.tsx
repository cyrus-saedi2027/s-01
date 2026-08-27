import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { identity, navLinks, socials } from "@/data/site";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Navigation panel that drops from the top edge over roughly half the
 * viewport. The surface is frosted, lit from behind by a warm bloom, and each
 * link swaps its letters on hover.
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
          {/* Click-away region below the panel. */}
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="fixed inset-0 z-[70] cursor-default bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          <motion.nav
            id="site-menu"
            className="fixed inset-x-0 top-0 z-[72] overflow-hidden rounded-b-2xl border-b border-white/10 bg-[#0b0b0d]/85 backdrop-blur-2xl"
            initial={{ height: 0 }}
            animate={{ height: "min(58svh, 640px)" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.72, ease: EASE }}
          >
            {/* Warm bloom sitting behind the list. */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[74%] w-[58%] rounded-full blur-[90px]"
              style={{ translateX: "-50%", translateY: "-50%" }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.62, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <span className="block h-full w-full rounded-full bg-[radial-gradient(circle_at_50%_50%,#ff8a00_0%,#fd321c_38%,transparent_72%)]" />
            </motion.span>

            <div className="relative flex h-full flex-col items-center justify-center px-[var(--shell-x)] pb-20 pt-20">
              <ul className="flex flex-col items-center">
                {navLinks.map((link, i) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={onClose}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      className="block px-4 py-0.5"
                    >
                      <SwapLabel
                        text={link.label}
                        active={hovered === i}
                        delay={0.3 + i * 0.06}
                      />
                    </a>
                  </li>
                ))}
              </ul>

              {/* Contact rail along the bottom of the panel. */}
              <motion.div
                className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 px-[var(--shell-x)] pb-5 font-sans text-2xs uppercase tracking-wider text-dim"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <a href={`mailto:${identity.email}`} className="transition-colors hover:text-paper">
                  {identity.email}
                </a>
                <ul className="flex gap-x-5">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} className="transition-colors hover:text-accent">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
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
      className="relative block overflow-hidden text-[clamp(1.9rem,5.2vw,4rem)] font-semibold uppercase leading-[1.12] tracking-tight"
      initial={{ y: "110%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      exit={{ y: "110%", opacity: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <span className="flex">
        {chars.map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre will-change-transform"
            animate={{ y: active ? "-105%" : "0%" }}
            transition={{ duration: 0.42, ease: EASE, delay: i * 0.02 }}
          >
            {ch === " " ? " " : ch}
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
            transition={{ duration: 0.42, ease: EASE, delay: i * 0.02 }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}
