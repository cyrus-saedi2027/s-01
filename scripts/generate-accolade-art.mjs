/**
 * Draws the tall ember plume that stands beside the awards ledger.
 *
 * It is sized 2:3 and composed only of gradients and solid paths — no SVG
 * filters. A filter is re-run every time the browser rasters a tile the image
 * touches, and this one is scaled through a scroll animation, so it would be
 * re-rastering constantly. The softness comes from gradient stops instead.
 *
 * Usage: node scripts/generate-accolade-art.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/art/accolade.svg");

const W = 900;
const H = 1350;

const RED = "#fd321c";
const EMBER = "#ff8a00";
const DEEP = "#7d1204";
const COOL = "#1b3550";

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const n = (v) => Number(v.toFixed(1));

const r = rng(90210);

/** Soft billows stacked into a column, lit from the upper left. */
function billows() {
  let s = "";
  for (let i = 0; i < 34; i++) {
    const t = i / 33;
    // Wander around the column's axis, widest around the middle. The radii stay
    // small: a few dozen soft circles read as a plume, a few large ones read as
    // a flat wash.
    const swell = Math.sin(t * Math.PI) ** 0.7;
    const cx = W * (0.5 + Math.sin(t * 6.1 + 0.6) * 0.08 * swell + (r() - 0.5) * 0.04);
    const cy = H * (0.14 + t * 0.66 + (r() - 0.5) * 0.02);
    const rad = W * (0.035 + swell * 0.1 + r() * 0.025);
    const lit = t < 0.5 ? "warm" : "cool";
    s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(rad)}" fill="url(#${lit})" opacity="${(0.16 + r() * 0.2).toFixed(2)}"/>`;
  }
  return s;
}

/** The bright crescent that rims the top of the plume. */
function crescent() {
  const cx = W * 0.5;
  const cy = H * 0.33;
  const rad = W * 0.29;
  return `
  <path d="M ${n(cx - rad)} ${n(cy)} A ${n(rad)} ${n(rad * 0.82)} 0 0 1 ${n(cx + rad)} ${n(cy)}"
        fill="none" stroke="url(#rim)" stroke-width="${n(W * 0.022)}" stroke-linecap="round" opacity="0.95"/>
  <path d="M ${n(cx - rad * 0.86)} ${n(cy + rad * 0.1)} A ${n(rad * 0.86)} ${n(rad * 0.7)} 0 0 1 ${n(cx + rad * 0.86)} ${n(cy + rad * 0.1)}"
        fill="none" stroke="url(#rim)" stroke-width="${n(W * 0.008)}" stroke-linecap="round" opacity="0.5"/>`;
}

/** Fine embers drifting off the plume. */
function sparks() {
  let s = "";
  for (let i = 0; i < 90; i++) {
    const t = r();
    const spread = 0.1 + Math.sin(t * Math.PI) * 0.22;
    const cx = W * (0.5 + (r() - 0.5) * 2 * spread);
    const cy = H * (0.18 + t * 0.66);
    const rad = 0.7 + r() * 2.1;
    s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${rad.toFixed(1)}" fill="${r() > 0.4 ? EMBER : RED}" opacity="${(0.12 + r() * 0.5).toFixed(2)}"/>`;
  }
  return s;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#120608"/>
      <stop offset="0.55" stop-color="#0c0407"/>
      <stop offset="1" stop-color="#07090f"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.34" r="0.62">
      <stop offset="0" stop-color="${EMBER}" stop-opacity="0.85"/>
      <stop offset="0.35" stop-color="${RED}" stop-opacity="0.5"/>
      <stop offset="0.72" stop-color="${DEEP}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${DEEP}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="warm" cx="0.36" cy="0.3" r="0.72">
      <stop offset="0" stop-color="${EMBER}" stop-opacity="0.9"/>
      <stop offset="0.4" stop-color="${RED}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${DEEP}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cool" cx="0.4" cy="0.34" r="0.75">
      <stop offset="0" stop-color="${COOL}" stop-opacity="0.75"/>
      <stop offset="0.45" stop-color="#2a1526" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#0a0710" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0.2">
      <stop offset="0" stop-color="${RED}" stop-opacity="0"/>
      <stop offset="0.22" stop-color="${EMBER}" stop-opacity="0.95"/>
      <stop offset="0.55" stop-color="#fff3d0" stop-opacity="1"/>
      <stop offset="0.82" stop-color="${EMBER}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${RED}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${DEEP}" stop-opacity="0"/>
      <stop offset="0.6" stop-color="${RED}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${EMBER}" stop-opacity="0.5"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.44" r="0.62">
      <stop offset="0" stop-color="#000" stop-opacity="0"/>
      <stop offset="0.55" stop-color="#000" stop-opacity="0.1"/>
      <stop offset="0.8" stop-color="#000" stop-opacity="0.52"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.86"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#ground)"/>
  <ellipse cx="${n(W * 0.5)}" cy="${n(H * 0.42)}" rx="${n(W * 0.36)}" ry="${n(H * 0.34)}" fill="url(#glow)"/>
${billows()}
${crescent()}
  <path d="M 0 ${n(H * 0.88)} Q ${n(W * 0.3)} ${n(H * 0.82)} ${n(W * 0.56)} ${n(H * 0.91)} T ${W} ${n(H * 0.87)} L ${W} ${H} L 0 ${H} Z" fill="url(#floor)" opacity="0.45"/>
${sparks()}
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`;

fs.writeFileSync(OUT, svg);
console.log(`wrote ${path.relative(ROOT, OUT)} (${(svg.length / 1024).toFixed(1)} kB)`);
