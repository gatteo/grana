// Screenshot a playground story: node scripts/shot.mjs <story-id> [brand] [surface] [port] [out.png]
// Starts no server — run `pnpm dev` first (Vite prints its port; 5180 by default).
import { chromium } from "playwright";
const [id, brand = "luminars", surface = "app", port = "5180", out] = process.argv.slice(2);
if (!id) { console.error("usage: node scripts/shot.mjs <story-id> [brand] [surface] [port] [out.png]"); process.exit(2); }
const url = `http://localhost:${port}/?brand=${brand}&surface=${surface}#${id}`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(300);
const file = out ?? `shots/${id}-${brand}-${surface}.png`;
await page.screenshot({ path: file, fullPage: true });
await browser.close();
console.log(JSON.stringify({ url, file, errors }, null, 2));
process.exit(errors.length ? 1 : 0);
