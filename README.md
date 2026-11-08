<div align="center">

# salve-icons

**English** · [Português](README.pt-BR.md)

**Icons that behave like text.**

292 stroke icons on a 24px grid, **social brands included**, made to go with [salve-css](https://github.com/juliocarneiro/salve-css). They inherit color and size from the text around them, sit on the baseline and work with or without JavaScript. React components are ready for **Server Components and SSR**.

`npm i salve-icons` · zero dependencies · React optional · MIT

</div>

---

## Contents

- [Why another icon library](#why-another-icon-library)
- [Installation](#installation)
- [Five ways to use them](#five-ways-to-use-them)
  - [1. CSS class](#1-css-class-simplest)
  - [2. React components](#2-react-components)
  - [3. SVG sprite](#3-svg-sprite)
  - [4. JavaScript module](#4-javascript-module)
  - [5. Web component](#5-web-component)
  - [Which one should I pick?](#which-one-should-i-pick)
- [SSR and Next.js](#ssr-and-nextjs)
- [Size, color and stroke](#size-color-and-stroke)
- [With salve-css](#with-salve-css)
- [Frameworks](#frameworks)
- [Accessibility](#accessibility)
- [Icon list](#icon-list)
- [CLI: a bundle with only the icons you use](#cli-a-bundle-with-only-the-icons-you-use)
- [Design guidelines](#design-guidelines)
- [Contributing an icon](#contributing-an-icon)
- [FAQ](#faq)

---

## Why another icon library

Icons tend to be more work than they should: aligning them with text, changing color on hover, resizing them inside buttons, choosing between an icon font, inline SVG or a sprite. salve-icons handles it like this:

| Pain | How salve-icons fixes it |
|---|---|
| Icon misaligned with the text | `vertical-align: -0.125em`, tuned to the baseline |
| Changing color needs another file | everything uses `currentColor`: the icon takes the text color, hover included |
| Fixed pixel sizes | `1em` by default: follows the `font-size` of where it sits |
| Blurry, inaccessible icon fonts | real SVG, crisp on any screen |
| Having to pick a single format | the same icon ships as a CSS class, React component, sprite, JS module and web component |
| Icons that break SSR or hydration | React components without hooks (they work in Server Components) and an `<s-icon>` with shadow DOM |
| An incomplete library, always missing "that one" icon | 292 icons in 18 categories, from arrows to weather, finance, dev and social brands |
| A heavy package | tree-shakable named exports, and a CLI that builds a CSS file with only your icons |
| Icons disappearing in Windows High Contrast | `forced-colors` rule included |
| Loading animations for people who want less motion | `.si-spin` stops with `prefers-reduced-motion` |

---

## Installation

**CDN**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/salve-icons/dist/salve-icons.css">
```

**npm**

```bash
npm i salve-icons
```

```js
import "salve-icons/css";                          // .si-* classes
import { CheckIcon, Icon } from "salve-icons/react"; // React components
import { svg, checkIcon } from "salve-icons";       // SVG strings
import "salve-icons/element";                      // <s-icon>
```

| Path | Contents |
|---|---|
| `salve-icons/css` | `dist/salve-icons.css`: `.si` and `.si-<name>` classes |
| `salve-icons/react` | `dist/react.js` (+ types): `<Icon name>` and one component per icon (`<CheckIcon />`) |
| `salve-icons/sprite` | `dist/sprite.js` (+ types): `injectSprite()`, `spriteSheet` and `useIcon()` for an in-page sprite |
| `salve-icons/sprite.svg` | `dist/sprite.svg`: every icon as a `<symbol>` (external file) |
| `salve-icons` | `dist/index.js` (+ types): SVG strings and the `svg()` helper |
| `salve-icons/element` | `dist/element.js`: the `<s-icon>` web component |
| `salve-icons/svg/<name>.svg` | individual SVG files |
| `salve-icons/icons.json` | metadata: name, category, tags |

---

## Five ways to use them

### 1. CSS class (simplest)

```html
<i class="si si-check" aria-hidden="true"></i>
<span class="si si-search" aria-hidden="true"></span>
```

Each icon is drawn with `mask-image` and filled with `currentColor`. No JavaScript and no extra files: a single CSS file (~12 KB gzip) brings every icon.

```html
<button class="btn">
  <i class="si si-plus" aria-hidden="true"></i>
  New project
</button>

<a href="/logout" class="text-danger">
  <i class="si si-log-out" aria-hidden="true"></i> Log out
</a>
```

### 2. React components

The most natural way in React and Next.js. Components **use no hooks and no `"use client"`**, so they render in Server Components, during SSR and on the client.

```jsx
import { CheckIcon, TrashIcon, GithubIcon, Icon } from "salve-icons/react";

<button className="btn"><CheckIcon /> Save</button>
<button className="btn tone-danger"><TrashIcon strokeWidth={2.25} /> Delete</button>
<a href="https://github.com/…"><GithubIcon size={20} label="GitHub" /></a>

<Icon name="sparkle" className="text-accent" size="2rem" />   {/* by name */}
```

| Prop | Default | Description |
|---|---|---|
| `size` | `1em` | number (px) or any CSS length |
| `strokeWidth` | `1.75` | stroke width |
| `label` | — | accessible name; without it the icon is `aria-hidden` |
| `className`, `style`, `onClick`… | — | any `<svg>` prop is passed through |

- **Tree-shaking:** import named components (`CheckIcon`) to ship only what you use. `<Icon name>` includes every icon in the bundle; use it when the name comes from data.
- The component name is the icon name in PascalCase + `Icon`: `arrow-right` → `ArrowRightIcon`, `x-twitter` → `XTwitterIcon`.
- TypeScript types are included, and `name` autocompletes in your editor.
- `react` is an optional *peer dependency*: if you don't use React, nothing extra gets installed.

### 3. SVG sprite

Best when you want to **control the stroke width** from CSS, or when a page uses many icons. Put the sprite **inside the page** once and point at it with `#si-<name>`: zero network requests, no matter how many icons you create later.

```js
import { injectSprite, useIcon } from "salve-icons/sprite";

injectSprite();                       // once, in the browser
button.innerHTML = useIcon("check");  // <svg class="si-svg"><use href="#si-check"/></svg>
```

```html
<svg class="si-svg" aria-hidden="true"><use href="#si-check"/></svg>
<svg class="si-svg" style="--si-stroke: 1.25"><use href="#si-heart"/></svg>
```

**SSR:** print `spriteSheet` once at the top of `<body>` instead of calling `injectSprite()` (in React: `<div dangerouslySetInnerHTML={{ __html: spriteSheet }} />`). In-page ids are prefixed with `si-`, so they never clash with ids on your page.

The salve-icons CSS already includes the `.si-svg` class (stroke, color and size). Without it, apply `fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round`.

> **Why not `<use href="/sprite.svg#check">`?** It works for icons that are in the HTML from the start. But every `<use>` that points at an *external* file and is created later (a modal, a filtered list, React re-renders) makes the browser request the file again. With the default headers of hosts like Vercel (`max-age=0, must-revalidate`) that's one round trip per icon, and the icon shows up late. If you do use the external file, serve it with a cache header such as `Cache-Control: public, max-age=31536000, immutable` (with a versioned file name). CSS classes, React components, the JS module and `<s-icon>` never have this issue: they draw the SVG in the page.

### 4. JavaScript module

For frameworks, server rendering, or when you want the SVG inline in the HTML.

```js
import { svg, icons, names, checkIcon, arrowRightIcon } from "salve-icons";

svg("check");                                   // "<svg … aria-hidden="true"><path …/></svg>"
svg("trash", { label: "Delete" });              // role="img" aria-label="Delete"
svg(arrowRightIcon, { size: 20, strokeWidth: 2 });

icons["map-pin"];   // the icon's inner markup
names;              // ["activity", "alarm-clock", …]
```

Named exports (`checkIcon`, `arrowRightIcon`…) are **tree-shakable**: your bundler includes only what you import.

| `svg()` option | Default | Description |
|---|---|---|
| `size` | `24` | `width`/`height`; when given, also becomes `--si-size` |
| `strokeWidth` | `1.75` | stroke width; when given, also becomes `--si-stroke` |
| `label` | — | accessible name; without it the icon is decorative (`aria-hidden`) |
| `class` | `"si-svg"` | `class` attribute |

TypeScript types are included. `IconName` is the union of every name, so your editor autocompletes and flags typos.

### 5. Web component

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/salve-icons/dist/element.js"></script>

<s-icon name="bell"></s-icon>
<s-icon name="trash" label="Delete"></s-icon>
<s-icon name="heart" stroke="1.25"></s-icon>
```

The SVG lives in a shadow DOM, but color (`currentColor`), `font-size`, `--si-size` and `--si-stroke` pass through by inheritance, so your CSS controls the icon from outside. This also avoids hydration errors in SSR frameworks. Attributes are reactive: changing `name` swaps the icon.

### Which one should I pick?

| Situation | Recommended |
|---|---|
| Static site, WordPress, prototype, "I just want it to work" | **CSS class** |
| React, Next.js, Remix, Server Components | **React components** |
| Many icons per page and adjustable stroke | **Sprite** |
| Vue, Svelte, Astro, SSR in general, SVG in the HTML | **JS module** |
| Several frameworks, micro-frontends, CMS-generated HTML | **Web component** |

---

## SSR and Next.js

Every format works with server rendering. Tested in a **Next.js 16 (App Router)** app with **Turbopack and with webpack**: the build passes, React hydrates without warnings and the console stays clean.

| Format | On the server | Note |
|---|---|---|
| CSS class | ✅ plain HTML | nothing to configure |
| React components | ✅ Server Components | no hooks, no `"use client"` |
| JS module (`svg()`) | ✅ string | ideal for Astro, Vue SSR, templates |
| Sprite | ✅ plain HTML | serve `sprite.svg` as a static file |
| Web component | ✅ safe to import on the server | the module does nothing on the server; the icon shows up when the JS loads |

**Next.js (App Router), from scratch:**

```bash
npm i salve-css salve-icons
```

```jsx
// app/layout.jsx
import "salve-css";
import "salve-icons/css";   // optional: only if you use the .si-* classes

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```jsx
// app/page.jsx (Server Component)
import { BellIcon, SearchIcon } from "salve-icons/react";

export default function Page() {
  return (
    <div className="input-group">
      <span><SearchIcon /></span>
      <input className="input" placeholder="Search" />
      <button className="btn btn-ghost btn-icon" aria-label="Notifications"><BellIcon /></button>
    </div>
  );
}
```

React components don't need `salve-icons/css`, because stroke and size come from attributes. With the CSS loaded, they also respect `--si-size` and `--si-stroke`.

**Using `<s-icon>` in Next.js:** import the module in a client component.

```jsx
"use client";
import "salve-icons/element";

export const Zap = () => <s-icon name="zap"></s-icon>;
```

---

## Size, color and stroke

**Size:** `1em` by default. Change the parent's `font-size`, use a size class or the variable:

```html
<i class="si si-star si-lg"></i>                <!-- 1.25em -->
<i class="si si-star" style="--si-size: 32px"></i>
<h2><i class="si si-zap"></i> Fast</h2>        <!-- grows with the heading -->
```

| Class | Size |
|---|---|
| `.si-xs` | 0.75em |
| `.si-sm` | 0.875em |
| (default) | 1em |
| `.si-lg` | 1.25em |
| `.si-xl` | 1.5em |
| `.si-2x` | 2em |

**Color:** always `currentColor`. Change the text color:

```html
<i class="si si-heart" style="color: crimson"></i>
<i class="si si-check-circle text-success"></i>   <!-- salve-css utility -->
```

**Stroke:** in the sprite, the JS module, React and the web component, the stroke width is adjustable (`--si-stroke`, `strokeWidth` or the `stroke` attribute). In CSS classes the stroke is baked in; for another value, build the CSS with the CLI and `--stroke`.

**Animation:**

```html
<i class="si si-loader si-spin" aria-hidden="true"></i>
<i class="si si-bell si-pulse" aria-hidden="true"></i>
```

With salve-css you also get its whole [motion module](https://github.com/juliocarneiro/salve-css#motion): `animate-wiggle`, `animate-bounce`, `hover-grow` and more work on icons too.

**Direction (RTL):** arrows that should flip in Arabic or Hebrew take `.si-flip-rtl`.

```html
<i class="si si-arrow-right si-flip-rtl"></i>
```

---

## With salve-css

The two libraries were made together:

- Icons inside `.btn` are spaced by the button's `gap` and sized to 1.15em; inside `.alert-icon` they're sized to the alert.
- salve-css tones and color utilities color the icons: `class="si si-alert-triangle text-warning"`.
- The icon CSS lives in the `salve.icons` layer, so your CSS wins here too.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/salve-css/dist/salve.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/salve-icons/dist/salve-icons.css">

<div class="alert tone-success" role="status">
  <i class="si si-check-circle alert-icon" aria-hidden="true"></i>
  <div><p class="alert-title">Payment confirmed</p></div>
</div>

<button class="btn btn-icon btn-ghost" aria-label="More options" data-tip="More options">
  <i class="si si-more-horizontal" aria-hidden="true"></i>
</button>
```

---

## Frameworks

**React / Next.js / Remix:** use the [React components](#2-react-components).

```jsx
import { CheckIcon } from "salve-icons/react";
<CheckIcon />
```

**Vue / Nuxt**

```vue
<script setup>
import { svg } from "salve-icons";
defineProps({ name: String, label: String });
</script>

<template>
  <span style="display: inline-flex" v-html="svg(name, { label, size: '1em' })" />
</template>
```

**Svelte / SvelteKit**

```svelte
<script>
  import { svg } from "salve-icons";
  export let name;
  export let label = undefined;
</script>

<span style="display: inline-flex">{@html svg(name, { label, size: "1em" })}</span>
```

**Astro** (renders on the server, zero client JS)

```astro
---
import { svg } from "salve-icons";
---
<button class="btn"><Fragment set:html={svg("plus", { size: "1em" })} /> New</button>
```

**Angular, Lit, any framework:** use the web component.

```js
import "salve-icons/element";
// <s-icon name="check"></s-icon>
```

In Vue, tell the compiler that `s-icon` is a custom element (`compilerOptions.isCustomElement: tag => tag === 's-icon'`). In Angular, add `CUSTOM_ELEMENTS_SCHEMA` to the component.

---

## Accessibility

- **Decorative icon** (text next to it): hide it from screen readers.
  ```html
  <button class="btn"><i class="si si-plus" aria-hidden="true"></i> Add</button>
  ```
- **Icon-only button:** the name goes on the button.
  ```html
  <button class="btn btn-icon" aria-label="Close"><i class="si si-x" aria-hidden="true"></i></button>
  ```
- **An icon that conveys information on its own:** use `label` (React / JS / web component), or `role="img"` + `aria-label`.
  ```html
  <s-icon name="alert-triangle" label="Warning"></s-icon>
  ```
- Don't convey state with the icon's color alone. Pair it with text.
- In Windows High Contrast, class-based icons use the system text color.

---

## Icon list

| Category | Count | Icons |
|---|---|---|
| **Arrows** | 27 | `arrow-down` `arrow-down-left` `arrow-down-right` `arrow-left` `arrow-left-right` `arrow-right` `arrow-up` `arrow-up-down` `arrow-up-left` `arrow-up-right` `chevron-down` `chevron-left` `chevron-right` `chevron-up` `chevrons-down` `chevrons-left` `chevrons-right` `chevrons-up` `chevrons-up-down` `corner-down-left` `external-link` `move` `redo` `refresh` `rotate-ccw` `rotate-cw` `undo` |
| **Interface** | 33 | `app-window` `circle` `columns` `droplet` `grip-vertical` `home` `infinity` `kanban` `layers` `layout-grid` `lightbulb` `list` `maximize` `menu` `minimize` `moon` `more-horizontal` `more-vertical` `palette` `pin` `power` `qr-code` `rows` `salve` `scan` `settings` `sidebar` `sliders` `square` `sun` `table` `toggle` `type` |
| **Actions** | 34 | `archive` `check` `clipboard` `copy` `download` `edit` `eye` `eye-off` `filter` `filter-x` `key` `link` `lock` `log-in` `log-out` `minus` `paperclip` `pencil` `plus` `printer` `save` `scissors` `search` `send` `share` `shield` `shield-alert` `trash` `unlock` `upload` `wrench` `x` `zoom-in` `zoom-out` |
| **Status** | 37 | `alert-circle` `alert-triangle` `award` `badge-check` `ban` `battery` `battery-charging` `battery-low` `bell` `bell-off` `bell-ring` `bluetooth` `bookmark` `check-circle` `circle-dot` `circle-minus` `circle-plus` `clock` `crown` `flag` `flame` `heart` `help-circle` `info` `loader` `octagon-alert` `shield-check` `signal` `smile` `sparkle` `star` `target` `thumbs-down` `thumbs-up` `trophy` `x-circle` `zap` |
| **Communication** | 19 | `at-sign` `contact` `globe` `inbox` `mail` `mail-open` `megaphone` `message` `message-text` `phone` `phone-call` `rss` `user` `user-check` `user-minus` `user-plus` `user-x` `users` `wifi` |
| **Files** | 16 | `book` `cloud` `cloud-download` `cloud-upload` `code` `file` `file-check` `file-code` `file-plus` `file-text` `files` `folder` `folder-open` `folder-plus` `image` `terminal` |
| **Media** | 18 | `camera` `film` `gamepad` `headphones` `mic` `mic-off` `music` `pause` `play` `repeat` `shuffle` `skip-back` `skip-forward` `stop` `video` `video-off` `volume` `volume-x` |
| **Text editor** | 10 | `align-center` `align-left` `align-right` `bold` `heading` `italic` `list-ordered` `quote` `strikethrough` `underline` |
| **Commerce and finance** | 17 | `banknote` `barcode` `briefcase` `calculator` `cart` `coins` `credit-card` `dollar-sign` `gift` `package` `percent` `receipt` `shopping-bag` `tag` `ticket` `truck` `wallet` |
| **Devices** | 10 | `calendar` `keyboard` `laptop` `map-pin` `monitor` `mouse` `smartphone` `tablet` `tv` `watch` |
| **Data** | 7 | `activity` `bar-chart` `hash` `line-chart` `pie-chart` `trending-down` `trending-up` |
| **Development** | 10 | `braces` `bug` `command` `cpu` `database` `git-branch` `git-commit` `git-merge` `git-pull-request` `server` |
| **Weather** | 6 | `cloud-rain` `cloud-sun` `snowflake` `thermometer` `umbrella` `wind` |
| **Maps and travel** | 13 | `anchor` `bike` `building` `car` `compass` `locate` `map` `mountain` `navigation` `plane` `route` `store` `train` |
| **Time** | 6 | `alarm-clock` `calendar-check` `calendar-plus` `history` `hourglass` `timer` |
| **Shapes** | 4 | `diamond` `hexagon` `octagon` `triangle` |
| **Everyday** | 9 | `book-open` `coffee` `graduation-cap` `heart-pulse` `leaf` `pill` `ruler` `sprout` `utensils` |
| **Brands and social** | 16 | `codepen` `discord` `dribbble` `facebook` `figma` `github` `instagram` `linkedin` `pinterest` `spotify` `telegram` `tiktok` `twitch` `whatsapp` `x-twitter` `youtube` |

**About the brands:** social media icons are simplified versions, drawn with the same stroke as the rest of the library so they match your interface. The brands belong to their owners. Use these icons to point to the services (profile links, social login, share), following each brand's guidelines. When the official full-color logo is required, use the files provided by the brand itself.

In the terminal: `npx salve-icons list`. To search with previews and copy with one click, use the documentation site.

---

## CLI: a bundle with only the icons you use

```bash
npx salve-icons build -i check,x,menu,search,trash -o public/icons
npx salve-icons build -s 1.5 -f css,sprite -o public/icons
npx salve-icons list
```

| Option | Description |
|---|---|
| `-i, --icons <a,b,c>` | only these icons (default: all) |
| `-s, --stroke <n>` | stroke width in the CSS and SVG files (default: 1.75) |
| `-o, --out <dir>` | output folder (default: `./salve-icons`) |
| `-f, --formats <list>` | `svg,sprite,css,js,json` (default: all) |

**Node API:**

```js
import { buildIcons } from "salve-icons/build";

await buildIcons({ icons: ["check", "x"], stroke: 2, outDir: "public/icons", formats: ["css"] });
```

---

## Design guidelines

Every icon follows the same rules, so they look consistent side by side:

- **Grid:** `viewBox="0 0 24 24"`, with content inside the 2–22 area (2px padding).
- **Stroke:** `1.75`, with round caps and joins. No fills.
- **Color:** `currentColor` only.
- **Corner radius:** 2px on large rectangles, 1–1.5px on small ones.
- **Dots:** a `.01`-long stroke with a round cap (`M12 8h.01`) or an `r="1"` circle.
- **Optical center:** triangular and asymmetric shapes are nudged to look centered.
- **Metaphors:** universal and literal. Brands only in the `brands` category, simplified with the same stroke.

---

## Contributing an icon

1. Create `src/icons/<name>.svg` with the same frame as the others:
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.75"
        stroke-linecap="round" stroke-linejoin="round">
     <path d="…"/>
   </svg>
   ```
2. Add `{ "name", "category", "tags" }` to `src/meta.json`. Tags should be in English and Portuguese, so search works both ways.
3. Run `npm run build` and check the icon next to the others on the site.

Names are in English, `kebab-case`, and describe **the drawing** (`trash`), not the action (`delete`). Actions go into the tags.

---

## FAQ

**Why does the CSS class use a mask instead of an icon font?**
Icon fonts get blurry, break when the font fails to load and are read as odd characters by screen readers. The mask uses the real SVG and paints it with `currentColor`.

**Do class-based icons work in every browser?**
Yes. `mask-image` is supported in every modern browser (Chrome, Edge, Firefox, Safari).

**Can I use it without salve-css?**
Yes. salve-icons is standalone and needs nothing else.

**How do I make the stroke thinner in the CSS classes?**
Build the CSS with the CLI: `npx salve-icons build -s 1.25 -f css`.

**An icon I need is missing.**
Open an issue or send a PR following the [design guidelines](#design-guidelines).

---

## Development

```bash
npm run build        # builds dist/ from src/icons
```

```
src/icons/*.svg     source of truth (one file per icon)
src/meta.json       categories and tags
src/element.js      <s-icon> web component
lib/build.js        builds svg/, sprite, CSS, JS module, React components, types and JSON
bin/                salve-icons CLI
dist/               built (published to npm, not in git)
```

See the [CHANGELOG](CHANGELOG.md) for what changed in each version.

## License

MIT © Julio Carneiro
