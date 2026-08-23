// Output emitters: the per-card files (.jsx / .d.ts / .prompt.md / <Name>.html), README.md,
// guidelines/, .ds-build-meta.json and the local .review.html.
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';
import { REPO, TOOL, escapeHtml, readText, slash } from './common.mjs';
import { GROUP_ORDER } from './registry.mjs';

const CARD_CSS = 'body{margin:0;padding:20px 24px}.ds-single{transform:translateZ(0)}' +
  '.ds-error{font:13px ui-monospace,monospace;color:#a52a2a;white-space:pre-wrap}';

/** The card page: the story page mounted from the bundle global under the profile's brand. */
export function cardHtml({ group, name, brand, viewport, titles, only, surface, description }) {
  const json = (v) => JSON.stringify(v ?? null).replace(/</g, '\\u003c');
  return `<!-- @dsCard group="${escapeHtml(group)}" viewport="${escapeHtml(viewport)}" -->
<!doctype html>
<html data-brand="${escapeHtml(brand)}" data-surface="app"><head><meta charset="utf-8">
  <title>${escapeHtml(name)}</title>
  <link rel="stylesheet" href="../../../styles.css">
  <link rel="stylesheet" href="../../../_ds_bundle.css">
  <style>${CARD_CSS}</style>
</head><body>
  <!-- ${escapeHtml(description)} -->
  <div id="root" class="ds-single"></div>
  <script src="../../../_vendor/react.js"></script>
  <script src="../../../_vendor/react-dom.js"></script>
  <script src="../../../_ds_bundle.js"></script>
  <script>
    window.__dsCells=${json(titles)};
    window.__dsOnly=${json(only)};
    window.__dsSurface=${json(surface ?? {})};
    window.__dsMode="single";
    var q=null;try{q=new URLSearchParams(location.search).get('story')}catch(e){}
    if(q)window.__dsOnly=[q];
  </script>
  <script src="../../../_preview/${name}.js"></script>
  <script>
    (function(){
      var r=document.getElementById('root');
      function fail(m){r.innerHTML='';var d=document.createElement('pre');d.className='ds-error';d.setAttribute('data-ds-error','');d.textContent='\\u26a0 '+m;r.appendChild(d)}
      window.addEventListener('error',function(e){fail(e.message||String(e.error||e))});
      try{
        var P=window.__dsPreview&&window.__dsPreview.default;
        if(typeof P!=='function')throw new Error('no default export in _preview/${name}.js');
        ReactDOM.createRoot(r).render(React.createElement(P));
      }catch(e){fail(e&&e.message||e)}
    })();
  </script>
</body></html>
`;
}

/** The floor card for an item with no story: importable, documented, not previewed. */
function floorHtml({ group, name, brand, description }) {
  return `<!-- @dsCard group="${escapeHtml(group)}" -->
<!doctype html>
<html data-brand="${escapeHtml(brand)}" data-surface="app"><head><meta charset="utf-8">
  <link rel="stylesheet" href="../../../styles.css">
  <link rel="stylesheet" href="../../../_ds_bundle.css">
  <style>${CARD_CSS}</style>
</head><body>
  <div id="root" data-ds-fallback="" class="rounded-md border border-border bg-card p-6 max-w-[520px]">
    <span class="eyebrow">${escapeHtml(group)}</span>
    <div class="mt-1 font-voice text-xl">${escapeHtml(name)}</div>
    <p class="mt-3 text-13 text-muted-foreground">${escapeHtml(description)}</p>
    <p class="mt-3 text-xs text-faint">No story renders this item yet. It is fully importable — its API is in <code>${escapeHtml(name)}.d.ts</code>, usage in <code>${escapeHtml(name)}.prompt.md</code>.</p>
  </div>
</body></html>
`;
}

const variantsFnType = (e) => (/Variants$/.test(e.name) ? '(props?: Record<string, unknown>) => string' : e.typeText && e.typeText !== 'unknown' ? e.typeText : '(...args: any[]) => any');

