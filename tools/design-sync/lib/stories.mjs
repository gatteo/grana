// Stories are the previews. `playground/stories/<item>.stories.tsx` default-exports a page of
// <Story title=…> sections; the card renders that page (through lib/story-shim.tsx) and the
// .prompt.md examples are sliced from the same file. Items without a story of their own point
// at another item's story with `cards.<item>.story` (+ `only` to keep the relevant sections).
import { build } from 'esbuild';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SyntaxKind } from 'ts-morph';
import { REPO, TOOL } from './common.mjs';
import { aliasPlugin, reactShim, sharedBuildOptions } from './bundle.mjs';
import { getProject } from './dts.mjs';

const STORIES = join(REPO, 'playground', 'stories');
const OWNED = join(TOOL, 'previews');

/** The story file for an item: config override → its own story → an owned preview → null. */
export function storyFileFor(item, cardCfg) {
  const id = cardCfg?.story ?? item.name;
  for (const p of [join(OWNED, `${id}.stories.tsx`), join(STORIES, `${id}.stories.tsx`)]) {
    if (existsSync(p)) return p;
  }
  return null;
}

const unquote = (s) => {
  const t = s.trim();
  if (/^["'`]/.test(t)) return t.slice(1, -1);
  if (t.startsWith('{')) return unquote(t.slice(1, -1));
  return t;
};

const dedent = (text) => {
  const lines = text.replace(/^\n+|\s+$/g, '').split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => /^\s*/.exec(l)[0].length));
  return lines.map((l) => l.slice(Number.isFinite(indent) ? indent : 0)).join('\n');
};

const parsed = new Map();

/**
 * @returns {{ sections: {title, note, jsx}[], helpers: string, composes: string[], imports: string[] }}
 * sections = every <Story> in document order; helpers = top-level code that is neither an
 * import nor the default export (the consts and local components the sections reference).
 */
export function parseStory(file) {
  if (parsed.has(file)) return parsed.get(file);
  const project = getProject();
  const sf = project.getSourceFile(file) ?? project.addSourceFileAtPath(file);
  const sections = [];
  for (const el of sf.getDescendantsOfKind(SyntaxKind.JsxElement)) {
    const open = el.getOpeningElement();
    if (open.getTagNameNode().getText() !== 'Story') continue;
    const attr = (n) => open.getAttribute(n)?.getInitializer?.()?.getText();
    const title = attr('title');
    if (!title) continue;
    const inner = el.getText().slice(open.getText().length, -el.getClosingElement().getText().length);
    sections.push({ title: unquote(title), note: attr('note') ? unquote(attr('note')) : '', jsx: dedent(inner) });
  }
  const helpers = [];
  const composes = new Set();
  const imports = [];
  for (const st of sf.getStatements()) {
    if (st.getKind() === SyntaxKind.ImportDeclaration) {
      const spec = st.getModuleSpecifierValue();
      imports.push(st.getText());
      if (spec.startsWith('@/registry/grana/ui/')) {
        for (const n of st.getNamedImports()) if (!n.isTypeOnly()) composes.add(n.getName());
      }
      continue;
    }
    if (st.getKind() === SyntaxKind.ExportAssignment) continue;
    if (st.getKind() === SyntaxKind.FunctionDeclaration && st.isDefaultExport()) continue;
    helpers.push(st.getText());
  }
  const out = { sections, helpers: helpers.join('\n\n'), composes: [...composes], imports };
  parsed.set(file, out);
  return out;
}

/** `@/registry/grana/ui/*` and `@/lib/utils` → the bundle global; the story helper → the shim. */
function granaGlobalPlugin(globalName) {
  return {
    name: 'grana-global',
    setup(b) {
      b.onResolve({ filter: /^@\/(registry\/grana\/ui\/|lib\/utils$)/ }, () => ({ path: 'grana-global', namespace: 'grana' }));
      b.onLoad({ filter: /^grana-global$/, namespace: 'grana' }, () => ({ loader: 'js', contents: `module.exports = window.${globalName};` }));
      b.onResolve({ filter: /^@\/playground\/lib\/story$/ }, () => ({ path: join(TOOL, 'lib', 'story-shim.tsx') }));
    },
  };
}

/**
 * Stories name textures the way the playground serves them — `/img/dune-2.jpg`, absolute from the
 * dev server's root. Inside a bundle nothing is at the root: a card sits three folders deep and
 * the review page sits at the top. So every `/img/…` literal in the compiled preview becomes a
 * lookup against `window.__dsImgBase`, which each page sets to its own depth. Without this the
 * canvases render as empty washes and the whole marketing group looks broken.
 */
function rebaseImages(file) {
  const src = readFileSync(file, 'utf8');
  const out = src.replace(/(["'])\/img\/([A-Za-z0-9._\-/]+)\1/g,
    (_m, q, path) => `(window.__dsImgBase||"/")+${q}img/${path}${q}`);
  if (out !== src) writeFileSync(file, out);
  return (src.match(/["']\/img\//g) ?? []).length;
}

/** Compile one story file → `_preview/<Name>.js` (IIFE assigning `__dsPreview`, `.default` = the page). */
export async function compilePreview({ entry, outFile, globalName }) {
  try {
    await build({
      ...sharedBuildOptions(),
      entryPoints: [entry],
      outfile: outFile,
      format: 'iife',
      globalName: '__dsPreview',
      plugins: [reactShim, granaGlobalPlugin(globalName), aliasPlugin],
      logLevel: 'silent',
    });
    rebaseImages(outFile);
    return { ok: true };
  } catch (e) {
    const err = e?.errors?.[0];
    const loc = err?.location;
    return { ok: false, error: `${err?.text ?? e?.message ?? e}${loc ? ` (${loc.file}:${loc.line}:${loc.column})` : ''}` };
  }
}
