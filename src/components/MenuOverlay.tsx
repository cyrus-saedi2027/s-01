import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { identity, navLinks, socials } from "@/data/site";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Full-bleed navigation curtain. The panel wipes down, then the links rise in
 * sequence; each link splits into two stacked copies that swap on hover.
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
        <motion.div
          className="fixed inset-0 z-[75] flex flex-col justify-between bg-ink pb-10 pt-28"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <nav className="shell flex flex-1 flex-col justify-center">
            <ul>
              {navLinks.map((link, i) => (
                <li key={link} className="border-t border-hair last:border-b">
                  <a
                    href={`#${link.toLowerCase()}`}
                    onClick={onClose}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="group relative flex items-center justify-between overflow-hidden py-3 md:py-4"
                  >
                    {/* Accent field sweeping in from the left. */}
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 bg-accent"
                      initial={false}
                      animate={{ scaleX: hovered === i ? 1 : 0 }}
                      style={{ originX: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                    />
                    <span className="clip-line relative z-10">
                      <motion.span
                        className="block text-[clamp(2.5rem,9vw,7.5rem)] font-medium leading-[0.95] tracking-tighter transition-[padding] duration-500 ease-soft group-hover:pl-6"
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "110%" }}
                        transition={{
                          duration: 0.75,
                          delay: 0.28 + i * 0.06,
                          ease: EASE,
                        }}
                      >
                        {link}
                      </motion.span>
                    </span>
                    <motion.span
                      className="relative z-10 font-sans text-2xs uppercase tracking-wider text-dim group-hover:text-paper"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.4 + i * 0.06 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </motion.span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="font-sans text-2xs uppercase tracking-wider text-dim">
              <p className="mb-1 text-paper">Get in touch</p>
              <a href={`mailto:${identity.email}`} className="hover:text-accent">
                {identity.email}
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="font-sans text-2xs uppercase tracking-wider text-dim transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
