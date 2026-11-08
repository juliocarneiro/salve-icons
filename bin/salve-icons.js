#!/usr/bin/env node
// salve-icons CLI
//   salve-icons build [options]     build assets (all formats) into a folder
//     -i, --icons <a,b,c>   only these icons (default: all)
//     -s, --stroke <n>      stroke width for CSS/SVG output (default 1.75)
//     -o, --out <dir>       output directory (default: ./salve-icons)
//     -f, --formats <list>  svg,sprite,css,js,json (default: all)
//   salve-icons list               print every icon name

import { resolve } from 'node:path';
import { buildIcons, loadIcons } from '../lib/build.js';

const args = process.argv.slice(2);
const cmd = args[0];
const option = (short, long) => {
  const i = args.findIndex((a) => a === short || a === long);
  return i > -1 ? args[i + 1] : undefined;
};
const list = (v) => v?.split(',').map((s) => s.trim()).filter(Boolean);

async function main() {
  if (cmd === 'list') {
    const icons = await loadIcons();
    console.log(icons.map((i) => i.name).join('\n'));
    return;
  }

  if (cmd === 'build') {
    const stroke = option('-s', '--stroke');
    const { count, outDir } = await buildIcons({
      icons: list(option('-i', '--icons')),
      stroke: stroke ? Number(stroke) : undefined,
      outDir: resolve(option('-o', '--out') ?? 'salve-icons'),
      formats: list(option('-f', '--formats')),
    });
    console.log(`salve-icons → ${outDir} (${count} icons)`);
    return;
  }

  console.log(`salve-icons — ícones para o salve

Usage:
  salve-icons list
  salve-icons build [-i check,x,menu] [-s 1.5] [-o dir] [-f css,sprite]`);
}

main().catch((err) => {
  console.error(`salve-icons: ${err.message}`);
  process.exit(1);
});