function dtsFor(comp, globalName) {
  const { name, item, exports } = comp;
  const comps = exports.filter((e) => e.kind === 'component');
  const others = exports.filter((e) => e.kind !== 'component');
  const main = comps.find((e) => e.name === name);
  const ordered = [main, ...comps.filter((e) => e !== main)];
  const iface = (e) => {
    const body = e.props?.lines?.length ? e.props.lines.join('\n') : '  [key: string]: unknown;';
    const doc = e === main ? `/**\n * ${name} — Grana registry item "${item.name}" (${item.relFile}), group ${item.group}.\n * ${item.description.replace(/\*\//g, '* /')}\n */\n`
      : e.doc ? `/** ${e.doc.replace(/\*\//g, '* /')} */\n` : '';
    return `${doc}export interface ${e.name}Props {\n${body}\n}\n\nexport declare const ${e.name}: React.ComponentType<${e.name}Props>;\n`;
  };
  const parts = [`import * as React from 'react';\n`, ...ordered.map(iface)];
  for (const e of others) {
    const doc = e.doc ? `/** ${e.doc.replace(/\*\//g, '* /')} */\n` : '';
    parts.push(`${doc}export declare const ${e.name}: ${e.kind === 'function' ? variantsFnType(e) : 'unknown'};\n`);
  }
  parts.push(`\n// Everything above is on window.${globalName}.* once _ds_bundle.js has loaded.\n`);
  return parts.join('\n');
}

const MAX_SECTIONS = 8, MAX_SECTION_LINES = 48, MAX_PROMPT = 16000;

function promptFor(comp, globalName, previewOk) {
  const { name, item, exports, notes, story, storyFile } = comp;
  const comps = exports.filter((e) => e.kind === 'component');
  const others = exports.filter((e) => e.kind !== 'component');
  const also = exports.filter((e) => e.name !== name).map((e) => `\`${e.name}\``);
  const head = `${name} from Grana (registry item \`${item.name}\`, group ${item.group}). Use via \`window.${globalName}.${name}\` (bundle loaded from the root \`_ds_bundle.js\`). ${item.description}${also.length ? ` Also exports: ${also.join(', ')}.` : ''}\n`;
  const parts = [head];
  // Props — one interface per component export.
  const propsBlocks = comps.map((e) => {
    const body = e.props?.lines?.length ? e.props.lines.join('\n') : '  [key: string]: unknown;';
    return `interface ${e.name}Props {\n${body}\n}`;
  });
  if (others.length) propsBlocks.push(others.map((e) => `declare const ${e.name}: ${e.kind === 'function' ? variantsFnType(e) : 'unknown'};`).join('\n'));
  parts.push(`## Props\n\n\`\`\`ts\n${propsBlocks.join('\n\n')}\n\`\`\`\n`);
  if (notes.length) parts.push(`## Notes (from ${item.relFile})\n\n${notes.map((n) => n.split('\n').map((l) => `> ${l}`).join('\n')).join('\n>\n')}\n`);
  if (story) {
    const rel = slash(relative(REPO, storyFile));
    const ex = [`## Examples (from ${rel}${previewOk ? '' : ' — the preview build FAILED, see the build log'})\n`];
    if (story.composes.length) ex.push(`Composes with: ${story.composes.filter((c) => !exports.some((e) => e.name === c)).map((c) => `\`${c}\``).join(', ') || '—'}.\n`);
    if (story.helpers.trim() && story.helpers.split('\n').length <= 60) ex.push(`Story helpers:\n\n\`\`\`tsx\n${story.helpers.replace(/```/g, '')}\n\`\`\`\n`);
    const only = comp.card?.only;
    const sections = (only ? story.sections.filter((s) => only.includes(s.title)) : story.sections).slice(0, MAX_SECTIONS);
    for (const s of sections) {
      const lines = s.jsx.split('\n');
      const jsx = (lines.length > MAX_SECTION_LINES ? lines.slice(0, MAX_SECTION_LINES).join('\n') + '\n// …' : s.jsx).replace(/```/g, '');
      ex.push(`### ${s.title}\n${s.note ? `\n${s.note}\n` : ''}\n\`\`\`jsx\n${jsx}\n\`\`\`\n`);
    }
    parts.push(ex.join('\n'));
  }
  let prompt = parts.join('\n');
  if (prompt.length > MAX_PROMPT) prompt = prompt.slice(0, MAX_PROMPT).replace(/\n[^\n]*$/, '') + '\n\n_(truncated — see the story file for the rest)_\n';
  return prompt;
}

