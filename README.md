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
      MarqueeLabel.tsx     section eyebrow as a masked ticker
      ParallaxImage.tsx    image that drifts toward the pointer
      ScrollProgress.tsx   right-edge scroll indicator, auto-hiding
      Preloader.tsx        intro curtain with counter
    sections/              Hero, About, Works, CaseStudies, Solutions,
                           Process, Testimonials, Awards, CTA, Footer
scripts/
  generate-hero-art.mjs    draws the hero landscape
  generate-artwork.mjs     draws panel, cover and gallery art
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
| `comet` | Precise dot sitting at the centre of a filled circle, which draws out into a tail behind it as the pointer moves. |

The comet's outline is the convex hull of two circles — a head of radius `R`
centred on the origin, a tail of radius `r` trailing at `-d`. Anchoring the
head at the origin is the point: the origin is what gets pinned to the pointer,
so the dot always sits dead centre in the round head.

Only the tail lags. A single point is eased toward the pointer each frame, and
the gap between the two drives both the tail's length and how far it narrows.
Stop moving and the lagged point catches up, the gap closes, and the shape
relaxes back into a circle on its own — there is no separate settle animation.

Elements opt into pointer states with `data-cursor="hide" | "view" | "drag"`.
Both variants are disabled on coarse pointers.

## Swapping the hero image

`heroImage.src` in `src/data/site.ts` points at `/art/hero.svg`. Drop any
portrait-ish file into `public/art/` and change that one path — the card is 3:4
and uses `object-fit: cover`. A photographic pair (`hero.webp` / `hero.jpg`) is
bundled there too if you want to switch to it. To redraw the bundled artwork,
run `node scripts/generate-hero-art.mjs`.

The picture is zoomed a little past its frame (`HERO_SCALE`) and the pointer
nudges it around inside that overhang. Keep the shift well under the overhang
(`size * (SCALE - 1) / 2`) or the image pulls away from its own edges. Note the
scale is applied through Framer alongside `x`/`y`, not as a Tailwind class —
see the transform note below.

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
- **Menu performance** — the panel has a fixed height and animates
  `translateY`, so opening is a composited transform rather than a per-frame
  layout pass. Its surface is even frosted glass with a fine grain laid over
  it; the grain is a static repeating tile, painted once and never animated.
  An animated element carrying a large `blur()` has to re-rasterise every
  frame, which is what made an earlier version stutter.
- **Scroll indicator** — right edge, vertically centred, hidden until you
  scroll past a threshold and fading out about a second after you stop.
- **Case studies** — each cover enters sheared over and unwinds to square as it
  crosses the viewport, with the copy opposite rising off the same scroll
  range. The rows sit in an `overflow-x-clip` wrapper: rotating a wide element
  widens its footprint and would otherwise push the page sideways on narrow
  screens. `clip` rather than `hidden`, because `hidden` creates a scroll
  container and would break the sticky gallery below it.
- **Gallery wall** — deliberately taller than the window it is seen through, so
  even at rest it overflows its mask and the columns' parallax can never open a
  gap. The middle column runs against the outer two. Centring is done by the
  parent, not a transform, since Framer overwrites `transform` when animating
  scale.
- **The comet cursor never re-renders React.** One rAF loop reads the pointer's
  motion values and writes the path and rotation straight to the DOM. Driving
  them from state instead re-rendered ~120 times a second and stuttered, and
  springs fed from that state restarted every frame and jittered. Its heading
  is accumulated unwrapped, because `atan2` flips between +pi and -pi and
  following that jump spins the shape a full turn.
- **Smooth scroll** — drives `window.scrollTo` rather than transforming a
  wrapper, which keeps `position: sticky`, IntersectionObserver and anchor
  links working. Disabled on touch and under `prefers-reduced-motion`.
- All motion collapses under `prefers-reduced-motion: reduce`.

## Assets

Artwork in `public/art/` is generated procedurally as SVG — no bitmap
dependencies. Fonts are self-hosted and licensed under the SIL Open Font
License 1.1.
