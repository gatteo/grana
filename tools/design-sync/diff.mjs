#!/usr/bin/env node
// The push plan: what the lead writes to and deletes from a Claude Design project to make it
// match a fresh bundle. Two sources of "what the project holds today", unioned:
//   --old <dir>          the last bundle that was pushed (the local mirror of the project);
//                        defaults to config.profiles.<p>.oldBundle
//   --remote-sync <file> the project's CURRENT `_ds_sync.json` (DesignSync get_file) — its
//                        sourceHashes paths (+ the derived card html / preview js) are exact
// Writes ds-bundle/<profile>/.push-plan.json and .push-plan.md.
//
//   node tools/design-sync/diff.mjs --profile luminars [--old <dir>] [--remote-sync <file>] [--out ds-bundle]
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { REPO, TOOL, parseArgs, sha, slash, walk } from './lib/common.mjs';

const args = parseArgs(process.argv.slice(2));
const cfg = JSON.parse(readFileSync(join(TOOL, 'config.json'), 'utf8'));
const profile = args.profile;
if (!profile || !cfg.profiles[profile]) { console.error(`usage: diff.mjs --profile <${Object.keys(cfg.profiles).join('|')}> [--old <dir>] [--remote-sync <file>]`); process.exit(2); }
const pc = cfg.profiles[profile];
const OUT = join(args.out ? resolve(args.out) : join(REPO, 'ds-bundle'), profile);
if (!existsSync(join(OUT, '_ds_sync.json'))) { console.error(`✗ ${OUT} has no _ds_sync.json — run build.mjs first`); process.exit(1); }
const oldDir = args.old ? resolve(args.old) : pc.oldBundle;

// Files that are part of a bundle: no dot-files, no dot-dirs, no screenshots.
const bundleFiles = (dir) => walk(dir, (n, r) => !n.startsWith('.') && !r.split('/').some((s) => s.startsWith('.')) && !r.startsWith('_screenshots/'))
  .map((p) => slash(relative(dir, p)));

const local = new Map(bundleFiles(OUT).map((r) => [r, sha(readFileSync(join(OUT, r)), 12)]));
const old = new Map();
let oldSource = 'none';
if (oldDir && existsSync(oldDir)) {
  for (const r of bundleFiles(oldDir)) old.set(r, sha(readFileSync(join(oldDir, r)), 12));
  oldSource = oldDir;
} else if (oldDir) console.error(`! --old ${oldDir} does not exist — deletes are derived from the remote sidecar only`);
let remoteNote = 'not provided — fetch the project\'s _ds_sync.json (DesignSync get_file) and pass --remote-sync to make the delete list exact';
if (args['remote-sync']) {
  try {
    const remote = JSON.parse(readFileSync(resolve(args['remote-sync']), 'utf8'));
    let n = 0;
    for (const p of Object.keys(remote.sourceHashes ?? {})) {
      if (!old.has(p)) { old.set(p, remote.sourceHashes[p]); n++; }
      const seg = p.split('/');
      if (seg[0] === 'components' && seg.length >= 4) {
        const name = seg[2];
        for (const d of [`components/${seg[1]}/${name}/${name}.html`, `_preview/${name}.js`]) if (!old.has(d)) { old.set(d, '?'); n++; }
      }
    }
    for (const f of ['_ds_bundle.js', '_ds_bundle.css', 'styles.css', 'README.md', '_ds_sync.json']) if (!old.has(f)) old.set(f, '?');
    remoteNote = `${resolve(args['remote-sync'])} (${n} path(s) added from its sourceHashes; recipe ${remote.keyRecipe ?? '?'}, ${Object.keys(remote.renderHashes ?? {}).length} components)`;
  } catch (e) { console.error(`! --remote-sync unreadable: ${e.message}`); }
}

const writes = [...local.keys()].sort().map((p) => ({ path: p, bytes: readFileSync(join(OUT, p)).length, status: !old.has(p) ? 'added' : old.get(p) === local.get(p) ? 'same' : 'changed' }));
const deletes = [...old.keys()].filter((p) => !local.has(p)).sort();
// Ordering the lead follows: the fence first, the sidecar last (the app's self-check reads it).
const ordered = ['_ds_needs_recompile', ...writes.map((w) => w.path).filter((p) => p !== '_ds_needs_recompile' && p !== '_ds_sync.json'), '_ds_sync.json'].filter((p) => local.has(p));
const plan = {
  profile, projectId: pc.projectId, projectName: pc.projectName, brand: pc.brand,
  generatedAt: new Date().toISOString(), bundle: OUT, oldBundle: oldSource, remoteSync: remoteNote,
  counts: { writes: writes.length, added: writes.filter((w) => w.status === 'added').length, changed: writes.filter((w) => w.status === 'changed').length, same: writes.filter((w) => w.status === 'same').length, deletes: deletes.length, bytes: writes.reduce((n, w) => n + w.bytes, 0) },
  writeOrder: ordered, writes, deletes,
};
writeFileSync(join(OUT, '.push-plan.json'), JSON.stringify(plan, null, 2) + '\n');

const byDir = (paths) => { const m = new Map(); for (const p of paths) { const d = p.includes('/') ? p.split('/').slice(0, 2).join('/') : '(root)'; (m.get(d) ?? m.set(d, []).get(d)).push(p); } return m; };
const md = `# Push plan — ${pc.projectName} (${pc.projectId})

Bundle: \`${slash(relative(REPO, OUT))}\` · built ${plan.generatedAt} · brand \`${pc.brand}\`
Old bundle (what the project holds today): \`${oldSource}\`
Remote sidecar: ${remoteNote}

**${plan.counts.writes} files to write** (${plan.counts.added} new, ${plan.counts.changed} changed, ${plan.counts.same} identical — write them all; full writes are idempotent) · **${plan.counts.deletes} paths to delete** · ${(plan.counts.bytes / 1024 / 1024).toFixed(1)} MB.

## Procedure

1. \`write_files\` \`_ds_needs_recompile\` first (the fence: the app's self-check waits for the sidecar).
2. \`write_files\` everything under \`writes\` in \`.push-plan.json\` EXCEPT \`_ds_sync.json\` — in batches by folder (\`_vendor/\`, \`fonts/\`, \`_preview/\`, \`components/<group>/…\`, \`guidelines/\`, then the root files).
3. \`delete_files\` every path under \`deletes\` (the old groups' cards, the old previews, the old guidelines). A card left behind shows twice in the pane.
4. \`write_files\` \`_ds_sync.json\` LAST.
5. \`list_files\` and compare against \`writes\` — nothing extra, nothing missing.

## Deletes (${deletes.length})

${[...byDir(deletes).entries()].map(([d, ps]) => `- \`${d}\` — ${ps.length} file(s)${ps.length <= 6 ? `: ${ps.map((p) => `\`${p.split('/').slice(2).join('/') || p}\``).join(', ')}` : ''}`).join('\n') || '- none'}

## Writes by folder (${writes.length})

${[...byDir(writes.map((w) => w.path)).entries()].map(([d, ps]) => `- \`${d}\` — ${ps.length} file(s)`).join('\n')}
`;
writeFileSync(join(OUT, '.push-plan.md'), md);
console.error(`» ${profile}: ${plan.counts.writes} writes (${plan.counts.added} new, ${plan.counts.changed} changed, ${plan.counts.same} same), ${plan.counts.deletes} deletes → ${slash(relative(REPO, OUT))}/.push-plan.{json,md}`);
