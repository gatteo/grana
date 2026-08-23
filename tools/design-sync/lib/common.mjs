// Shared helpers — pure functions, node builtins only.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The grana repo root (tools/design-sync/lib → ../../..). */
export const REPO = resolve(fileURLToPath(new URL('../../..', import.meta.url)));
/** The tool's own directory. */
export const TOOL = resolve(fileURLToPath(new URL('..', import.meta.url)));

export const slash = (p) => (sep === '/' ? p : p.split(sep).join('/'));
export const readText = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
export const sha = (buf, n) => {
  const h = createHash('sha256').update(buf).digest('hex');
  return n ? h.slice(0, n) : h;
};
export const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** `back-link` → `BackLink`. */
export const pascal = (kebab) =>
  String(kebab).split(/[^A-Za-z0-9]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');

/** Sorted directory listing (readdir order is filesystem-dependent). */
export const ls = (d, o) => readdirSync(d, o).sort((a, b) => (a.name ?? a).localeCompare(b.name ?? b));

/** Recursive walk; returns absolute paths of files accepted by `accept(name, rel)`. */
export function walk(dir, accept = () => true, out = [], rel = '') {
  if (!existsSync(dir)) return out;
  for (const e of ls(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules') continue;
    const p = join(dir, e.name);
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(p, accept, out, r);
    else if (accept(e.name, r)) out.push(p);
  }
  return out;
}

export const fileSize = (p) => { try { return statSync(p).size; } catch { return 0; } };

/** JSON with sorted keys — stable hashing of config slices. */
export function canonical(v) {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
  }
  return JSON.stringify(v) ?? 'null';
}

/** CLI flags: `--name value` → value; `--flag` → true. */
export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const k = a.slice(2);
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) { out[k] = next; i++; }
    else out[k] = true;
  }
  return out;
}

// esbuild lowers `import.meta` to {} under iife — define the two Vite idioms so
// a module touching them at init doesn't throw (see the old converter's notes).
export const IIFE_IMPORT_META_DEFINE = {
  'import.meta.url': '"https://ds-preview.invalid/"',
  'import.meta.env': '{"MODE":"development","DEV":true,"PROD":false,"SSR":false,"BASE_URL":"/"}',
};
