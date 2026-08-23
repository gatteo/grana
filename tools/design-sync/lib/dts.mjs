// Type extraction with ts-morph (the real TS checker) over the registry sources.
// Per file: the value exports (components, helper functions, cva variant fns), each
// component's resolved props body (the literal unions from cva's VariantProps are the
// valuable part), and the file's recipe comments for .prompt.md.
import { join } from 'node:path';
import { Node, Project, ts } from 'ts-morph';
import { REPO } from './common.mjs';

let project = null;

/** One Project for the whole run — tsconfig paths give `@/` resolution. */
export function getProject() {
  if (project) return project;
  project = new Project({
    tsConfigFilePath: join(REPO, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { skipLibCheck: true, noEmit: true, strict: false },
  });
  project.addSourceFilesAtPaths([
    `${REPO}/registry/grana/ui/*.tsx`,
    `${REPO}/registry/grana/hooks/*.ts`,
    `${REPO}/lib/utils.ts`,
  ]);
  return project;
}

const KEEP_PROP = /^(children|className|style|render|id)$/;
const KEEP_ALIAS = /^(ReactNode|ReactElement|CSSProperties|JSX\.Element|Key|Ref|RefObject)$/;
const isReactLib = (fp) => fp.includes('/@types/react/') || fp.includes('/typescript/lib/');

function declFile(p) {
  const d = p.getDeclarations()[0];
  return d ? d.getSourceFile().getFilePath() : '';
}
const isOwn = (fp) => fp.startsWith(REPO + '/') && !fp.includes('/node_modules/');

// Keep: grana-declared props always; library props (Base UI, cva, sonner…) unless they are
// DOM event/aria noise; React/DOM props only when structural (KEEP_PROP).
function keepProp(p) {
  const name = p.getName();
  if (KEEP_PROP.test(name)) return true;
  const fp = declFile(p);
  if (!fp) return true;
  if (isOwn(fp)) return true;
  if (isReactLib(fp)) return false;
  if (/^(on[A-Z]|aria-|data-)/.test(name)) return false;
  return true;
}

function typeText(t, at, depth = 0) {
  const alias = t.getAliasSymbol()?.getName();
  if (alias && KEEP_ALIAS.test(alias)) return `React.${alias}`;
  if (t.isBoolean()) return 'boolean';
  let s;
  if (t.isUnion()) {
    const parts = t.getUnionTypes().map((u) => typeText(u, at, depth + 1)).filter((p) => p !== 'undefined');
    let uniq = [...new Set(parts)];
    if (uniq.length === 2 && uniq.includes('true') && uniq.includes('false')) return 'boolean';
    if (uniq.includes('true') && uniq.includes('false')) uniq = [...new Set(uniq.map((u) => (u === 'true' || u === 'false' ? 'boolean' : u)))];
    if (uniq.includes('ReactPortal') && uniq.some((u) => u.startsWith('Iterable<ReactNode>'))) {
      const RN = /^(string|number|bigint|boolean|ReactPortal|Iterable<ReactNode>.*|ReactElement<.*|Promise<.*)$/;
      uniq = [...new Set([...uniq.filter((u) => !RN.test(u)), 'React.ReactNode'])];
    }
    if (uniq.length > 1) uniq = uniq.map((u) => (u.includes('=>') ? `(${u})` : u));
    if (uniq.length > 24) uniq = [...uniq.slice(0, 16), `(string & {}) /* +${uniq.length - 16} more */`];
    s = uniq.join(' | ');
  } else {
    s = t.getText(at, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)
      .replace(/import\("[^"]*"\)\./g, '');
  }
  return s.length > 240 ? 'unknown' : s;
}

function jsdocOf(decl) {
  const docs = decl.getJsDocs?.() ?? [];
  const d = docs[0]?.getDescription?.()?.trim();
  return d ? d.replace(/\s+/g, ' ') : '';
}

/** Props body lines for a component declaration (its first call signature's first param). */
function propsBody(decl) {
  const sig = decl.getType().getCallSignatures()[0];
  const p0 = sig?.getParameters()[0];
  if (!p0) return { lines: [], count: 0 };
  const type = p0.getTypeAtLocation(decl).getApparentType();
  const props = type.getProperties().filter(keepProp);
  // Own (grana-declared) props first — they are the API the design agent must see.
  props.sort((a, b) => {
    const ao = isOwn(declFile(a)) ? 0 : 1, bo = isOwn(declFile(b)) ? 0 : 1;
    return ao - bo || a.getName().localeCompare(b.getName());
  });
  const lines = [];
  let n = 0;
  for (const p of props) {
    if (++n > 48) { lines.push(`  // … ${props.length - 48} more inherited props omitted`); break; }
    const optional = p.hasFlags(ts.SymbolFlags.Optional) ? '?' : '';
    const pt = p.getTypeAtLocation(decl);
    const tt = typeText(pt, decl);
    const d = p.getDeclarations()[0];
    const doc = d?.getJsDocs?.()?.[0]?.getDescription()?.trim()
      ?? p.compilerSymbol.getDocumentationComment(undefined)?.[0]?.text;
    if (doc) lines.push(`  /** ${doc.replace(/\s+/g, ' ').slice(0, 160)} */`);
    const pn = p.getName();
    const key = /^[a-zA-Z_$][\w$]*$/.test(pn) ? pn : JSON.stringify(pn);
    lines.push(`  ${key}${optional}: ${tt};`);
  }
  return { lines, count: props.length };
}

/** Top-level block comments of the file — the recipe notes that explain the component. */
function recipeNotes(sf) {
  const notes = [];
  const seen = new Set();
  for (const st of sf.getStatements()) {
    for (const r of st.getLeadingCommentRanges()) {
      const text = r.getText();
      if (!text.startsWith('/*')) continue;
      const body = text.replace(/^\/\*+/, '').replace(/\*+\/$/, '')
        .split('\n').map((l) => l.replace(/^\s*\*\s?/, '').trimEnd()).join('\n').trim();
      if (body.length < 60 || seen.has(body)) continue;
      seen.add(body);
      notes.push(body.length > 1200 ? body.slice(0, 1200) + ' …' : body);
      if (notes.length >= 4) return notes;
    }
  }
  return notes;
}

/**
 * @returns {{ exports: {name, kind, doc, props:{lines,count}|null, typeText}[], notes: string[] }}
 * kind: 'component' (PascalCase callable), 'function' (camelCase callable), 'value' (other).
 * Type-only exports are skipped (they are not on the runtime global).
 */
export function analyzeFile(file) {
  const sf = getProject().getSourceFileOrThrow(file);
  const exports = [];
  for (const [name, decls] of sf.getExportedDeclarations()) {
    const d = decls.find((x) => Node.isVariableDeclaration(x) || Node.isFunctionDeclaration(x) || Node.isClassDeclaration(x));
    if (!d) continue; // type / interface / enum-less alias
    const t = d.getType();
    const callable = t.getCallSignatures().length > 0;
    const kind = callable && /^[A-Z]/.test(name) ? 'component' : callable ? 'function' : 'value';
    // JSDoc sits on the statement for `function X()` and on the VariableStatement for consts.
    const docNode = Node.isVariableDeclaration(d) ? d.getVariableStatement() : d;
    exports.push({
      name, kind,
      doc: docNode ? jsdocOf(docNode) : '',
      props: kind === 'component' ? propsBody(d) : null,
      typeText: kind === 'component' ? '' : typeText(t, d),
    });
  }
  return { exports, notes: recipeNotes(sf) };
}
