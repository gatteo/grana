// Serve the built registry (public/r/*.json) over HTTP for local consumers:
//   pnpm registry:serve            → http://127.0.0.1:5190/r/{name}.json
// The shadcn CLI resolves namespaced registries by URL only (file:// is not implemented), so a
// consumer's components.json points here while both repos live on one machine:
//   "registries": { "@grana": "http://127.0.0.1:5190/r/{name}.json" }
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
