// Screenshot a playground story: node scripts/shot.mjs <story-id> [brand] [surface] [port] [out.png]
// Starts no server — run `pnpm dev` first (Vite prints its port; 5180 by default).
//
// The playground shell is `h-dvh … overflow-hidden` and the story pane scrolls INSIDE it, so
// Playwright's `fullPage` equals the viewport: everything below the first fold is silently missing
// from the image. Builders were verifying section 1 and believing they had verified the story. So
// this measures the scrolling pane, grows the viewport to fit it, and captures that element — the
// whole story, every section, one image.
import { chromium } from "playwright";

const [id, brand = "luminars", surface = "app", port = "5180", out] = process.argv.slice(2);
if (!id) {
  console.error("usage: node scripts/shot.mjs <story-id> [brand] [surface] [port] [out.png]");
  process.exit(2);
}
const url = `http://localhost:${port}/?brand=${brand}&surface=${surface}#${id}`;
const MAX_HEIGHT = 16000; // past this the capture costs more than it proves

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(300);

// The story pane is whichever element actually scrolls; fall back to the document.
const pane = await page.evaluateHandle(() => {
  const candidates = [...document.querySelectorAll("main, main *")];
  const scroller = candidates.find((el) => el.scrollHeight > el.clientHeight + 8);
  return scroller ?? document.querySelector("main") ?? document.body;
});
const height = await pane.evaluate((el) => Math.max(el.scrollHeight, el.clientHeight));
const capped = Math.min(height + 40, MAX_HEIGHT);
await page.setViewportSize({ width: 1280, height: capped });
await page.waitForTimeout(250);

const file = out ?? `shots/${id}-${brand}-${surface}.png`;
const target = await page.$("main");
await (target ?? page).screenshot({ path: file });
await browser.close();
console.log(JSON.stringify({ url, file, storyHeight: height, captured: capped, truncated: height + 40 > MAX_HEIGHT, errors }, null, 2));
process.exit(errors.length ? 1 : 0);
