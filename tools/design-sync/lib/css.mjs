// The stylesheet: grana.css compiled by Tailwind v4 (@tailwindcss/node + the oxide scanner)
// over the component sources, the stories and the story shim, plus a safelist of the
// layout/typography/colour utilities a design agent reaches for. Fonts are split into
// fonts/fonts.css with bundle-relative urls; the rf profile pins its brand onto :root.
import { compile } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO, TOOL, ls } from './common.mjs';

export const GRANA_CSS = join(REPO, 'registry', 'grana', 'styles', 'grana.css');
const FONTS_DIR = join(REPO, 'public', 'fonts');

/** Directories the scanner reads for class candidates. */
export const SCAN_DIRS = [
  join(REPO, 'registry', 'grana', 'ui'),
  join(REPO, 'playground', 'stories'),
  join(REPO, 'playground', 'lib'),
  join(TOOL, 'lib'),
  join(TOOL, 'previews'),
].filter(existsSync);

// ── the safelist ──────────────────────────────────────────────────────────
// A precompiled Tailwind stylesheet is a CLOSED set: a utility that was never compiled does
// nothing in a design. The components and stories only use their own classes, so the
// vocabulary an agent needs for layout glue is declared here (brace-expanded by Tailwind's
// `@source inline()`). Arbitrary values (`h-[34px]`) exist only where a component uses them.
const SP = '0,px,0.5,1,1.5,2,2.5,3,3.5,4,5,6,7,8,9,10,11,12,14,16,20,24,28,32,36,40,44,48,56,64,72,80,96';
const THEME_COLORS = [
  'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
  'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
  'accent', 'accent-foreground', 'destructive', 'destructive-foreground', 'border', 'border-strong',
  'input', 'ring', 'faint', 'surface-2', 'canvas', 'canvas-deep', 'ink', 'ecru', 'ecru-deep', 'ochre',
  'ochre-dark', 'inverse', 'inverse-foreground', 'inverse-muted', 'inverse-line',
  'status-good', 'status-warning', 'status-serious', 'status-critical', 'status-info',
  'status-good-ink', 'status-warning-ink', 'status-serious-ink', 'status-critical-ink', 'status-info-ink',
  'exec-agent', 'exec-agent-soft', 'exec-human', 'exec-human-soft', 'exec-api', 'exec-api-soft',
  'exec-screen', 'exec-screen-soft', 'unit-demand', 'unit-piattaforma', 'unit-academy', 'unit-installatori',
  'stone-0', 'stone-50', 'stone-100', 'stone-200', 'stone-300', 'stone-400', 'stone-500', 'stone-550',
  'stone-600', 'stone-700', 'stone-800', 'stone-900', 'stone-950', 'transparent', 'current',
].join(',');
export const SAFELIST = [
  `{p,px,py,pt,pr,pb,pl,m,mx,my,mt,mr,mb,ml,gap,gap-x,gap-y,space-x,space-y}-{${SP}}`,
  `{-mt,-mb,-ml,-mr,-mx,-my}-{1,2,3,4}`,
  `{w,h,size,min-w,min-h,max-w,max-h}-{${SP},auto,full,fit,min,max}`,
  `{w,h}-{screen,dvh,svh,1/2,1/3,2/3,1/4,3/4,1/5,2/5,3/5,4/5}`,
  `max-w-{xs,sm,md,lg,xl,2xl,3xl,4xl,5xl,6xl,7xl,prose,none}`,
  `{flex,grid,block,inline,inline-block,inline-flex,inline-grid,hidden,contents}`,
  `flex-{row,row-reverse,col,col-reverse,wrap,nowrap,1,auto,none,initial}`,
  `{grow,grow-0,shrink,shrink-0,basis-0,basis-full}`,
  `items-{start,center,end,baseline,stretch}`, `justify-{start,center,end,between,around,evenly,stretch}`,
  `self-{start,center,end,stretch,auto,baseline}`, `place-items-{center,start}`, `content-{start,center}`,
  `{,sm:,md:,lg:}grid-cols-{1,2,3,4,5,6,12}`, `col-span-{1,2,3,4,5,6,full}`, `grid-rows-{1,2,3,4}`, `row-span-{1,2,3}`,
  `grid-cols-{none,subgrid}`, `grid-flow-{row,col}`, `auto-rows-{min,max,fr}`,
  `text-{2xs,xs,13,sm,base,lg,xl,2xl,3xl,4xl,5xl,metric}`, `font-{normal,medium,semibold,bold}`,
  `font-{sans,mono,serif,display,voice}`, `font-weight-voice`,
  `leading-{none,tight,snug,normal,relaxed,loose}`, `tracking-{tighter,tight,normal,wide,wider}`,
  `{uppercase,lowercase,capitalize,normal-case}`, `text-{left,center,right,start,end}`,
  `{truncate,text-ellipsis,text-clip,whitespace-nowrap,whitespace-normal,whitespace-pre-wrap,text-balance,text-pretty,break-words,break-all}`,
  `{underline,no-underline,line-through,underline-offset-2,underline-offset-4,decoration-stone-400}`,
  `{tabular-nums,num,tabular,eyebrow,grain,sr-only,not-sr-only}`,
  `align-{baseline,top,middle,bottom}`, `list-{none,disc,decimal,inside,outside}`,
  `text-{${THEME_COLORS}}`, `bg-{${THEME_COLORS}}`, `border-{${THEME_COLORS}}`,
  `{hover:,group-hover:,aria-[current]:,aria-selected:,data-[state=active]:}bg-{accent,muted,card,canvas-deep,stone-50,stone-100,stone-200}`,
  `hover:text-{foreground,destructive,muted-foreground}`, `hover:border-{stone-400,border-strong,foreground}`,
  `hover:{underline,bg-stone-800,decoration-foreground}`,
  `{fill,stroke}-{current,foreground,muted-foreground,faint,stone-400}`,
  `border{,-t,-b,-l,-r,-x,-y}`, `border{,-t,-b,-l,-r}-{0,2}`, `border-{solid,dashed,dotted,none}`,
  `divide-{y,x,border,stone-200}`, `divide-y-0`, `outline-{none,ring}`, `ring-{0,1,2,ring,border}`,
  `rounded-{xs,sm,md,lg,xl,full,none}`, `rounded-{t,b,l,r,tl,tr,bl,br}-{xs,sm,md,lg,full}`,
  `shadow-{card,panel,none}`, `opacity-{0,25,40,50,60,70,80,90,100}`,
  `overflow-{hidden,auto,visible,clip,scroll,x-auto,y-auto,x-hidden,y-hidden}`,
  `{relative,absolute,fixed,sticky,static}`, `{inset-0,inset-x-0,inset-y-0,top-0,right-0,bottom-0,left-0}`,
  `{top,right,bottom,left}-{1,2,3,4,6,8,full,1/2}`, `z-{0,10,20,30,40,50}`,
  `{cursor-pointer,cursor-default,cursor-not-allowed,select-none,select-text,pointer-events-none,pointer-events-auto}`,
  `transition-{colors,opacity,all,transform,none}`, `duration-{100,120,150,200,300}`, `ease-{out,in,in-out,linear}`,
  `{animate-dot-pulse,animate-pulse,animate-spin}`,
  `aspect-{square,video,auto}`, `object-{cover,contain,center,top}`, `{mx-auto,ml-auto,mr-auto,mt-auto,mb-auto}`,
  `order-{first,last,1,2,3}`, `{backdrop-blur-sm,backdrop-blur-md,backdrop-blur-lg}`,
  `{first:border-t-0,last:border-b-0,first:pt-0,last:pb-0,even:bg-muted,odd:bg-card}`,
  `{line-clamp-1,line-clamp-2,line-clamp-3}`, `{resize-none,appearance-none,scroll-smooth,snap-x,snap-start}`,
  `{isolate,invisible,visible,collapse}`, `{prose,lead}`,
  `{sm:,md:,lg:}{flex,hidden,block,grid,flex-row,flex-col,items-center,justify-between}`,
  `{sm:,md:,lg:}{p,px,py,gap}-{2,3,4,5,6,8,10,12}`,
];

