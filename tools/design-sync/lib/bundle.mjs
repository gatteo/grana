// esbuild: the registry → ONE browser global (window.Grana) with React external, the
// vendored React runtime, and the `/* @ds-bundle: {…} */` first-line header the
// claude.ai/design app parses.
import { build } from 'esbuild';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { IIFE_IMPORT_META_DEFINE, REPO, sha } from './common.mjs';

export const NODE_MODULES = join(REPO, 'node_modules');

// react / react-dom / react-is / scheduler → the window globals the page already holds.
// The jsx-runtime shim lifts `key` into the createElement config and SPREADS static
// children arrays (jsxs) so React does not warn "missing key" on every static list.
export const reactShim = {
  name: 'react-global',
  setup(b) {
    b.onResolve({ filter: /^react(\/(jsx-(dev-)?runtime|compiler-runtime))?$/ }, () => ({ path: 'react-shim', namespace: 'shim' }));
    b.onResolve({ filter: /^react-dom(\/client)?$/ }, () => ({ path: 'react-dom-shim', namespace: 'shim' }));
    b.onResolve({ filter: /^react-is$/ }, () => ({ path: 'react-is-shim', namespace: 'shim' }));
    b.onResolve({ filter: /^scheduler(\/|$)/ }, () => ({ path: 'scheduler-shim', namespace: 'shim' }));
    b.onLoad({ filter: /^react-shim$/, namespace: 'shim' }, () => ({
      loader: 'js',
      contents: `var R=window.React;
function np(p,k){var o={};for(var x in p)if(x!=="children")o[x]=p[x];if(k!==void 0)o.key=k;return o}
function jsx(t,p,k){var c=p&&p.children;return c===void 0?R.createElement(t,np(p,k)):R.createElement(t,np(p,k),c)}
function jsxs(t,p,k){return R.createElement.apply(R,[t,np(p,k)].concat(p.children))}
module.exports=R;
module.exports.jsx=jsx;module.exports.jsxs=jsxs;module.exports.jsxDEV=function(t,p,k,s){return(s?jsxs:jsx)(t,p,k)};
module.exports.Fragment=R.Fragment;`,
    }));
    b.onLoad({ filter: /^react-dom-shim$/, namespace: 'shim' }, () => ({
      loader: 'js',
      contents: 'var D=window.ReactDOM,n=function(){};' +
        'module.exports=Object.assign({preload:n,preinit:n,preconnect:n,prefetchDNS:n,preloadModule:n,preinitModule:n},D);',
    }));
    b.onLoad({ filter: /^react-is-shim$/, namespace: 'shim' }, () => ({
      loader: 'js',
      contents: `var R=window.React;
var FWD=Symbol.for("react.forward_ref"),MEMO=Symbol.for("react.memo"),PORTAL=Symbol.for("react.portal"),LAZY=Symbol.for("react.lazy");
function tt(o){return o!=null&&typeof o==="object"?(R.isValidElement(o)?(o.type&&o.type.$$typeof)||o.type:o.$$typeof):undefined}
exports.typeOf=tt;exports.isElement=R.isValidElement;
exports.isValidElementType=function(t){return typeof t==="string"||typeof t==="function"||t===R.Fragment||t===R.Suspense||t===R.StrictMode||t===R.Profiler||(t!=null&&typeof t==="object"&&t.$$typeof!=null)};
exports.isFragment=function(o){return R.isValidElement(o)&&o.type===R.Fragment};
exports.isSuspense=function(o){return R.isValidElement(o)&&o.type===R.Suspense};
exports.isPortal=function(o){return o!=null&&o.$$typeof===PORTAL};
exports.isForwardRef=function(o){return tt(o)===FWD};exports.isMemo=function(o){return tt(o)===MEMO};exports.isLazy=function(o){return tt(o)===LAZY};
exports.isContextProvider=exports.isContextConsumer=exports.isProfiler=exports.isStrictMode=function(){return false};
exports.ForwardRef=FWD;exports.Memo=MEMO;exports.Portal=PORTAL;exports.Lazy=LAZY;
exports.Fragment=R.Fragment;exports.Suspense=R.Suspense;exports.StrictMode=R.StrictMode;exports.Profiler=R.Profiler;`,
    }));
    b.onLoad({ filter: /^scheduler-shim$/, namespace: 'shim' }, () => ({
      loader: 'js',
      contents: 'throw new Error("[SCHEDULER_MISSING] a module imports scheduler directly — react-dom leaked into the bundle");',
    }));
  },
};

const EXTS = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
const isFile = (p) => { try { return statSync(p).isFile(); } catch { return false; } };

/** `@/x` → `<repo>/x` (the tsconfig `paths` alias). */
export const aliasPlugin = {
  name: 'grana-alias',
  setup(b) {
    b.onResolve({ filter: /^@\// }, (a) => {
      const stem = join(REPO, a.path.slice(2));
      for (const ext of EXTS) if (isFile(stem + ext)) return { path: stem + ext };
      return undefined;
    });
  },
};

