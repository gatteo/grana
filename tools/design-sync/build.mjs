#!/usr/bin/env node
// Build the claude.ai/design bundles from the Grana registry — one per profile (luminars, rf).
//
//   node tools/design-sync/build.mjs [--profile luminars|rf|all] [--out ds-bundle]
//
// Source of truth: registry/groups/*/registry.json (the cards and their groups),
// registry/grana/ui/*.tsx (the code and the types), playground/stories/*.stories.tsx (the
// previews and the examples), registry/grana/styles/grana.css (the stylesheet), public/fonts.
// Output: ds-bundle/<profile>/ — see README.md for the layout and the push procedure.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { REPO, TOOL, parseArgs, pascal, sha, slash, walk } from './lib/common.mjs';
import { readRegistryItems } from './lib/registry.mjs';
import { analyzeFile } from './lib/dts.mjs';
import { bundleGrana, stampHeader, vendorReact } from './lib/bundle.mjs';
import { buildCss } from './lib/css.mjs';
import { compilePreview, parseStory, storyFileFor } from './lib/stories.mjs';
import { emitBuildMeta, emitComponent, emitGuidelines, emitReadme, emitReviewPage } from './lib/emit.mjs';
import { KEY_RECIPE, auxShaFor, renderHashFor, scriptsShaFor, sourceKeyFor, styleShaFor } from './lib/hashes.mjs';

const args = parseArgs(process.argv.slice(2));
const cfg = JSON.parse(readFileSync(join(TOOL, 'config.json'), 'utf8'));
const GLOBAL = cfg.globalName;
const profiles = !args.profile || args.profile === 'all' ? Object.keys(cfg.profiles) : [args.profile];
for (const p of profiles) if (!cfg.profiles[p]) { console.error(`unknown profile "${p}" — one of ${Object.keys(cfg.profiles).join(', ')}`); process.exit(2); }
const OUT_ROOT = args.out ? resolve(args.out) : join(REPO, 'ds-bundle');
const t0 = Date.now();
const log = (s) => console.error(s);

// ── 1. the component list (registry) + types + stories — shared by every profile ──
const items = readRegistryItems();
log(`» ${items.length} registry items from registry/groups/*`);
const comps = [];
const exportOwner = new Map();
for (const item of items) {
  const a = analyzeFile(item.file);
  const compExports = a.exports.filter((e) => e.kind === 'component');
  const name = compExports.find((e) => e.name === pascal(item.name))?.name ?? compExports[0]?.name;
  if (!name) { log(`  ! ${item.name}: no component export in ${item.relFile} — skipped`); continue; }
  for (const e of a.exports) {
    if (exportOwner.has(e.name)) { log(`✗ export "${e.name}" is declared by both ${exportOwner.get(e.name)} and ${item.relFile} — the global cannot hold both`); process.exit(1); }
    exportOwner.set(e.name, item.relFile);
  }
  const card = cfg.cards?.[item.name] ?? {};
  const storyFile = storyFileFor(item, card);
  const story = storyFile ? parseStory(storyFile) : null;
  if (story && card.only) {
    const missing = card.only.filter((t) => !story.sections.some((s) => s.title === t));
    if (missing.length) log(`  ! ${item.name}: cards.only names sections the story does not have: ${missing.join(', ')}`);
  }
  if (story && card.surface && typeof card.surface === 'object') {
    const missing = Object.keys(card.surface).filter((t) => !story.sections.some((s) => s.title === t));
    if (missing.length) log(`  ! ${item.name}: cards.surface names sections the story does not have: ${missing.join(', ')}`);
  }
  comps.push({ item, name, group: item.group, file: item.file, exports: a.exports, notes: a.notes, storyFile, story, card });
}
log(`  ${comps.length} cards · ${comps.reduce((n, c) => n + c.exports.filter((e) => e.kind === 'component').length, 0)} components · ${comps.filter((c) => c.story).length} with a story (${comps.filter((c) => !c.story).map((c) => c.name).join(', ') || 'none'} without) · ${Date.now() - t0} ms`);