/** Parse the `[data-brand="rf"]` blocks out of grana.css so the rf bundle is RF by default. */
function brandPin(granaCss, brand) {
  if (brand !== 'rf') {
    return `\n/* @ds-brand-pin: ${brand} — grana.css already defaults to the Luminars brand; nothing to pin. */\n`;
  }
  const block = /\[data-brand="rf"\]\s*\{([^}]*)\}/.exec(granaCss)?.[1];
  const appRule = /\[data-brand="rf"\]\[data-surface="app"\][^{]*\{([^}]*)\}/.exec(granaCss)?.[1];
  const root = /:root\s*\{([\s\S]*?)\n\}/.exec(granaCss)?.[1] ?? '';
  const shadowCard = /--shadow-card:\s*([^;]+);/.exec(root)?.[1]?.trim();
  const shadowPanel = /--shadow-panel:\s*([^;]+);/.exec(root)?.[1]?.trim();
  if (!block) throw new Error('brandPin: could not find the [data-brand="rf"] block in grana.css');
  const decls = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split(';').map((d) => d.trim()).filter(Boolean).map((d) => `  ${d};`).join('\n');
  return `
/* @ds-brand-pin: rf — this bundle renders Revenue Farm even when <html> carries no data-brand.
 * The declarations below are copied from grana.css's [data-brand="rf"] blocks onto :root; an
 * explicit data-brand / data-surface attribute on <html> or a wrapper still wins. */
:root {
${decls(block)}
}
${appRule ? `:root {\n${decls(appRule)}\n}\n` : ''}${shadowCard && shadowPanel ? `[data-surface="marketing"] {\n  --shadow-card: ${shadowCard};\n  --shadow-panel: ${shadowPanel};\n}\n` : ''}`;
}