/** Write components/<group>/<Name>/<Name>.{jsx,d.ts,prompt.md,html}. */
export function emitComponent({ out, comp, brand, globalName, previewOk, defaultViewport }) {
  const { name, group, item, exports, story, card } = comp;
  const dir = join(out, 'components', group, name);
  mkdirSync(dir, { recursive: true });
  const assign = exports.map((e) => `${e.name}: window.${globalName}.${e.name}`).join(', ');
  writeFileSync(join(dir, `${name}.jsx`),
    `// Re-export of Grana ${name} (registry item "${item.name}", ${item.relFile}). Implementation is in the root _ds_bundle.js (window.${globalName}).\n` +
    `Object.assign(window, { ${assign} });\n`);
  writeFileSync(join(dir, `${name}.d.ts`), dtsFor(comp, globalName));
  writeFileSync(join(dir, `${name}.prompt.md`), promptFor(comp, globalName, previewOk));
  const html = story && previewOk
    ? cardHtml({
      group, name, brand,
      viewport: card?.viewport ?? defaultViewport,
      titles: (card?.only ? story.sections.filter((s) => card.only.includes(s.title)) : story.sections).map((s) => s.title),
      only: card?.only ?? null,
      surface: card?.surface ?? {},
      description: item.description,
    })
    : floorHtml({ group, name, brand, description: item.description });
  writeFileSync(join(dir, `${name}.html`), html);
}

/** Copy the profile's guideline docs into guidelines/ + an index.md. */
export function emitGuidelines({ out, files }) {
  const dir = join(out, 'guidelines');
  mkdirSync(dir, { recursive: true });
  const copied = [];
  for (const rel of files) {
    const src = join(REPO, rel);
    if (!existsSync(src)) { console.error(`  ! guideline not found: ${rel}`); continue; }
    cpSync(src, join(dir, basename(rel)));
    copied.push(basename(rel));
  }
  writeFileSync(join(dir, 'index.md'), `# Guidelines\n\n${copied.map((f) => `- [${basename(f, extname(f))}](./${f})`).join('\n')}\n`);
  return copied;
}

export function emitBuildMeta({ out, globalName, profile, brand, comps, reactVersion, previewFailures, cssInfo }) {
  writeFileSync(join(out, '_ds_needs_recompile'), JSON.stringify({ by: 'design-sync-cli' }));
  writeFileSync(join(out, '.ds-bundle'), '');
  writeFileSync(join(out, '.ds-build-meta.json'), JSON.stringify({
    namespace: globalName,
    source: `grana@${JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8')).version}`,
    shape: 'package',
    profile, brand,
    provider: null,
    componentCount: comps.length,
    previewFailures,
    reactVersion,
    css: cssInfo,
    builtAt: new Date().toISOString(),
  }, null, 2) + '\n');
}

/** One local page iframing every card — the human review pass. Dot-prefixed: never uploaded. */
export function emitReviewPage({ out, comps, profile }) {
  const groups = new Map();
  for (const c of comps) (groups.get(c.group) ?? groups.set(c.group, []).get(c.group)).push(c);
  const sections = [...groups.entries()].map(([g, cs]) =>
    `<h2 style="font:600 16px system-ui;margin:28px 0 10px;color:#374151">${escapeHtml(g)}</h2>\n` +
    `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(460px,1fr));gap:16px">` +
    cs.map((c) => `<figure style="margin:0;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden"><figcaption style="font:600 13px system-ui;padding:8px 12px;background:#f9fafb;border-bottom:1px solid #e5e7eb">${escapeHtml(c.name)}</figcaption><iframe src="components/${encodeURIComponent(c.group)}/${encodeURIComponent(c.name)}/${encodeURIComponent(c.name)}.html" loading="lazy" style="width:100%;height:360px;border:0" title="${escapeHtml(c.name)}"></iframe></figure>`).join('\n') +
    `</div>`).join('\n');
  writeFileSync(join(out, '.review.html'),
    `<!doctype html>\n<html><head><meta charset="utf-8"><title>Grana · ${escapeHtml(profile)} — preview review</title></head>\n<body style="margin:0;padding:24px;background:#fff;font-family:system-ui">\n<h1 style="font:600 20px system-ui;margin:0 0 4px">Preview review — ${escapeHtml(profile)} — ${comps.length} components</h1>\n<p style="font:13px system-ui;color:#6b7280;margin:0">Each card is the live preview html exactly as the Design System pane renders it.</p>\n${sections}\n</body></html>\n`);
}

