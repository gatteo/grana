// The component list comes from the registry groups — `registry/groups/<group>/registry.json`.
// Every `registry:ui` item is one card; its group is the folder it sits in. Nothing is
// enumerated by hand: add an item to a group file and it is in the next bundle.
import { existsSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { REPO, ls, pascal, slash } from './common.mjs';

const GROUPS_DIR = join(REPO, 'registry', 'groups');

/** Display order of the groups in the README / review page. Unknown groups sort after. */
export const GROUP_ORDER = ['controls', 'fields', 'status', 'surfaces', 'patterns', 'extras'];

/**
 * @returns {{ name: string, title: string, description: string, group: string, file: string,
 *             relFile: string, dependencies: string[], registryDependencies: string[] }[]}
 * `file` is absolute; `relFile` repo-relative (forward slashes). `root` items (utils/theme)
 * and hooks are not cards and are skipped.
 */
export function readRegistryItems() {
  const items = [];
  const seen = new Set();
  for (const g of ls(GROUPS_DIR)) {
    if (g === 'root') continue;
    const file = join(GROUPS_DIR, g, 'registry.json');
    if (!existsSync(file)) continue;
    let parsed;
    try { parsed = JSON.parse(readFileSync(file, 'utf8')); }
    catch (e) { throw new Error(`${slash(relative(REPO, file))}: unreadable — ${e.message}`); }
    for (const item of parsed.items ?? []) {
      if (item.type !== 'registry:ui') continue;
      if (seen.has(item.name)) throw new Error(`duplicate registry item "${item.name}" (group ${g})`);
      seen.add(item.name);
      const f = (item.files ?? [])[0];
      if (!f) throw new Error(`registry item "${item.name}" has no files`);
      // Group files use either repo-relative paths or ../../grana/ui/x.tsx (see merge-registry.mjs).
      const abs = f.path.startsWith('../') ? resolve(GROUPS_DIR, g, f.path) : resolve(REPO, f.path);
      if (!existsSync(abs)) throw new Error(`registry item "${item.name}" points at a missing file: ${f.path}`);
      items.push({
        name: item.name,
        title: item.title ?? pascal(item.name),
        description: item.description ?? '',
        group: g,
        file: abs,
        relFile: slash(relative(REPO, abs)),
        dependencies: item.dependencies ?? [],
        registryDependencies: item.registryDependencies ?? [],
      });
    }
  }
  const rank = (g) => { const i = GROUP_ORDER.indexOf(g); return i < 0 ? GROUP_ORDER.length : i; };
  items.sort((a, b) => rank(a.group) - rank(b.group) || a.name.localeCompare(b.name));
  return items;
}
