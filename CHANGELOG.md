# Changelog

All notable changes to salve-icons. The project follows [semantic versioning](https://semver.org/).

## 0.2.0

- New `salve-icons/sprite` module for an in-page sprite: `injectSprite()` (browser, once), `spriteSheet` (markup for SSR) and `useIcon(name)`. Symbols use `si-` prefixed ids, so they never clash with page ids.
- Why: `<use href="sprite.svg#x">` elements created at runtime make browsers re-request the external file for every new icon. With default host headers (`max-age=0, must-revalidate`) that's a round trip per icon. The in-page sprite costs zero requests.
- Docs explain the pitfall and the cache headers to use if you keep the external file.
- No changes to the icons or the other formats (CSS classes, React, JS module and `<s-icon>` were never affected).

## 0.1.1

- The README is now in English, with a Portuguese version in `README.pt-BR.md`.
- English package description on npm.
- No changes to the icons or the API.

## 0.1.0

First release: 292 stroke icons on a 24px grid in 18 categories (social brands included), shipped as CSS classes, React components (Server Components friendly), an SVG sprite, a typed JS module and the `<s-icon>` web component, plus a CLI to build bundles with only the icons you use.