/** README.md — the agent prompt header: product intro + the grana idiom + the rules + the index. */
export function emitReadme({ out, profile, cfg, globalName, comps, guidelineFiles, cssInfo }) {
  const intro = readText(join(TOOL, 'readme', `${profile}.intro.md`)).trim();
  const rules = readText(join(TOOL, 'readme', 'rules.md')).trim();
  const byGroup = new Map();
  for (const c of comps) (byGroup.get(c.group) ?? byGroup.set(c.group, []).get(c.group)).push(c);
  const rank = (g) => { const i = GROUP_ORDER.indexOf(g); return i < 0 ? 99 : i; };
  const index = [...byGroup.entries()].sort((a, b) => rank(a[0]) - rank(b[0])).map(([g, cs]) =>
    `### ${g}\n${cs.map((c) => {
      const also = c.exports.filter((e) => e.name !== c.name && e.kind === 'component').map((e) => e.name);
      const fns = c.exports.filter((e) => e.kind === 'function').map((e) => `${e.name}()`);
      const extras = [...also, ...fns];
      return `- \`${c.name}\` — ${c.item.description}${extras.length ? ` (also: ${extras.map((x) => `\`${x}\``).join(', ')})` : ''}`;
    }).join('\n')}`).join('\n\n');
  const brandAttr = `data-brand="${cfg.brand}"`;
  const readme = `# Building with ${cfg.product} (the Grana design system)

${intro}

## Setup — no provider; the stylesheet and the brand attribute are the whole contract