/**
 * Compile and write `_ds_bundle.css`, `fonts/fonts.css` (+ the woff2s) and `styles.css`.
 * @returns {{ candidates: number, files: number, bytes: number, fontFaces: number, fontFiles: string[] }}
 */
export async function buildCss({ out, brand }) {
  const cacheDir = join(TOOL, '.cache');
  mkdirSync(cacheDir, { recursive: true });
  const entry = [
    `@import ${JSON.stringify(GRANA_CSS)};`,
    ...SCAN_DIRS.map((d) => `@source ${JSON.stringify(d)};`),
    ...SAFELIST.map((s) => `@source inline(${JSON.stringify(s)});`),
  ].join('\n') + '\n';
  writeFileSync(join(cacheDir, `entry-${brand}.css`), entry);
  const compiler = await compile(entry, { base: cacheDir, onDependency: () => {} });
  const scanner = new Scanner({ sources: compiler.sources });
  const candidates = scanner.scan();
  let css = compiler.build(candidates);

  // Fonts: every @font-face leaves the bundle css for fonts/fonts.css, urls made relative.
  const faces = [];
  css = css.replace(/@font-face\s*\{[^}]*\}/g, (m) => { faces.push(m); return ''; });
  const fontsOut = join(out, 'fonts');
  mkdirSync(fontsOut, { recursive: true });
  const fontFiles = [];
  if (existsSync(FONTS_DIR)) {
    for (const f of ls(FONTS_DIR)) {
      if (!/\.(woff2?|ttf|otf)$/i.test(f)) continue;
      cpSync(join(FONTS_DIR, f), join(fontsOut, f));
      fontFiles.push(f);
    }
  }
  const fontCss = faces.map((f) => f.replace(/url\(\s*["']?\/fonts\/([^"')]+)["']?\s*\)/g, 'url("./$1")')).join('\n');
  writeFileSync(join(fontsOut, 'fonts.css'),
    `/* Grana faces — copied from public/fonts; urls are relative to this file. */\n${fontCss}\n`);

  // Strip dangling /fonts urls elsewhere (none expected) and pin the brand.
  const granaCss = readFileSync(GRANA_CSS, 'utf8');
  css = `/* Grana — registry/grana/styles/grana.css compiled by Tailwind v4 for the ${brand} bundle.\n` +
    ` * The token layer (:root …) is verbatim; the utility layer holds every class the components and\n` +
    ` * their stories use plus the safelisted layout/typography/colour vocabulary (see README.md).\n` +
    ` * Fonts live in ./fonts/fonts.css (styles.css imports both). */\n` +
    css.replace(/\n{3,}/g, '\n\n') +
    brandPin(granaCss, brand) +
    `\n/* The product reads at 14px (grana.css scopes this to [data-surface="app"] on <html>); a design\n` +
    ` * without the attribute is still a product surface. */\n` +
    `html:not([data-surface="marketing"]) body { font-size: 14px; line-height: 1.45; }\n`;
  writeFileSync(join(out, '_ds_bundle.css'), css);
  writeFileSync(join(out, 'styles.css'), '@import "./fonts/fonts.css";\n@import "./_ds_bundle.css";\n');
  return { candidates: candidates.length, files: scanner.files.length, bytes: Buffer.byteLength(css), fontFaces: faces.length, fontFiles };
}
