// salve-icons · build
// Source of truth: src/icons/*.svg (+ src/meta.json for categories and tags).
// Outputs, all from the same source:
//   dist/svg/<name>.svg     standalone files
//   dist/sprite.svg         <symbol> sprite for <svg><use href="sprite.svg#name"/></svg>
//   dist/salve-icons.css    CSS mask classes: <i class="si si-name"></i>
//   dist/index.js (+ .d.ts) ES module: SVG strings + svg() helper
//   dist/element.js         <s-icon name="…"> web component
//   dist/icons.json         metadata (name, category, tags)
// Zero dependencies: Node 18+ only.

import { readFile, readdir, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));

export const DEFAULT_STROKE = 1.75;
const ATTRS = (stroke) =>
  `xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"`;

/** Reads every icon: [{ name, body, category, tags }] sorted by name. */
export async function loadIcons() {
  const dir = join(root, 'src', 'icons');
  const meta = JSON.parse(await readFile(join(root, 'src', 'meta.json'), 'utf8'));
  const byName = new Map(meta.map((m) => [m.name, m]));
  const files = (await readdir(dir)).filter((f) => f.endsWith('.svg')).sort();

  return Promise.all(
    files.map(async (file) => {
      const name = basename(file, '.svg');
      const raw = await readFile(join(dir, file), 'utf8');
      const body = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
      const info = byName.get(name) ?? { category: 'misc', tags: [] };
      return { name, body, category: info.category, tags: info.tags };
    }),
  );
}

const camel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()) + 'Icon'; // checkIcon, packageIcon (avoids reserved words)

// Encodes an SVG for a CSS url() without base64 (smaller, still readable)
const dataUri = (svg) =>
  `url("data:image/svg+xml,${svg
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ')}")`;

const CSS_BASE = `/* Base class: inherits color (currentColor) and size (1em) from the text around it */
.si {
  display: inline-block;
  flex-shrink: 0;
  inline-size: var(--si-size, 1em);
  block-size: var(--si-size, 1em);
  vertical-align: -0.125em; /* optical alignment with the text baseline */
  background-color: currentColor;
  -webkit-mask: var(--si-icon) center / contain no-repeat;
  mask: var(--si-icon) center / contain no-repeat;
  font-style: normal;
}

/* Inline <svg>, sprite and React usage: <svg class="si-svg"><use href="sprite.svg#check"/></svg> */
.si-svg {
  display: inline-block;
  flex-shrink: 0;
  inline-size: var(--si-size, 1em);
  block-size: var(--si-size, 1em);
  vertical-align: -0.125em;
  fill: none;
  stroke: currentColor;
  stroke-width: var(--si-stroke, ${DEFAULT_STROKE});
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* <s-icon> renders in its own shadow root; this only reserves space before it upgrades */
s-icon {
  display: inline-flex;
  inline-size: var(--si-size, 1em);
  block-size: var(--si-size, 1em);
  vertical-align: -0.125em;
}

/* Sizes */
.si-xs { --si-size: 0.75em; }
.si-sm { --si-size: 0.875em; }
.si-lg { --si-size: 1.25em; }
.si-xl { --si-size: 1.5em; }
.si-2x { --si-size: 2em; }

/* Motion (stops when the user prefers reduced motion) */
.si-spin { animation: si-spin 1s linear infinite; }
.si-pulse { animation: si-pulse 1.4s ease-in-out infinite; }
@keyframes si-spin { to { rotate: 1turn; } }
@keyframes si-pulse { 50% { opacity: 0.4; } }
@media (prefers-reduced-motion: reduce) {
  .si-spin, .si-pulse { animation: none; }
}

/* Flip for RTL-aware arrows: add .si-flip-rtl */
.si-flip-rtl:dir(rtl) { scale: -1 1; }

/* Windows High Contrast: keep icons visible in the forced text color */
@media (forced-colors: active) {
  .si { forced-color-adjust: none; background-color: CanvasText; }
}`;

/**
 * Builds the assets. Options:
 *   icons:  array of names to include (default: all)
 *   stroke: stroke width baked into CSS masks and standalone SVGs (default 1.75)
 *   outDir: output directory (default: <package>/dist)
 *   formats: subset of ['svg','sprite','css','js','json'] (default: all)
 */