There is no ThemeProvider. Components are Tailwind v4 classes reading CSS custom properties,
so they are styled the moment \`styles.css\` is loaded and unstyled without it. The bundle is
compiled for **${cfg.product}** (\`${brandAttr}\`): it already renders this brand with no attribute
at all, and an explicit \`${brandAttr} data-surface="app"\` on \`<html>\` (or on a wrapper) is
honoured — put it there when you can. \`data-surface="marketing"\` on a wrapper switches that
subtree to the marketing surface (ecru paper, depth allowed); everything else is the product
surface.

\`\`\`jsx
const { Button, Card, Chip } = window.${globalName};
<Button variant="primary">Run once</Button>          // no wrapper needed
\`\`\`

## The styling idiom: Tailwind utilities on the theme tokens — never raw colours

Component appearance is set through **props** (\`variant\`, \`size\`, \`tone\`, …). Your own layout
glue is written with **Tailwind utilities** — the stylesheet ships every class the components
use plus the vocabulary below (a precompiled stylesheet is a closed set: a class that is not
listed here and not used by a component does nothing; arbitrary values like \`h-[34px]\` exist
only where a component already uses them). Never write a hex colour, never \`dark:\`.

| Family | Use these |
|---|---|
| Ground | \`bg-background\` (the canvas), \`bg-card\` (surfaces), \`bg-surface-2\` / \`bg-muted\` (sunken), \`bg-accent\` (hover fill), \`bg-canvas-deep\`, \`bg-primary text-primary-foreground\` (the ink ground), \`bg-inverse text-inverse-foreground\` (the one dark band) |
| Ink | \`text-foreground\`, \`text-muted-foreground\` (secondary), \`text-faint\` (quietest AA text), \`text-ink\`, \`text-ochre\` (wayfinding, sparingly) |
| Line | \`border-border\` (THE hairline — 1px, never 2), \`border-border-strong\` (modals, frames), \`border-dashed\` (inferred / machine) |
| Ramp | \`bg-stone-0 … bg-stone-950\`, \`text-stone-*\`, \`border-stone-*\` (\`stone-400\` is the border-and-dot step, \`stone-550\` the faint-text step) |
| Status | \`text-status-good|warning|serious|critical|info\` as text use the \`-ink\` variants (\`text-status-good-ink\`); the plain hues are fills/dots only |
| Executor | \`bg-exec-agent-soft text-exec-agent\` (+ human / api / screen) |
| Shape | \`rounded-xs\` 4 · \`rounded-sm\` 6 · \`rounded-md\` 10 · \`rounded-lg\` 14 · \`rounded-full\` (pills). Nothing else exists. |
| Depth | \`shadow-card\`, \`shadow-panel\` — only where the recipe says; the RF product surface nulls both through the tokens |
| Type | \`font-sans\` is inherited (General Sans — don't repeat it); \`font-voice font-weight-voice\` for the product's voice moments (page titles, teaching headlines — the brand decides the face); \`font-mono\` / \`num\` for ids, eyebrows and ALL numerals; \`font-serif\` for long-form prose only. Sizes: \`text-2xs\` 10.5 · \`text-xs\` 12 · \`text-13\` · \`text-sm\` 14 · \`text-base\` · \`text-lg\` · \`text-xl\` · \`text-2xl\` · \`text-metric\` |
| Layout | \`flex\` / \`grid\` / \`gap-*\` / \`p-*\` / \`m-*\` / \`w-*\` / \`max-w-*\` / \`items-*\` / \`justify-*\` / \`grid-cols-1…6,12\` (+ \`sm:\` \`md:\` \`lg:\`), \`overflow-*\`, \`truncate\`, \`whitespace-nowrap\`, \`text-balance\` |
| Focus | one global \`:focus-visible\` outline (2px \`--ring\`, offset 2). Never \`outline-none\`, never your own ring. |

Three global roles ship as utilities and you should use them: \`num\` on every numeric readout
(mono, tabular — numerals are never proportional), \`tabular\` for tabular figures without the
face switch (a sans subtitle carrying a count), and \`eyebrow\` for the mono ALL-CAPS section label.

${rules}

## Where the truth lives

Read \`styles.css\` and its imports (\`_ds_bundle.css\` carries the token layer verbatim from
\`grana.css\` and every compiled utility; \`fonts/fonts.css\` the faces) for the full token set,
and each component's \`components/<group>/<Name>/<Name>.prompt.md\` for its props, its
recipe notes and worked examples sliced from its story. \`guidelines/\` carries the design
rules behind the numbers (${guidelineFiles.length} doc(s), see \`guidelines/index.md\`). The
stylesheet is authoritative; this page is a summary.

## Where things are

- \`_ds_bundle.js\` — the whole-DS bundle at the project root; every component and helper lands on \`window.${globalName}\`. First line is a \`/* @ds-bundle: … */\` metadata header.
- \`styles.css\` — the single stylesheet entry (\`@import\`s \`fonts/fonts.css\` then \`_ds_bundle.css\`). Link this one file.
- \`components/<group>/<Name>/<Name>.prompt.md\` (props + recipe + examples), \`<Name>.d.ts\` (types for every export of the item), \`<Name>.html\` (the story page, live), \`<Name>.jsx\` (the window re-export).
- \`fonts/\` — the ten woff2 faces + \`fonts.css\`.
- \`guidelines/\` — ${guidelineFiles.map((f) => `\`${f}\``).join(', ')}.

Loading in a page of your own (React must be on the page first):

\`\`\`html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
\`\`\`

Mount into a dedicated child node (e.g. \`<div id="ds-root">\`), not the host page's own React
root, so the two trees don't collide.

## Components (${comps.length} items, ${comps.reduce((n, c) => n + c.exports.filter((e) => e.kind === 'component').length, 0)} components, grouped as in the Design System pane)

${index}

_Stylesheet: ${cssInfo.candidates} candidate classes scanned from ${cssInfo.files} files, ${(cssInfo.bytes / 1024).toFixed(0)} KB compiled._
`;
  if (readme.length > 31_900) console.error(`  ! README.md is ${readme.length} chars — the app inlines only the first 32,000 into the agent prompt; the tail (the component index) gets cut`);
  writeFileSync(join(out, 'README.md'), readme);
  return readme.length;
}
