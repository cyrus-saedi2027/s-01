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
      ScrollProgress.tsx   right-edge scroll indicator, auto-hiding
      Preloader.tsx        intro curtain with counter
    sections/              Hero, About, Works, Solutions, Process,
                           Testimonials, Awards, CTA, Footer
scripts/
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
| `comet` | Precise dot with a solid shape trailing behind it. Standing still it is a circle; moving, it draws into a tapered capsule pointing along the direction of travel. |

The comet's outline is the convex hull of two circles — a head of radius `R`, a
tail of radius `r`, centres `d` apart — which is a rounded head easing into a
narrower tail. With `d = 0` and `R = r` it degenerates to a plain circle, so a
resting pointer needs no special case. Speed feeds `R`, `r` and `d` through a
smoothstep, so small movements barely deform it and fast ones taper off instead
of running away. The follower's spring stiffness is the "magnet strength":
lower means more trailing lag and a gentler settle.

Elements opt into pointer states with `data-cursor="hide" | "view" | "drag"`.
Both variants are disabled on coarse pointers.

## Swapping the hero image

`heroImage` in `src/data/site.ts` names a webp and a jpeg fallback in
`public/art/`. Drop your own files there and change those paths — the card is
3:4 and uses `object-fit: cover`. `heroBlur` beside it is a 24×32 data-URI
preview that fills the card until the real file decodes; regenerate it from any
new image if you swap one in.

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
- **Smooth scroll** — drives `window.scrollTo` rather than transforming a
  wrapper, which keeps `position: sticky`, IntersectionObserver and anchor
  links working. Disabled on touch and under `prefers-reduced-motion`.
- All motion collapses under `prefers-reduced-motion: reduce`.

## Assets

Artwork in `public/art/` is generated procedurally as SVG — no bitmap
dependencies. Fonts are self-hosted and licensed under the SIL Open Font
License 1.1.
