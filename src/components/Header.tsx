import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { HoverStaggerLabel } from "./ui/AnimatedText";
import { identity } from "@/data/site";

/**
 * Fixed bar: wordmark on the left, a letter-split CONTACT link and a menu
 * toggle on the right. It hides on downward scroll and returns on upward.
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
  const [solid, setSolid] = useState(false);
  const [hoverContact, setHoverContact] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    if (menuOpen) return setHidden(false);
    setHidden(y > prev && y > 260);
  });

  useEffect(() => {
    if (menuOpen) setHidden(false);
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: ready ? 0.15 : 0 }}
      className={cn(
        "fixed inset-x-0 top-0 z-[80] transition-colors duration-500",
        solid && !menuOpen && "bg-ink/70 backdrop-blur-xl"
      )}
    >
      <div className="shell flex items-center justify-between py-5 md:py-6">
        <a
          href="#top"
          className="group flex items-baseline gap-2 font-sans text-2xs font-semibold uppercase tracking-wider"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" />
          <span>{identity.name}</span>
          <span className="text-accent">—</span>
        </a>

        <div className="flex items-center gap-5 md:gap-8">
          <a
            href="#contact"
            onMouseEnter={() => setHoverContact(true)}
            onMouseLeave={() => setHoverContact(false)}
            className="hidden font-sans text-2xs font-semibold uppercase tracking-wider md:inline-flex"
          >
            <HoverStaggerLabel text="Contact" active={hoverContact} />
          </a>

          <button
            type="button"
            onClick={onMenu}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="group relative inline-flex items-center gap-3 rounded-md border border-hairStrong px-5 py-3 font-sans text-2xs font-semibold uppercase tracking-wider transition-colors duration-500 hover:border-accent"
          >
            <span className="flex flex-col gap-[5px]">
              <motion.span
                className="block h-px w-4 bg-paper"
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 3 : 0 }}
                transition={{ duration: 0.35 }}
              />
              <motion.span
                className="block h-px w-4 bg-paper"
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -3 : 0 }}
                transition={{ duration: 0.35 }}
              />
            </span>
            <span>{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
