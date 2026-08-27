import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { HoverStaggerLabel } from "./ui/AnimatedText";
import { MenuTrigger } from "./MenuTrigger";

/**
 * Fixed bar: wordmark left, the menu control centred, contact right.
 * It hides on downward scroll and returns on upward, but stays put whenever
 * the menu panel is open — the trigger lives here and has to remain reachable.
 */
export function Header({
  onMenu,
  menuOpen,
  ready,
}: {
  onMenu: () => void;
  menuOpen: boolean;
  ready: boolean;
}) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [hoverContact, setHoverContact] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (menuOpen) return setHidden(false);
    setHidden(y > prev && y > 260);
  });

  useEffect(() => {
    if (menuOpen) setHidden(false);
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -110 : 0, opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: ready ? 0.15 : 0 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[80]"
    >
      <div className="relative flex items-start justify-between px-[var(--shell-x)] py-5 md:py-6">
        <a
          href="#home"
          className={cn(
            "pointer-events-auto font-sans text-xs font-bold uppercase tracking-wide md:text-base",
            "transition-colors duration-300 hover:text-accent"
          )}
        >
          Zayla
        </a>

        {/* Centred independently of the flanking items so it never drifts. */}
        <div className="pointer-events-auto absolute left-1/2 top-5 -translate-x-1/2 md:top-6">
          <MenuTrigger open={menuOpen} onToggle={onMenu} />
        </div>

        <a
          href="#contact"
          onMouseEnter={() => setHoverContact(true)}
          onMouseLeave={() => setHoverContact(false)}
          className="pointer-events-auto inline-flex font-sans text-xs font-bold uppercase tracking-wide md:text-base"
        >
          <HoverStaggerLabel text="Contact" active={hoverContact} />
        </a>
      </div>
    </motion.header>
  );
}
