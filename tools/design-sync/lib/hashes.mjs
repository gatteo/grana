// The hash recipes behind `_ds_sync.json` — one source of truth so build, validate and the
// push-plan diff agree byte-for-byte.
//
//   sourceKey  — the GRADE contract per component: what the author expressed (the component
//                source, its story, an owned preview, the card config, the brand). A change
//                means "re-verify this card".
//   renderHash — the per-card ARTIFACT fingerprint (compiled preview + card html minus its
//                first-line marker). Sources stable + renderHash moved ⇒ pipeline churn.
//   styleSha   — the global styling surface (bundle body, css, fonts, vendor runtime).
//   auxSha     — guidelines/ + README.md.
//   sourceHashes — per components/<group>/<Name>/<Name>.{jsx,d.ts,prompt.md} sha12 (in the
//                bundle header too); bundleSha12 — the whole _ds_bundle.js.
// KEY_RECIPE is bumped whenever any input to these hashes changes; a recipe mismatch between
// the remote sidecar and a local build means "re-verify everything", never "unchanged".
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { TOOL, canonical } from './common.mjs';

export const KEY_RECIPE = 101; // grana-1 (the old converter's recipes are 1–7)

function hashFile(h, p, label) {
  h.update(label);
  try { h.update(readFileSync(p)); } catch { h.update('∅'); }
}
function hashDir(h, dir, prefix, skip) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { h.update('∅'); return; }
  for (const e of entries.sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (e.name.startsWith('.') || skip?.has(e.name)) continue;
    if (e.isDirectory()) hashDir(h, join(dir, e.name), `${prefix}${e.name}/`, skip);
    else hashFile(h, join(dir, e.name), `${prefix}${e.name}`);
  }
}

export function styleShaFor(out) {
  const h = createHash('sha256');
  h.update('bundlejs');
  try {
    const src = readFileSync(join(out, '_ds_bundle.js'), 'utf8');
    h.update(src.slice(src.indexOf('\n') + 1)); // body only — the header embeds per-file hashes
  } catch { h.update('∅'); }
  hashFile(h, join(out, '_ds_bundle.css'), 'bundlecss');
  hashFile(h, join(out, 'styles.css'), 'styles');
  hashDir(h, join(out, 'fonts'), 'fonts/');
  hashDir(h, join(out, '_vendor'), '_vendor/');
  return h.digest('hex');
}

/** Card html minus its first-line @dsCard marker (a pure regroup is not a contract change). */
export function renderHashFor(out, c) {
  const h = createHash('sha256');
  hashFile(h, join(out, '_preview', `${c.name}.js`), 'preview');
  h.update('html');
  try {
    const html = readFileSync(join(out, 'components', c.group, c.name, `${c.name}.html`), 'utf8');
    const nl = html.indexOf('\n');
    h.update(/viewport="[^"]*"/.exec(html.slice(0, nl))?.[0] ?? '');
    h.update(html.slice(nl + 1));
  } catch { h.update('∅'); }
  return h.digest('hex').slice(0, 16);
}

export function auxShaFor(out) {
  const h = createHash('sha256');
  hashDir(h, join(out, 'guidelines'), 'guidelines/');
  hashFile(h, join(out, 'README.md'), 'readme');
  return h.digest('hex').slice(0, 16);
}

/**
 * @param {{ sourceFile: string, storyFile: string|null, ownedPreview: string|null, card: object, brand: string }} o
 */
export function sourceKeyFor(name, { sourceFile, storyFile, ownedPreview, card, brand }) {
  const h = createHash('sha256');
  h.update(`recipe:${KEY_RECIPE}`);
  h.update(`name:${name}`);
  h.update(`brand:${brand}`);
  hashFile(h, sourceFile, 'source');
  if (storyFile) hashFile(h, storyFile, 'story'); else h.update('story:∅');
  if (ownedPreview) hashFile(h, ownedPreview, 'owned'); else h.update('owned:∅');
  h.update('card');
  h.update(canonical(card ?? null));
  return h.digest('hex').slice(0, 16);
}

/** Fingerprint of the tool itself — informational, recorded in the sidecar. */
export function scriptsShaFor() {
  const h = createHash('sha256');
  hashDir(h, join(TOOL, 'lib'), 'lib/');
  for (const f of ['build.mjs', 'validate.mjs', 'diff.mjs', 'config.json']) hashFile(h, join(TOOL, f), f);
  hashDir(h, join(TOOL, 'readme'), 'readme/');
  return h.digest('hex').slice(0, 16);
}