export const sharedBuildOptions = () => ({
  bundle: true,
  platform: 'browser',
  target: 'es2020',
  nodePaths: [NODE_MODULES],
  metafile: true,
  jsx: 'automatic',
  charset: 'utf8',
  loader: { '.svg': 'dataurl', '.png': 'dataurl', '.woff': 'dataurl', '.woff2': 'dataurl' },
  minify: false,
  define: { 'process.env.NODE_ENV': '"development"', __DEV__: 'true', ...IIFE_IMPORT_META_DEFINE },
  logLevel: 'warning',
});

// React 19 ships no UMD — bundle react + react-dom(/client) to _vendor/react.js ourselves,
// assigned under a temp global then ||=-merged so a host page's React isn't clobbered.
export async function vendorReact(out) {
  const noClobber =
    ';window.React=window.React||window.__dsReact;' +
    'window.ReactDOM=window.ReactDOM||window.__dsReactDOM;' +
    'try{delete window.__dsReact;delete window.__dsReactDOM;}catch(e){}';
  await build({
    stdin: {
      contents:
        'window.__dsReact=require("react");' +
        'window.__dsReactDOM=require("react-dom");' +
        'try{Object.assign(window.__dsReactDOM,require("react-dom/client"))}catch(e){}',
      resolveDir: NODE_MODULES,
    },
    bundle: true, format: 'iife', outfile: join(out, '_vendor', 'react.js'),
    platform: 'browser',
    define: { 'process.env.NODE_ENV': '"development"', ...IIFE_IMPORT_META_DEFINE },
    logLevel: 'error', footer: { js: noClobber },
  });
  writeFileSync(join(out, '_vendor', 'react-dom.js'), '/* merged into react.js */\n');
  const v = JSON.parse(readFileSync(join(NODE_MODULES, 'react', 'package.json'), 'utf8')).version;
  return v;
}

/** The npm package that owns a metafile input path (pnpm-aware: the LAST node_modules segment). */
function pkgOf(p) {
  const segs = p.split('node_modules/');
  if (segs.length < 2) return null;
  const tail = segs[segs.length - 1];
  if (tail.startsWith('.pnpm')) return null;
  const parts = tail.split('/');
  return parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
}

/**
 * Bundle every registry item's value exports into one IIFE. The entry is EXPLICIT named
 * re-exports (not `export *`) so a name exported by two files fails the build loudly instead
 * of being dropped as an ambiguous star re-export.
 * @param {{ out: string, globalName: string, entries: {file: string, names: string[]}[] }} o
 */
export async function bundleGrana({ out, globalName, entries }) {
  const lines = entries.map((e) => `export { ${e.names.join(', ')} } from ${JSON.stringify(e.file)};`);
  lines.push(`export { cn } from ${JSON.stringify(join(REPO, 'lib', 'utils.ts'))};`);
  const hook = join(REPO, 'registry', 'grana', 'hooks', 'use-mobile.ts');
  if (existsSync(hook)) lines.push(`export { useIsMobile } from ${JSON.stringify(hook)};`);
  const entryPath = join(out, '.bundle-entry.ts');
  writeFileSync(entryPath, lines.join('\n') + '\n');
  const bundleJs = join(out, '_ds_bundle.js');
  const r = await build({
    ...sharedBuildOptions(),
    entryPoints: [entryPath],
    format: 'iife',
    globalName,
    outfile: bundleJs,
    plugins: [aliasPlugin, reactShim],
  });
  const REACT = new Set(['react', 'react-dom', 'react-is']);
  const inlinedExternals = [...new Set(Object.keys(r.metafile.inputs).map(pkgOf).filter((p) => p && !REACT.has(p)))].sort();
  return { bundleJs, bytes: statSync(bundleJs).size, inlinedExternals, warnings: r.warnings };
}

// Prepend the first-line header. A star-slash inside the JSON is escaped so the comment survives.
export function stampHeader(bundleJs, { namespace, components, inlinedExternals }) {
  const body = readFileSync(bundleJs, 'utf8');
  const out = dirname(bundleJs);
  const sourceHashes = {};
  for (const c of components) {
    const base = `components/${c.group}/${c.name}/${c.name}`;
    for (const ext of ['.jsx', '.d.ts', '.prompt.md']) {
      const rel = base + ext;
      if (existsSync(join(out, rel))) sourceHashes[rel] = sha(readFileSync(join(out, rel)), 12);
    }
  }
  const meta = {
    namespace,
    components: components.map((c) => ({ name: c.name, sourcePath: `components/${c.group}/${c.name}/${c.name}.jsx` })),
    sourceHashes,
    inlinedExternals,
    builtBy: 'grana-design-sync',
  };
  writeFileSync(bundleJs, `/* @ds-bundle: ${JSON.stringify(meta).replace(/\*\//g, '*\\/')} */\n` + body);
  return meta;
}
