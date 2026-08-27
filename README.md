# Zayla Monroe — Creative Portfolio

A dark editorial portfolio site built with Vite, React, TypeScript, Tailwind CSS
and Framer Motion. Single page, heavy on scroll-driven motion.

## Running it

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # production bundle into dist/
npm run preview  # serve the built bundle
```

## What's in here

```
src/
  App.tsx                  page composition, scroll progress, anchor handling
  data/site.ts             all copy and content in one place
  hooks/
    useSmoothScroll.ts     lerp-based inertial wheel scrolling
    useMediaQuery.ts       pointer / breakpoint / reduced-motion queries
  components/
    Header.tsx             fixed bar: wordmark, menu control, contact
    MenuTrigger.tsx        the slim bar that opens the menu
    MenuOverlay.tsx        drop-down navigation panel
    ui/
      AnimatedText.tsx     character-rise headlines, hover letter-stagger
      Reveal.tsx           scroll reveals and line masks
      Marquee.tsx          seamless CSS ticker
      MagneticButton.tsx   pointer-following buttons, rotating circle button
      Cursor.tsx           custom pointer — two variants, see below
      Preloader.tsx        intro curtain with counter
    sections/              Hero, About, Works, Solutions, Process,
                           Testimonials, Awards, CTA, Footer
scripts/
  generate-hero-art.mjs    draws the hero landscape
  build-standalone.mjs     inlines everything into one HTML file
public/
  art/                     procedurally generated SVG artwork
  fonts/                   self-hosted Poppins + Inter (SIL OFL 1.1)
```

## Cursor variants

Two pointers ship in `src/components/ui/Cursor.tsx`. Switch with the
`CURSOR_VARIANT` constant at the top of `src/App.tsx`:

| Variant | Behaviour |
|---|---|
| `ring` | Precise dot with a hollow outlined circle trailing behind it, swelling into a labelled disc over flagged elements. |
| `comet` | Precise dot with a solid disc trailing behind it, stretched along the direction of travel and thinned as it speeds up, relaxing back to a circle at rest. |

Elements opt into pointer states with `data-cursor="hide" | "view" | "drag"`.
Both variants are disabled on coarse pointers.

## Swapping the hero image

`heroImage` in `src/data/site.ts` points at `/art/hero.svg`. Drop any
portrait-ish image into `public/art/` and change that one path — the card is
3:4 and uses `object-fit: cover`. To regenerate the bundled artwork instead,
run `node scripts/generate-hero-art.mjs`.

## Design system

Tokens live in `tailwind.config.ts`.

| | |
|---|---|
| Ground | `#000000` |
| Type | `#ffffff`, dimmed via `dim` / `dimmer` |
| Accent | `#fd321c`, secondary `#ff8a00` |
| Hairlines | `rgba(255,255,255,.14)` |
| Display face | Poppins |
| Text face | Inter |
| Type scale | 12 → 250px |

## Motion notes

- **Reveals** — blocks fade up 20px once on entry. `MaskLine` puts its
  IntersectionObserver on the *outer* unclipped span, because the inner span
  starts translated out of its own `overflow:hidden` mask and would otherwise
  never register as visible.
- **Headlines** — `AnimatedHeadline` splits into characters but keeps words
  whole so lines still wrap; the observer sits on the unclipped container.
- **Process** — four cards pin in sequence over a `400vh` track. Cards stay
  opaque and darken under a scrim rather than fading, so the stack cannot
  bleed through itself.
- **Menu** — the trigger is a slim bar at the top centre that lengthens on
  hover; opening drops a frosted panel over the upper half of the viewport.
  Each link holds two stacked copies of its label so hovering swaps white for
  accent, one letter at a time.
- **Framer transforms vs. Tailwind** — animating `scale` or `x` writes the
  whole `transform` property, silently discarding classes like
  `-translate-x-1/2`. Anything Framer animates does its centring through
  motion values instead.
- **Smooth scroll** — drives `window.scrollTo` rather than transforming a
  wrapper, which keeps `position: sticky`, IntersectionObserver and anchor
  links working. Disabled on touch and under `prefers-reduced-motion`.
- All motion collapses under `prefers-reduced-motion: reduce`.

## Assets

Artwork in `public/art/` is generated procedurally as SVG — no bitmap
dependencies. Fonts are self-hosted and licensed under the SIL Open Font
License 1.1.
