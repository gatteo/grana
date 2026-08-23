// Merge every registry/groups/<group>/registry.json into the root registry.json.
// shadcn 4.19 resolves item file paths relative to the registry file that declares them and
// refuses "../", so group files cannot point at registry/grana/ui/* through `include`; the root
// file is therefore GENERATED from the groups (root group first) and committed.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, resolve } from "node:path";

const repo = fileURLToPath(new URL("..", import.meta.url));
const groupsDir = join(repo, "registry", "groups");
const groups = ["root", ...readdirSync(groupsDir).filter((g) => g !== "root").sort()];

const items = [];
const seen = new Set();
for (const g of groups) {
  const file = join(groupsDir, g, "registry.json");
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    console.error(`${g}: unreadable registry.json — ${e.message}`);
    process.exit(1);
  }
  for (const item of parsed.items ?? []) {
    if (seen.has(item.name)) {
      console.error(`${g}: duplicate item "${item.name}"`);
      process.exit(1);
    }
    seen.add(item.name);
    // Accept both forms a group may use — repo-relative ("registry/grana/ui/x.tsx") or relative
    // to the group file ("../../grana/ui/x.tsx") — and emit repo-relative paths for the root.
    const files = (item.files ?? []).map((f) => {
      const abs = f.path.startsWith("../") ? resolve(groupsDir, g, f.path) : resolve(repo, f.path);
      const path = relative(repo, abs);
      if (!existsSync(abs)) {
        console.error(`${g}: item "${item.name}" points at a missing file: ${path}`);
        process.exit(1);
      }
      return { ...f, path };
    });
    items.push({ ...item, files });
  }
}

const out = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "grana",
  homepage: "https://github.com/gatteo/grana",
  items,
};
writeFileSync(join(repo, "registry.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`registry.json ← ${items.length} items from ${groups.join(", ")}`);