// ── 2. per profile ──
for (const profile of profiles) {
  const pc = cfg.profiles[profile];
  const out = join(OUT_ROOT, profile);
  log(`\n» profile ${profile} (${pc.product}, data-brand="${pc.brand}") → ${slash(relative(REPO, out))}`);
  // Reset guard: only an empty dir or a prior bundle (marker) may be wiped.
  if (existsSync(out)) {
    const entries = readdirSync(out);
    if (entries.length && !existsSync(join(out, '.ds-bundle')) && !existsSync(join(out, '_ds_bundle.js'))) {
      log(`✗ ${out} is not empty and not a prior bundle — refusing to wipe it`); process.exit(1);
    }
    rmSync(out, { recursive: true, force: true });
  }
  for (const d of ['_vendor', 'components', '_preview', 'guidelines', 'fonts', 'img']) mkdirSync(join(out, d), { recursive: true });
  writeFileSync(join(out, '.ds-bundle'), '');

  const reactVersion = await vendorReact(out);
  log(`  _vendor/react.js (react ${reactVersion})`);
  const bundle = await bundleGrana({ out, globalName: GLOBAL, entries: comps.map((c) => ({ file: c.file, names: c.exports.map((e) => e.name) })) });
  log(`  _ds_bundle.js: ${(bundle.bytes / 1024).toFixed(0)} KB, ${bundle.inlinedExternals.length} npm packages inlined (${bundle.inlinedExternals.join(', ')})`);
  const cssInfo = await buildCss({ out, brand: pc.brand });
  log(`  _ds_bundle.css: ${(cssInfo.bytes / 1024).toFixed(0)} KB from ${cssInfo.candidates} candidates in ${cssInfo.files} files · fonts: ${cssInfo.fontFaces} faces, ${cssInfo.fontFiles.length} files · img: ${cssInfo.imgFiles.length} files`);

  const previewOk = new Map();
  const previewFailures = {};
  for (const c of comps) {
    if (!c.storyFile) continue;
    const r = await compilePreview({ entry: c.storyFile, outFile: join(out, '_preview', `${c.name}.js`), globalName: GLOBAL });
    previewOk.set(c.name, r.ok);
    if (!r.ok) { previewFailures[c.name] = r.error; log(`  ! preview build failed: ${c.name}: ${r.error}`); }
  }
  log(`  _preview/: ${[...previewOk.values()].filter(Boolean).length} compiled${Object.keys(previewFailures).length ? `, ${Object.keys(previewFailures).length} FAILED` : ''}`);

  for (const c of comps) {
    emitComponent({ out, comp: c, brand: pc.brand, globalName: GLOBAL, previewOk: previewOk.get(c.name) === true, defaultViewport: cfg.defaultViewport });
  }
  const guidelineFiles = emitGuidelines({ out, files: pc.guidelines });
  log(`  guidelines/: ${guidelineFiles.join(', ')}`);
  const readmeLen = emitReadme({ out, profile, cfg: pc, globalName: GLOBAL, comps, guidelineFiles, cssInfo });
  log(`  README.md: ${readmeLen} chars`);
  emitReviewPage({ out, comps, profile });
  emitBuildMeta({ out, globalName: GLOBAL, profile, brand: pc.brand, comps, reactVersion, previewFailures, cssInfo });
  const header = stampHeader(bundle.bundleJs, { namespace: GLOBAL, components: comps, inlinedExternals: bundle.inlinedExternals });

  // The sidecar — written last so every hashed surface exists.
  const sourceKeys = Object.fromEntries(comps.map((c) => [c.name, sourceKeyFor(c.name, {
    sourceFile: c.file, storyFile: c.storyFile,
    ownedPreview: c.storyFile?.startsWith(join(TOOL, 'previews')) ? c.storyFile : null,
    card: c.card, brand: pc.brand,
  })]));
  const renderHashes = Object.fromEntries(comps.map((c) => [c.name, renderHashFor(out, c)]));
  const bundleSha12 = sha(readFileSync(bundle.bundleJs), 12);
  writeFileSync(join(out, '_ds_sync.json'), JSON.stringify({
    shape: 'package', generator: 'grana-design-sync', profile, brand: pc.brand, projectId: pc.projectId,
    styleSha: styleShaFor(out), renderHashes, sourceKeys, keyRecipe: KEY_RECIPE, scriptsSha: scriptsShaFor(),
    sourceHashes: header.sourceHashes, auxSha: auxShaFor(out), bundleSha12,
  }, null, 2) + '\n');
  rmSync(join(out, '.bundle-entry.ts'), { force: true });

  const MAX = 12 * 1024 * 1024;
  for (const p of walk(out)) if (statSync(p).size > MAX) log(`  ! [FILE_TOO_LARGE] ${slash(relative(out, p))} is ${(statSync(p).size / 1024 / 1024).toFixed(1)} MB — the upload rejects files over 12 MB`);
  log(`  ✓ ${comps.length} cards, ${walk(out, (n, r) => !n.startsWith('.') && !r.startsWith('_screenshots')).length} files, ${Date.now() - t0} ms`);
}
