/**
 * Bundles the production build into a single self-contained HTML file.
 *
 * Fonts and artwork are inlined as data URIs, so the resulting page makes no
 * external requests at all — it can be opened straight from disk or dropped
 * anywhere that serves a single file.
 *
 * Usage: npm run build && node scripts/build-standalone.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(ROOT, "zaylamonroe-standalone.html");

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found — run "npm run build" first.');
  process.exit(1);
}

const assets = fs.readdirSync(path.join(DIST, "assets"));
const cssFile = assets.find((f) => f.endsWith(".css"));
const jsFile = assets.find((f) => f.endsWith(".js"));

if (!cssFile || !jsFile) {
  console.error("Could not find built CSS/JS in dist/assets.");
  process.exit(1);
}

let css = fs.readFileSync(path.join(DIST, "assets", cssFile), "utf8");
let js = fs.readFileSync(path.join(DIST, "assets", jsFile), "utf8");

const b64 = (p) => fs.readFileSync(p).toString("base64");

// Fonts referenced from the stylesheet.
let fontCount = 0;
css = css.replace(/url\(\/fonts\/([^)"']+\.woff2)\)/g, (_, name) => {
  fontCount++;
  return `url(data:font/woff2;base64,${b64(path.join(ROOT, "public/fonts", name))})`;
});

// Artwork referenced from either bundle.
let artCount = 0;
const artDir = path.join(ROOT, "public/art");
for (const file of fs.readdirSync(artDir)) {
  const uri = `data:image/svg+xml;base64,${b64(path.join(artDir, file))}`;
  const before = js + css;
  js = js.split(`/art/${file}`).join(uri);
  css = css.split(`/art/${file}`).join(uri);
  if (js + css !== before) artCount++;
}

// A module script must not contain a literal closing script tag.
js = js.replace(/<\/script>/gi, "<\\/script>");

fs.writeFileSync(
  OUT,
  `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Zayla Monroe — Creative Designer &amp; Developer</title>
<style>
${css}
</style>
</head>
<body>
<div id="root"></div>
<script type="module">
${js}
</script>
</body>
</html>
`
);

console.log(`inlined ${fontCount} fonts, ${artCount} artwork files`);
console.log(`wrote ${path.relative(ROOT, OUT)} (${(fs.statSync(OUT).size / 1024 / 1024).toFixed(2)} MB)`);