export async function buildIcons({ icons: only, stroke = DEFAULT_STROKE, outDir = join(root, 'dist'), formats } = {}) {
  let icons = await loadIcons();
  if (only?.length) {
    const unknown = only.filter((n) => !icons.some((i) => i.name === n));
    if (unknown.length) throw new Error(`Unknown icon(s): ${unknown.join(', ')}`);
    icons = icons.filter((i) => only.includes(i.name));
  }
  const want = new Set(formats ?? ['svg', 'sprite', 'css', 'js', 'json']);
  const banner = `salve-icons v${pkg.version} · ${icons.length} icons · MIT`;
  const full = (i, s = stroke) => `<svg ${ATTRS(s)}>${i.body}</svg>`;

  await mkdir(outDir, { recursive: true });

  if (want.has('svg')) {
    const svgDir = join(outDir, 'svg');
    await rm(svgDir, { recursive: true, force: true });
    await mkdir(svgDir, { recursive: true });
    await Promise.all(icons.map((i) => writeFile(join(svgDir, `${i.name}.svg`), full(i) + '\n')));
  }

  if (want.has('sprite')) {
    // Symbols carry no stroke attributes so they inherit from the <svg> (.si-svg) using them
    const symbols = icons.map((i) => `<symbol id="${i.name}" viewBox="0 0 24 24">${i.body}</symbol>`).join('\n');
    await writeFile(
      join(outDir, 'sprite.svg'),
      `<!-- ${banner} -->\n<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols}\n</svg>\n`,
    );

    // In-document sprite: symbols prefixed with "si-" so they never clash with page ids.
    // External <use href="file.svg#x"> created at runtime makes browsers re-request the
    // file for every new element (slow when the server sends max-age=0); referencing an
    // inline sprite (#si-x) costs no requests at all.
    const inlineSymbols = icons
      .map((i) => `<symbol id="si-${i.name}" viewBox="0 0 24 24">${i.body}</symbol>`)
      .join('');
    const sheet = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-salve-sprite style="position:absolute;inline-size:0;block-size:0;overflow:hidden">${inlineSymbols}</svg>`;
    const spriteJs = `// ${banner}
// In-document sprite. No network requests, safe on the server.
//   import { injectSprite, useIcon } from "salve-icons/sprite";
//   injectSprite();                      // once, in the browser
//   el.innerHTML = useIcon("check");     // <svg class="si-svg"><use href="#si-check"/></svg>
// SSR: print spriteSheet once at the top of <body> instead of calling injectSprite().

/** The whole sprite as markup, hidden and with "si-" prefixed ids. */
export const spriteSheet = ${JSON.stringify(sheet)};

/** Inserts the sprite into the document once. Returns the <svg>, or null on the server. */
export function injectSprite(target) {
  if (typeof document === 'undefined') return null;
  const existing = document.querySelector('svg[data-salve-sprite]');
  if (existing) return existing;
  (target ?? document.body).insertAdjacentHTML('afterbegin', spriteSheet);
  return document.querySelector('svg[data-salve-sprite]');
}

/** The in-document reference for an icon: "#si-check". */
export const iconHref = (name) => '#si-' + name;

/** Markup for one icon that points at the in-document sprite. */
export function useIcon(name, { label, class: cls = 'si-svg' } = {}) {
  const a11y = label
    ? 'role="img" aria-label="' + String(label).replace(/"/g, '&quot;') + '"'
    : 'aria-hidden="true"';
  return '<svg class="' + cls + '" ' + a11y + ' focusable="false"><use href="#si-' + name + '"/></svg>';
}
`;
    const spriteDts = `// ${banner}
import type { IconName } from './index.js';

/** The whole sprite as markup, hidden and with "si-" prefixed ids (for SSR). */
export declare const spriteSheet: string;
/** Inserts the sprite into the document once; null on the server. */
export declare function injectSprite(target?: Element): SVGSVGElement | null;
/** "#si-<name>" */
export declare function iconHref(name: IconName): string;
/** <svg class="si-svg"><use href="#si-<name>"/></svg> */
export declare function useIcon(name: IconName, options?: { label?: string; class?: string }): string;
`;
    await writeFile(join(outDir, 'sprite.js'), spriteJs);
    await writeFile(join(outDir, 'sprite.d.ts'), spriteDts);
  }

  if (want.has('css')) {
    const rules = icons.map((i) => `.si-${i.name} { --si-icon: ${dataUri(full(i))}; }`).join('\n');
    await writeFile(
      join(outDir, 'salve-icons.css'),
      `/*! ${banner} */\n@layer salve.icons {\n${CSS_BASE}\n\n${rules}\n}\n`,
    );
  }

  if (want.has('js')) {
    const lines = icons.map((i) => `export const ${camel(i.name)} = ${JSON.stringify(i.body)};`);
    const map = icons.map((i) => `  ${JSON.stringify(i.name)}: ${camel(i.name)},`).join('\n');
    const js = `// ${banner}
// Each named export is the icon's inner SVG markup (tree-shakable).
${lines.join('\n')}

/** Every icon by name: { "arrow-right": "<path …/>", … } */
export const icons = {
${map}
};

export const names = Object.keys(icons);

const ATTR = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== false).map(([k, v]) => \`\${k}="\${String(v).replace(/"/g, '&quot;')}"\`).join(' ');

/**
 * Returns a complete <svg> string. Safe on the server (no DOM needed).
 * @param {string} nameOrBody  icon name ("check") or a named export (checkIcon)
 * @param {{size?: number|string, strokeWidth?: number, label?: string, class?: string}} [options]
 *   size / strokeWidth: when given, also set as --si-size / --si-stroke so they win over salve-icons.css
 *   label: accessible name; without it the icon is decorative (aria-hidden)
 */
export function svg(nameOrBody, { size, strokeWidth, label, class: cls = 'si-svg' } = {}) {
  const body = icons[nameOrBody] ?? nameOrBody;
  if (typeof body !== 'string' || !body.startsWith('<')) throw new Error(\`salve-icons: unknown icon "\${nameOrBody}"\`);
  const style = [
    size != null && \`--si-size:\${typeof size === 'number' ? size + 'px' : size}\`,
    strokeWidth != null && \`--si-stroke:\${strokeWidth}\`,
  ].filter(Boolean).join(';');
  const attrs = ATTR({
    xmlns: 'http://www.w3.org/2000/svg', width: size ?? 24, height: size ?? 24, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': strokeWidth ?? ${DEFAULT_STROKE},
    'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls, style: style || undefined,
    role: label ? 'img' : undefined, 'aria-label': label, 'aria-hidden': label ? undefined : 'true',
    focusable: 'false',
  });
  return \`<svg \${attrs}>\${body}</svg>\`;
}

export default icons;
`;
    const dts = `// ${banner}
export type IconName =
${icons.map((i) => `  | ${JSON.stringify(i.name)}`).join('\n')};

${icons.map((i) => `export declare const ${camel(i.name)}: string;`).join('\n')}

export declare const icons: Record<IconName, string>;
export declare const names: IconName[];

export interface SvgOptions {
  /** width/height (default 24 attribute; 1em with salve-icons.css). When given, also sets --si-size */
  size?: number | string;
  /** stroke width (default ${DEFAULT_STROKE}). When given, also sets --si-stroke */
  strokeWidth?: number;
  /** accessible name; without it the icon is aria-hidden */
  label?: string;
  /** class attribute (default "si-svg") */
  class?: string;
}

export declare function svg(nameOrBody: IconName | string, options?: SvgOptions): string;
export default icons;
`;
    await writeFile(join(outDir, 'index.js'), js);
    await writeFile(join(outDir, 'index.d.ts'), dts);
    await copyFile(join(root, 'src', 'element.js'), join(outDir, 'element.js'));

    // React: server-component friendly (no hooks, no "use client"), tree-shakable named components
    const pascal = (name) => camel(name).replace(/^./, (c) => c.toUpperCase());
    const reactJs = `// ${banner}
// React components. No hooks and no "use client": they render in Server Components,
// SSR and the client alike. Requires react >= 17 (peer dependency).
import { createElement } from 'react';
import { icons, ${icons.map((i) => camel(i.name)).join(', ')} } from './index.js';

const isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';

function render(body, { size, strokeWidth, label, className, style, ...rest }) {
  const vars = {};
  if (size != null) vars['--si-size'] = typeof size === 'number' ? size + 'px' : size;
  if (strokeWidth != null) vars['--si-stroke'] = strokeWidth;
  return createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size ?? '1em',
    height: size ?? '1em',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: strokeWidth ?? ${DEFAULT_STROKE},
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: className ? 'si-svg ' + className : 'si-svg',
    style: size != null || strokeWidth != null ? { ...vars, ...style } : style,
    role: label ? 'img' : undefined,
    'aria-label': label,
    'aria-hidden': label ? undefined : true,
    focusable: 'false',
    ...rest,
    dangerouslySetInnerHTML: { __html: body },
  });
}

/** <Icon name="check" /> — pick by name (includes every icon in the bundle). */
export function Icon({ name, ...props }) {
  const body = icons[name];
  if (!body) {
    if (isDev) console.warn(\`salve-icons: unknown icon "\${name}"\`);
    return null;
  }
  return render(body, props);
}

// Named components — import only what you use: import { CheckIcon } from "salve-icons/react"
${icons.map((i) => `export function ${pascal(i.name)}(props) { return render(${camel(i.name)}, props); }`).join('\n')}
`;
    const reactDts = `// ${banner}
import type { ReactElement, SVGProps } from 'react';
import type { IconName } from './index.js';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'strokeWidth'> {
  /** width/height; default 1em (follows font-size) */
  size?: number | string;
  /** stroke width; default ${DEFAULT_STROKE} */
  strokeWidth?: number;
  /** accessible name; without it the icon is aria-hidden */
  label?: string;
}

export declare function Icon(props: IconProps & { name: IconName }): ReactElement | null;
${icons.map((i) => `export declare function ${pascal(i.name)}(props: IconProps): ReactElement;`).join('\n')}
`;
    await writeFile(join(outDir, 'react.js'), reactJs);
    await writeFile(join(outDir, 'react.d.ts'), reactDts);
  }

  if (want.has('json')) {
    const json = icons.map(({ name, category, tags }) => ({ name, category, tags }));
    await writeFile(join(outDir, 'icons.json'), JSON.stringify(json, null, 2) + '\n');
  }

  return { count: icons.length, outDir };
}
