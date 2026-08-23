#!/usr/bin/env node
// Validate a built bundle: file-shape checks (header, sidecar, stylesheet closure, card
// markers, .d.ts parse) and a Playwright render check that opens EVERY card, asserts no
// page/console errors, no unstyled ("thin") render, no identical variants, writes a
// screenshot per card + labelled contact sheets, and `.render-check.json`.
//
//   node tools/design-sync/validate.mjs [--profile luminars|rf|all] [--out ds-bundle] [--no-render-check]
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { REPO, TOOL, parseArgs, sha, slash, walk } from './lib/common.mjs';
import { renderHashFor } from './lib/hashes.mjs';
import { serveDir } from './lib/serve.mjs';

const args = parseArgs(process.argv.slice(2));
const cfg = JSON.parse(readFileSync(join(TOOL, 'config.json'), 'utf8'));
const profiles = !args.profile || args.profile === 'all' ? Object.keys(cfg.profiles) : [args.profile];
const OUT_ROOT = args.out ? resolve(args.out) : join(REPO, 'ds-bundle');
const NO_RENDER = !!args['no-render-check'];
const ignoreConsole = (cfg.ignoreConsole ?? []).map((s) => new RegExp(s));

let exitCode = 0;
for (const profile of profiles) {
  const ok = await validateProfile(profile, join(OUT_ROOT, profile));
  if (!ok) exitCode = 1;
}
process.exit(exitCode);

