import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

import { Preloader } from "./components/ui/Preloader";
import { Cursor } from "./components/ui/Cursor";
import { Header } from "./components/Header";
import { MenuOverlay } from "./components/MenuOverlay";

import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Works } from "./components/sections/Works";
import { Solutions } from "./components/sections/Solutions";
import { Process } from "./components/sections/Process";
import { Testimonials } from "./components/sections/Testimonials";
import { Awards } from "./components/sections/Awards";
import { CTA } from "./components/sections/CTA";
import { Footer } from "./components/sections/Footer";

import { useSmoothScroll } from "./hooks/useSmoothScroll";

export default function App() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Inertial wheel scrolling, enabled once the curtain has lifted.
  useSmoothScroll(ready && !menuOpen);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  // Anchor links have to bypass the smooth-scroll target, so handle them here.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      if (!id) return;
      const target = id === "top" ? document.body : document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: id === "top" ? 0 : target.getBoundingClientRect().top + window.scrollY - 70,
        behavior: "smooth",
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div id="top" className="grain relative min-h-screen bg-ink text-paper">
      <Preloader onDone={() => setReady(true)} />
      <Cursor />

      {/* Scroll progress hairline */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[85] h-[2px] origin-left bg-accent"
        aria-hidden="true"
      />

      <Header
        ready={ready}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen((v) => !v)}
      />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Hero ready={ready} />
        <About />
        <Works />
        <Solutions />
        <Process />
        <Testimonials />
        <Awards />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
