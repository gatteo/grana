// Is public/r what the sources would build right now?
//
//   pnpm registry:check
//
// The published registry is a set of JSON files that INLINE the component sources, and consumers
// install from what sits on `main`. So a component edited and pushed without a rebuild ships the
// old code silently — nothing errors, the consumer just gets yesterday's file. This rebuilds into
// a temp dir and compares, so that can never leave the machine unnoticed.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const repo = fileURLToPath(new URL("..", import.meta.url));
const live = join(repo, "public", "r");
const out = mkdtempSync(join(tmpdir(), "grana-registry-"));

try {
  execFileSync("node", [join(repo, "scripts", "merge-registry.mjs")], { cwd: repo, stdio: "pipe" });
  execFileSync(join(repo, "node_modules", ".bin", "shadcn"), ["build", "--output", out], {
    cwd: repo,
    stdio: "pipe",
  });

  const read = (dir) =>
    Object.fromEntries(
      readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => [f, readFileSync(join(dir, f), "utf8")])
    );
  const fresh = read(out);
  const published = read(live);

  const stale = Object.keys(fresh).filter((f) => published[f] !== fresh[f]);
  const orphaned = Object.keys(published).filter((f) => !(f in fresh));

  if (stale.length || orphaned.length) {
    for (const f of stale) console.error(`  stale     public/r/${f}`);
    for (const f of orphaned) console.error(`  orphaned  public/r/${f}`);
    console.error(
      `\n✗ public/r is ${stale.length} file(s) behind the sources` +
        `${orphaned.length ? ` and holds ${orphaned.length} orphan(s)` : ""}.` +
        `\n  Run \`pnpm registry:build\` and commit the result — consumers install what is on main.`
    );
    process.exit(1);
  }
  console.log(`✓ public/r matches the sources (${Object.keys(fresh).length} items)`);
} finally {
  rmSync(out, { recursive: true, force: true });
}
