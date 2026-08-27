/**
 * Blur radius of the site's frosted glass, in pixels.
 *
 * Two surfaces share it: the menu panel, and the graduated band at the top of
 * the page (whose strongest point has to read as the same glass). Keeping one
 * number means they cannot drift apart.
 */
export const GLASS_BLUR = 31;

/** Saturation lift applied alongside the blur, so the glass keeps some colour. */
export const GLASS_SATURATE = 1.4;

/**
 * Fine grain laid over the glass as a static tile.
 *
 * The turbulence is coarse and then hard-shouldered by the transfer functions,
 * which is what separates the specks: without the shoulder every pixel carries
 * some value and the grain reads as an even fizz rather than as flecks.
 */
export const GLASS_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.38' numOctaves='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3.4' intercept='-1.5'/%3E%3CfeFuncG type='linear' slope='3.4' intercept='-1.5'/%3E%3CfeFuncB type='linear' slope='3.4' intercept='-1.5'/%3E%3CfeFuncA type='discrete' tableValues='1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E\")";
