import { useEffect, useState } from "react";

import { Preloader } from "./components/ui/Preloader";
import { Cursor, type CursorVariant } from "./components/ui/Cursor";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { TopGlass } from "./components/ui/TopGlass";
import { StackedLayer } from "./components/ui/StackedLayer";
import { Header } from "./components/Header";
import { MenuOverlay } from "./components/MenuOverlay";

import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Works } from "./components/sections/Works";
import { CaseStudies } from "./components/sections/CaseStudies";
import { Solutions } from "./components/sections/Solutions";
import { Process } from "./components/sections/Process";
import { Testimonials } from "./components/sections/Testimonials";
import { Showcase } from "./components/sections/Showcase";
import { Awards } from "./components/sections/Awards";
import { CTA } from "./components/sections/CTA";
import { BookingDialog } from "./components/sections/Booking";
import { Footer } from "./components/sections/Footer";

import { useSmoothScroll } from "./hooks/useSmoothScroll";

/**
 * Pointer style. "ring" is a precise dot with a hollow outlined circle
 * trailing it; "comet" trails a solid shape that tapers along the direction of
 * travel. Both live in components/ui/Cursor.tsx.
 */
const CURSOR_VARIANT: CursorVariant = "ring";

export default function App() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Inertial wheel scrolling, enabled once the curtain has lifted. It stays on
  // while the menu is up: the panel is fixed, so the page reads normally as it
  // scrolls past behind it.
  useSmoothScroll(ready);

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
      <Cursor variant={CURSOR_VARIANT} />

      <ScrollProgress />

      {/* Hidden while the menu is open — the panel brings its own glass, and
          stacking the two would deepen the blur under the header alone. */}
      <TopGlass hidden={menuOpen} />

      <Header
        ready={ready}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen((v) => !v)}
      />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <BookingDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />

      <main>
        <Hero ready={ready} />
        <About />
        <Works />
        <CaseStudies />
        <Solutions />
        <Process />
        {/* The page stops being one column here: the testimonials play out,
            hold for a beat, and the archive wall comes over them as a sheet. */}
        <StackedLayer beneath={<Testimonials />}>
          <Showcase />
        </StackedLayer>

        <Awards />
        <CTA onBook={() => setBookingOpen(true)} />
      </main>

      <Footer />
    </div>
  );
}
