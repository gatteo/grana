// Serve the built registry (public/r/*.json) over HTTP, for iterating on Grana itself:
//   pnpm registry:build && pnpm registry:serve      → http://127.0.0.1:5190/r/{name}.json
//
// Consumers do NOT point here any more — their `@grana` namespace resolves to the hosted registry
// (the private gatteo/grana repo through the GitHub contents API; see README → Consuming Grana), so
// a re-pull needs neither this server nor a grana checkout. Use this when you are changing a
// component and do not want to push between every try, by installing from the direct URL, which
// bypasses the namespace:
//   npx shadcn@latest add http://127.0.0.1:5190/r/button.json --overwrite
// The shadcn CLI resolves registries by URL only — file:// is not implemented, which is why this
// server exists at all.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, normalize } from "node:path";

const root = fileURLToPath(new URL("../public", import.meta.url));
const port = Number(process.env.PORT ?? 5190);

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent((req.url ?? "/").split("?")[0]));
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, {
      "content-type": path.endsWith(".json") ? "application/json" : "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`grana registry → http://127.0.0.1:${port}/r/{name}.json  (from ${root})`);
});