async function validateProfile(profile, OUT) {
  let errors = 0, warnings = 0;
  const fail = (m) => { errors++; console.error(`✗ ${m}`); };
  const warn = (m) => { warnings++; console.error(`! ${m}`); };
  const ok = (m) => console.error(`  ${m}`);
  const relOut = (p) => slash(relative(OUT, p));
  console.error(`\n» validate ${profile} — ${slash(relative(REPO, OUT))}`);
  if (!existsSync(OUT)) { fail(`${OUT} does not exist — run build.mjs first`); return false; }

  // .ds-build-meta.json
  let meta = null;
  try {
    meta = JSON.parse(readFileSync(join(OUT, '.ds-build-meta.json'), 'utf8'));
    ok(`.ds-build-meta.json: ${meta.componentCount} cards (${meta.profile}, brand ${meta.brand}, react ${meta.reactVersion})`);
    const pf = Object.keys(meta.previewFailures ?? {});
    if (pf.length) fail(`[PREVIEW_FAILED] ${pf.length} preview build(s) failed at build time: ${pf.join(', ')} — those cards show the floor`);
  } catch (e) { fail(`.ds-build-meta.json: ${e.message}`); }

  // _ds_bundle.js + header
  const bundleJs = join(OUT, '_ds_bundle.js');
  let header = null;
  if (!existsSync(bundleJs)) fail('_ds_bundle.js missing');
  else {
    const src = readFileSync(bundleJs, 'utf8');
    try { new Function(src); ok(`_ds_bundle.js: ${(statSync(bundleJs).size / 1024).toFixed(0)} KB, syntax OK`); }
    catch (e) { fail(`_ds_bundle.js: syntax error — ${e.message}`); }
    const m = /^\/\* @ds-bundle: (.*) \*\//.exec(src.split('\n', 1)[0]);
    if (!m) fail('_ds_bundle.js: missing first-line `/* @ds-bundle: {…} */` header');
    else {
      try {
        header = JSON.parse(m[1].replace(/\*\\\//g, '*/'));
        const missing = ['namespace', 'components', 'sourceHashes', 'inlinedExternals'].filter((k) => header[k] === undefined);
        if (missing.length) fail(`_ds_bundle.js header missing: ${missing.join(', ')}`);
        else ok(`_ds_bundle.js header: window.${header.namespace}, ${header.components.length} components, ${header.inlinedExternals.length} inlined packages`);
      } catch (e) { fail(`_ds_bundle.js header: invalid JSON — ${e.message}`); }
    }
  }

  // _ds_sync.json — recompute every hash from disk.
  let sync = null;
  try {
    sync = JSON.parse(readFileSync(join(OUT, '_ds_sync.json'), 'utf8'));
    const live = sha(readFileSync(bundleJs), 12);
    if (sync.bundleSha12 !== live) fail('_ds_sync.json is stale (bundleSha mismatch) — rebuild');
    const stale = [];
    for (const c of header?.components ?? []) {
      const group = c.sourcePath.split('/')[1];
      if (sync.renderHashes[c.name] !== renderHashFor(OUT, { name: c.name, group })) stale.push(c.name);
    }
    if (stale.length) fail(`[SYNC_STALE] renderHashes don't match disk for: ${stale.join(', ')} — rebuild`);
    else ok(`_ds_sync.json: ${Object.keys(sync.renderHashes).length} render hashes match disk, recipe ${sync.keyRecipe}, brand ${sync.brand}`);
    for (const [p, h] of Object.entries(sync.sourceHashes)) {
      if (!existsSync(join(OUT, p))) fail(`[SYNC_STALE] sourceHashes lists ${p} which is not on disk`);
      else if (sha(readFileSync(join(OUT, p)), 12) !== h) fail(`[SYNC_STALE] sourceHashes for ${p} doesn't match disk`);
    }
  } catch (e) { fail(`_ds_sync.json: ${e.message}`); }

  // styles.css closure
  const stylesCss = join(OUT, 'styles.css');
  const bundleCss = join(OUT, '_ds_bundle.css');
  if (!existsSync(stylesCss)) fail('styles.css missing');
  else {
    const txt = readFileSync(stylesCss, 'utf8');
    let n = 0;
    for (const m of txt.matchAll(/@import\s+(?:url\()?["']([^"']+)["']/g)) {
      n++;
      if (!existsSync(join(OUT, m[1]))) fail(`[CSS_IMPORT_MISSING] styles.css @imports "${m[1]}" which doesn't exist`);
    }
    if (!/@import\s+(?:url\()?["']\.\/_ds_bundle\.css["']/.test(txt)) fail('[CSS_BUNDLE_UNREACHABLE] styles.css does not @import ./_ds_bundle.css');
    else ok(`styles.css: ${n} @import(s), all resolve`);
    const css = readFileSync(bundleCss, 'utf8');
    const must = ['.bg-card', '.border-border', '.rounded-full', '.text-muted-foreground', '.num', '.eyebrow', '--canvas:', '@layer'];
    const miss = must.filter((s) => !css.includes(s));
    if (miss.length) fail(`[CSS_INCOMPLETE] _ds_bundle.css lacks ${miss.join(', ')} — Tailwind did not compile the utilities`);
    else ok(`_ds_bundle.css: ${(statSync(bundleCss).size / 1024).toFixed(0)} KB, utilities + tokens present`);
    if (/url\(\s*["']?\/fonts\//.test(css)) fail('[FONT_DANGLING] _ds_bundle.css still references /fonts/ (absolute) urls');
    // Textures resolve through window.__dsImgBase; an absolute /img/ in a compiled preview means
    // the rebase missed it and every canvas in that card would render as an empty wash.
    for (const f of readdirSync(join(OUT, '_preview'))) {
      const js = readFileSync(join(OUT, '_preview', f), 'utf8');
      if (/["']\/img\//.test(js)) fail(`[IMG_DANGLING] _preview/${f} still references absolute /img/ urls`);
    }
    const fontsCss = join(OUT, 'fonts', 'fonts.css');
    if (!existsSync(fontsCss)) fail('fonts/fonts.css missing');
    else {
      const f = readFileSync(fontsCss, 'utf8');
      let faces = 0, dangling = 0;
      for (const m of f.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) { faces++; if (!existsSync(resolve(dirname(fontsCss), m[1]))) { dangling++; fail(`[FONT_DANGLING] fonts.css url ${m[1]} not on disk`); } }
      if (!dangling) ok(`fonts/fonts.css: ${faces} faces, all files present`);
    }
    if (meta?.brand === 'rf' && !/@ds-brand-pin: rf/.test(css)) fail('[BRAND_PIN] the rf bundle css carries no brand pin');
  }

  // Cards: @dsCard first line, link hrefs, prompt first line, .d.ts parse.
  if (!existsSync(join(OUT, 'README.md'))) fail('README.md missing');
  const htmls = [];
  let prompts = 0, dts = 0;
  const { ts } = await import('ts-morph');
  for (const p of walk(join(OUT, 'components'))) {
    const rel = relOut(p);
    if (p.endsWith('.html')) {
      htmls.push(rel);
      const txt = readFileSync(p, 'utf8');
      if (!/^<!--\s*@dsCard\s+group="[^"]*"[^>]*-->/.test(txt.split('\n', 1)[0])) fail(`[DSCARD_MISSING] ${rel}: first line isn't a @dsCard marker`);
      for (const m of txt.matchAll(/<(?:link|script)\b[^>]*\b(?:href|src)="([^"]+)"/g)) {
        if (!existsSync(resolve(dirname(p), m[1]))) fail(`[LINK_MISSING] ${rel}: ${m[1]} doesn't resolve`);
      }
    } else if (p.endsWith('.prompt.md')) {
      prompts++;
      if (!readFileSync(p, 'utf8').split('\n', 1)[0].trim()) fail(`[PROMPT_EMPTY] ${rel}`);
    } else if (p.endsWith('.d.ts')) {
      dts++;
      const sf = ts.createSourceFile(p, readFileSync(p, 'utf8'), ts.ScriptTarget.Latest, false);
      for (const d of sf.parseDiagnostics ?? []) fail(`[DTS_PARSE] ${rel}: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
    }
  }
  ok(`components/: ${htmls.length} cards, ${prompts} prompt.md, ${dts} .d.ts parsed`);
  if (meta && htmls.length !== meta.componentCount) fail(`count mismatch: ${htmls.length} cards vs ${meta.componentCount} in build meta`);
  const groups = new Set(htmls.map((h) => h.split('/')[1]));
  ok(`groups: ${[...groups].sort().join(', ')}`);

  // ── render check ──
  let pw = null;
  if (!NO_RENDER) { try { pw = await import('playwright'); } catch { /* absent */ } }
  rmSync(join(OUT, '.render-check.json'), { force: true });
  if (!pw) {
    if (NO_RENDER) warn('[RENDER_SKIPPED] --no-render-check: previews are NOT visually verified');
    else fail('[RENDER_SKIPPED] playwright not importable — `pnpm exec playwright install chromium`');
  } else {
    const { srv, port } = await serveDir(OUT);
    const shotDir = join(OUT, '_screenshots');
    rmSync(shotDir, { recursive: true, force: true });
    mkdirSync(shotDir, { recursive: true });
    const results = [];
    let browser;
    try {
      browser = await pw.chromium.launch();
      const page = await browser.newPage({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 1 });
      let pageErrs = [], consoleErrs = [], resourceErrs = [];
      page.on('pageerror', (e) => pageErrs.push(String(e).split('\n')[0]));
      // Network failures (a story's deliberate broken <img src>) are reported apart from
      // JS console errors: they never mean the component is broken.
      page.on('console', (m) => {
        if (m.type() !== 'error') return;
        const t = m.text();
        if (ignoreConsole.some((r) => r.test(t))) return;
        if (/Failed to load resource/.test(t)) resourceErrs.push(`${m.location()?.url ?? ''} ${t}`.trim().slice(0, 200));
        else consoleErrs.push(t.split('\n')[0].slice(0, 200));
      });

      // [BUNDLE_EXPORT] smoke: every header component is a function on the global.
      if (header) {
        await page.goto(`http://127.0.0.1:${port}/`);
        await page.setContent('<!doctype html><script src="/_vendor/react.js"></script><script src="/_vendor/react-dom.js"></script><script src="/_ds_bundle.js"></script>');
        await page.waitForFunction((g) => !!window[g], header.namespace, { timeout: 10_000 }).catch(() => {});
        const { n, bad } = await page.evaluate(({ g, names }) => {
          const NS = window[g] ?? {};
          return { n: Object.keys(NS).length, bad: names.filter((x) => typeof NS[x] !== 'function' && !(NS[x] && NS[x].$$typeof)) };
        }, { g: header.namespace, names: header.components.map((c) => c.name) });
        if (bad.length) fail(`[BUNDLE_EXPORT] not a component on window.${header.namespace}: ${bad.join(', ')}`);
        else ok(`window.${header.namespace}: ${n} exports, every card's component is a function`);
        if (pageErrs.length) fail(`[BUNDLE_LOAD] loading the bundle threw: ${pageErrs[0]}`);
      }

      for (const rel of htmls) {
        pageErrs = []; consoleErrs = []; resourceErrs = [];
        const [, group, name] = rel.match(/^components\/([^/]+)\/([^/]+)\//);
        const shot = join(shotDir, `${group}__${name}.png`);
        let r = { name, group, rel };
        try {
          const vp = /viewport="(\d+)x(\d+)"/.exec(readFileSync(join(OUT, rel), 'utf8').split('\n', 1)[0]);
          await page.setViewportSize({ width: vp ? Number(vp[1]) : 900, height: vp ? Number(vp[2]) : 700 });
          await page.goto(`http://127.0.0.1:${port}/${rel}`, { waitUntil: 'networkidle', timeout: 20_000 });
          await page.waitForFunction(() => document.querySelector('[data-ds-story], [data-ds-error], [data-ds-fallback]'), null, { timeout: 8_000 }).catch(() => {});
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(250);
          const m = await page.evaluate(() => {
            // Faces actually loaded (a declared face only loads once some text uses it).
            const fontsLoaded = [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/^"|"$/g, '')))];
            const bodyFont = getComputedStyle(document.body).fontFamily;
            const stylesheetLive = /General Sans/.test(bodyFont);
            // UA defaults: a pristine element of the same tag in a stylesheet-less iframe.
            const fr = document.createElement('iframe');
            fr.style.cssText = 'position:fixed;left:-9999px;width:300px;height:100px';
            fr.srcdoc = '<!doctype html><html><body></body></html>';
            document.body.appendChild(fr);
            const pdoc = fr.contentDocument;
            const KEYS = ['backgroundColor', 'borderTopStyle', 'borderTopWidth', 'borderTopColor', 'borderTopLeftRadius', 'fontFamily', 'paddingLeft', 'color', 'display'];
            const pristine = new Map();
            const uaOf = (tag) => {
              if (!pristine.has(tag)) { const el = pdoc.createElement(tag); pdoc.body.appendChild(el); const cs = pdoc.defaultView.getComputedStyle(el); pristine.set(tag, Object.fromEntries(KEYS.map((k) => [k, cs[k]]))); }
              return pristine.get(tag);
            };
            const stylePaints = (cs) => {
              if (cs.backgroundImage !== 'none') return true;
              if (!/^(rgba\(0, 0, 0, 0\)|transparent|)$/.test(cs.backgroundColor)) return true;
              if (cs.boxShadow !== 'none') return true;
              for (const s of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(cs[`border${s}Width`]) > 0 && !/transparent|rgba\(0, 0, 0, 0\)/.test(cs[`border${s}Color`])) return true;
              return false;
            };
            const paints = (root) => {
              for (const el of [root, ...root.querySelectorAll('*')]) {
                if (/^(IMG|SVG|CANVAS|VIDEO|IFRAME|PICTURE|HR)$/.test(el.tagName)) return true;
                if (stylePaints(getComputedStyle(el))) return true;
              }
              return false;
            };
            const error = document.querySelector('[data-ds-error]')?.textContent ?? null;
            const fallback = !!document.querySelector('[data-ds-fallback]');
            const sections = [...document.querySelectorAll('[data-ds-story]')];
            const out = [];
            for (const s of sections) {
              // Everything after the section's own <header> is the story body (a story may
              // put several components directly under <Story>, not one wrapper).
              const bodyEls = [...s.children].slice(1);
              // Component roots = data-slot elements with no data-slot ancestor inside the section.
              const tops = [...s.querySelectorAll('[data-slot]')].filter((el) => {
                const a = el.parentElement?.closest('[data-slot]');
                return !a || !s.contains(a);
              });
              let unstyled = 0;
              for (const el of tops) {
                const cs = getComputedStyle(el), ua = uaOf(el.tagName.toLowerCase());
                if (KEYS.every((k) => cs[k] === ua[k])) unstyled++;
              }
              const text = bodyEls.map((b) => b.textContent ?? '').join(' ').trim();
              out.push({
                title: s.getAttribute('data-ds-story'), roots: tops.length, unstyled,
                hollow: !text && !bodyEls.some(paints),
                height: Math.round(bodyEls.reduce((n, b) => n + b.getBoundingClientRect().height, 0)),
                html: bodyEls.map((b) => b.outerHTML).join(''), chars: text.length,
              });
            }
            fr.remove();
            const portals = [...document.body.children].filter((c) => c.id !== 'root' && !/^(SCRIPT|STYLE|LINK|IFRAME)$/.test(c.tagName));
            return { fontsLoaded, stylesheetLive, error, fallback, sections: out, portalText: portals.map((p) => (p.textContent ?? '').trim()).join(' ').slice(0, 80) };
          });
          const buf = await page.screenshot({ path: shot, fullPage: true });
          const secs = m.sections;
          const htmlsIn = secs.map((s) => s.html);
          const variantsIdentical = htmlsIn.length > 1 && htmlsIn.every((h) => h === htmlsIn[0]);
          const allUnstyled = secs.length > 0 && secs.every((s) => s.roots > 0 && s.unstyled === s.roots);
          const allHollow = secs.length > 0 && secs.every((s) => s.hollow);
          const noRoots = secs.length > 0 && secs.every((s) => s.roots === 0);
          const collapsed = secs.length > 0 && Math.max(...secs.map((s) => s.height)) < 8;
          const unstyled = !m.stylesheetLive;
          const errs = pageErrs.length + consoleErrs.length + (m.error ? 1 : 0);
          const thin = !m.fallback && (allUnstyled || allHollow || collapsed || noRoots || unstyled);
          const blank = buf.length < 5000;
          const bad = !!m.error || (!m.fallback && secs.length === 0) || blank || errs > 0 || unstyled;
          r = { ...r, sections: secs.length, errs, pageErrs, consoleErrs, resourceErrs, renderError: m.error, fallback: m.fallback,
            pngBytes: buf.length, blank, stylesheetLive: m.stylesheetLive, fontsLoaded: m.fontsLoaded,
            unstyledRoots: secs.reduce((n, s) => n + s.unstyled, 0), roots: secs.reduce((n, s) => n + s.roots, 0),
            thin, thinWhy: thin ? (unstyled ? 'stylesheet not applied' : allUnstyled ? 'every component root equals the UA default' : allHollow ? 'no text and nothing painted' : collapsed ? 'rendered height < 8px' : 'no data-slot roots') : null,
            variantsIdentical, bad, portalText: m.portalText, titles: secs.map((s) => `${s.title} (${s.chars} chars, ${s.roots} roots${s.unstyled ? `, ${s.unstyled} unstyled` : ''})`) };
        } catch (e) {
          r = { ...r, errs: 1, pageErrs: [String(e.message ?? e).split('\n')[0]], bad: true, thin: false, variantsIdentical: false, sections: 0 };
        }
        results.push(r);
        if (r.bad) fail(`[RENDER] ${rel}: ${r.renderError ?? r.pageErrs?.[0] ?? r.consoleErrs?.[0] ?? (r.blank ? 'blank screenshot' : r.sections === 0 ? 'no story sections rendered' : 'stylesheet not applied')}`);
        else if (r.thin) warn(`[RENDER_THIN] ${rel}: ${r.thinWhy}`);
        else if (r.variantsIdentical) warn(`[RENDER_THIN] ${rel}: every story section renders identically`);
        if (!r.bad && r.fontsLoaded && !r.fontsLoaded.includes('General Sans')) warn(`[FONT_MISSING] ${rel}: General Sans did not load (loaded: ${r.fontsLoaded.join(', ') || 'none'}) — check fonts/fonts.css`);
        if (r.resourceErrs?.length) warn(`[RESOURCE_404] ${rel}: ${r.resourceErrs[0]} (a story asset, not a component error)`);
      }
      writeFileSync(join(OUT, '.render-check.json'), JSON.stringify({ profile, at: new Date().toISOString(), results }, null, 2) + '\n');
      const badOnes = results.filter((r) => r.bad), thinOnes = results.filter((r) => r.thin && !r.bad), identOnes = results.filter((r) => r.variantsIdentical && !r.bad);
      const faces = [...new Set(results.flatMap((r) => r.fontsLoaded ?? []))].sort();
      const summary = `render check: ${results.length} cards · ${badOnes.length} bad · ${thinOnes.length} thin · ${identOnes.length} variantsIdentical · ${results.filter((r) => r.fallback).length} floor · faces loaded across cards: ${faces.join(', ') || 'none'}`;
      if (badOnes.length) console.error(`  ${summary}`); else ok(summary);

      // Contact sheets — 16 per sheet, 4 columns, labelled, so the whole set reads in a few images.
      const PER = 16, entries = [...results].sort((a, b) => a.name.localeCompare(b.name)), sheets = Math.ceil(entries.length / PER);
      const status = (r) => (r.fallback ? '◌ floor' : r.bad ? '✗ bad' : r.thin ? '⚠ thin' : r.variantsIdentical ? '⚠ identical' : '✓');
      const border = (r) => (r.bad ? '#d33' : r.thin || r.variantsIdentical ? '#d90' : '#ddd');
      await page.setViewportSize({ width: 1500, height: 900 });
      for (let s = 0; s < sheets; s++) {
        const slice = entries.slice(s * PER, (s + 1) * PER);
        const cells = slice.map((r) => `<div style="border:2px solid ${border(r)};background:#fff;min-width:0"><div style="font:600 16px system-ui;color:#222;padding:6px 8px">${r.name} <span style="font-weight:400;color:#555">${status(r)}</span> <span style="font-weight:400;color:#999;font-size:12px">${r.sections ?? 0} sections</span></div><img src="./${r.group}__${r.name}.png" style="width:330px;height:300px;object-fit:cover;object-position:top left;display:block"></div>`).join('\n');
        writeFileSync(join(shotDir, `.contact-sheet-${s + 1}.html`), `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#fff;width:1500px"><div style="font:600 20px system-ui;color:#222;padding:12px 10px">${profile} — render check — sheet ${s + 1}/${sheets} — cards ${s * PER + 1}–${s * PER + slice.length} of ${entries.length}</div><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;padding:0 10px 10px">${cells}</div></body></html>`);
        await page.goto(`http://127.0.0.1:${port}/_screenshots/.contact-sheet-${s + 1}.html`, { waitUntil: 'networkidle' });
        await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
        await page.screenshot({ path: join(shotDir, `contact-sheet-${s + 1}.png`), fullPage: true });
      }
      writeFileSync(join(shotDir, 'contact-sheets.json'), JSON.stringify(Array.from({ length: sheets }, (_, s) => ({ sheet: s + 1, components: entries.slice(s * PER, (s + 1) * PER).map((r) => r.name) })), null, 2));
      ok(`contact sheets: ${sheets} → _screenshots/contact-sheet-1.png … ${sheets}`);
    } catch (e) {
      fail(`[RENDER_SKIPPED] render check did not run (${String(e).split('\n')[0]})`);
    } finally {
      await browser?.close();
      srv.close();
    }
  }
  console.error(errors ? `✗ ${profile}: ${errors} error(s), ${warnings} warning(s)` : `✓ ${profile}: bundle is complete${warnings ? ` (${warnings} warning(s), non-blocking)` : ''}`);
  return errors === 0;
}
