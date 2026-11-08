<div align="center">

# salve-icons

**Ícones que se comportam como texto.**

292 ícones de traço numa grade de 24px, incluindo **redes sociais**, feitos para acompanhar o [salve-css](https://github.com/juliocarneiro/salve-css). Eles herdam a cor e o tamanho do texto ao redor, alinham-se à linha de base e funcionam com ou sem JavaScript. Têm componentes React prontos para **Server Components e SSR**.

`npm i salve-icons` · zero dependências · React opcional · MIT

</div>

---

## Índice

- [Por que mais uma biblioteca de ícones](#por-que-mais-uma-biblioteca-de-ícones)
- [Instalação](#instalação)
- [Cinco formas de usar](#cinco-formas-de-usar)
  - [1. Classe CSS](#1-classe-css-mais-simples)
  - [2. Componentes React](#2-componentes-react)
  - [3. Sprite SVG](#3-sprite-svg)
  - [4. Módulo JavaScript](#4-módulo-javascript)
  - [5. Web component](#5-web-component)
  - [Qual escolher?](#qual-escolher)
- [SSR e Next.js](#ssr-e-nextjs)
- [Tamanho, cor e traço](#tamanho-cor-e-traço)
- [Com o salve-css](#com-o-salve-css)
- [Usando com frameworks](#usando-com-frameworks)
- [Acessibilidade](#acessibilidade)
- [Lista de ícones](#lista-de-ícones)
- [CLI: pacote só com os ícones que você usa](#cli-pacote-só-com-os-ícones-que-você-usa)
- [Diretrizes de desenho](#diretrizes-de-desenho)
- [Contribuindo com um ícone](#contribuindo-com-um-ícone)
- [Perguntas frequentes](#perguntas-frequentes)

---

## Por que mais uma biblioteca de ícones

Usar ícones costuma dar mais trabalho do que deveria: ajustar alinhamento com o texto, trocar cor no hover, redimensionar dentro de botões, escolher entre fonte de ícones, SVG inline ou sprite. O salve-icons resolve isso assim:

| Dor | Como o salve-icons resolve |
|---|---|
| Ícone desalinhado do texto | `vertical-align: -0.125em` calibrado para a linha de base |
| Mudar a cor exige outro arquivo | tudo usa `currentColor`: o ícone tem a cor do texto, inclusive no hover |
| Tamanho fixo em px | `1em` por padrão: segue o `font-size` de onde está |
| Fonte de ícones borrada e inacessível | SVG de verdade, nítido em qualquer tela |
| Ter que escolher um formato só | o mesmo ícone sai como classe CSS, componente React, sprite, módulo JS e web component |
| Ícone que quebra o SSR ou a hydration | componentes React sem hooks (funcionam em Server Components) e um `<s-icon>` com shadow DOM |
| Biblioteca incompleta, falta sempre "aquele" ícone | 292 ícones em 18 categorias, de setas a clima, finanças, dev e redes sociais |
| Pacote pesado | exports nomeados com tree-shaking, e o CLI gera um CSS só com os ícones que você usa |
| Ícone some no alto contraste do Windows | regra de `forced-colors` incluída |
| Animação de carregamento para quem não quer movimento | `.si-spin` para com `prefers-reduced-motion` |

---

## Instalação

**CDN**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/salve-icons/dist/salve-icons.css">
```

**npm**

```bash
npm i salve-icons
```

```js
import "salve-icons/css";                          // classes .si-*
import { CheckIcon, Icon } from "salve-icons/react"; // componentes React
import { svg, checkIcon } from "salve-icons";       // strings SVG
import "salve-icons/element";                      // <s-icon>
```

| Caminho | Conteúdo |
|---|---|
| `salve-icons/css` | `dist/salve-icons.css`: classes `.si` e `.si-<nome>` |
| `salve-icons/sprite.svg` | `dist/sprite.svg`: todos os ícones como `<symbol>` |
| `salve-icons/react` | `dist/react.js` (+ tipos): `<Icon name>` e um componente por ícone (`<CheckIcon />`) |
| `salve-icons` | `dist/index.js` (+ tipos): strings SVG e a função `svg()` |
| `salve-icons/element` | `dist/element.js`: web component `<s-icon>` |
| `salve-icons/svg/<nome>.svg` | arquivos SVG individuais |
| `salve-icons/icons.json` | metadados: nome, categoria, tags |

---

## Cinco formas de usar

### 1. Classe CSS (mais simples)

```html
<i class="si si-check" aria-hidden="true"></i>
<span class="si si-search" aria-hidden="true"></span>
```

Cada ícone é desenhado com `mask-image`, e o preenchimento é `currentColor`. Não precisa de JavaScript nem de arquivos extras: um único CSS (~12 KB gzip) traz todos os ícones.

```html
<button class="btn">
  <i class="si si-plus" aria-hidden="true"></i>
  Novo projeto
</button>

<a href="/sair" class="text-danger">
  <i class="si si-log-out" aria-hidden="true"></i> Sair
</a>
```

### 2. Componentes React

O jeito mais natural em React e Next.js. Os componentes **não usam hooks nem `"use client"`**, então renderizam em Server Components, no SSR e no cliente.

```jsx
import { CheckIcon, TrashIcon, GithubIcon, Icon } from "salve-icons/react";

<button className="btn"><CheckIcon /> Salvar</button>
<button className="btn tone-danger"><TrashIcon strokeWidth={2.25} /> Excluir</button>
<a href="https://github.com/…"><GithubIcon size={20} label="GitHub" /></a>

<Icon name="sparkle" className="text-accent" size="2rem" />   {/* pelo nome */}
```

| Prop | Padrão | Descrição |
|---|---|---|
| `size` | `1em` | número (px) ou qualquer medida CSS |
| `strokeWidth` | `1.75` | espessura do traço |
| `label` | — | nome acessível; sem ele o ícone fica `aria-hidden` |
| `className`, `style`, `onClick`… | — | qualquer prop de `<svg>` é repassada |

- **Tree-shaking:** importe componentes nomeados (`CheckIcon`) para levar só o que usa. O `<Icon name>` inclui todos os ícones no bundle; use-o quando o nome vem de dados.
- O nome do componente é o nome do ícone em PascalCase + `Icon`: `arrow-right` → `ArrowRightIcon`, `x-twitter` → `XTwitterIcon`.
- Os tipos TypeScript vêm incluídos, e `name` autocompleta no editor.
- `react` é uma *peer dependency* opcional: quem não usa React não instala nada a mais.

### 3. Sprite SVG

Melhor quando você quer **controlar a espessura do traço** via CSS, ou quando usa muitos ícones por página.

```html
<svg class="si-svg" aria-hidden="true"><use href="/sprite.svg#check"/></svg>
```

Copie `node_modules/salve-icons/dist/sprite.svg` para a pasta pública do seu projeto. O CSS do salve-icons já traz a classe `.si-svg` (traço, cor e tamanho). Sem ele, aplique `fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round`.

```html
<svg class="si-svg" style="--si-stroke: 1.25"><use href="/sprite.svg#heart"/></svg>
```

### 4. Módulo JavaScript

Para frameworks, renderização no servidor ou quando você quer o SVG inline no HTML.

```js
import { svg, icons, names, checkIcon, arrowRightIcon } from "salve-icons";

svg("check");                                   // "<svg … aria-hidden="true"><path …/></svg>"
svg("trash", { label: "Excluir" });             // role="img" aria-label="Excluir"
svg(arrowRightIcon, { size: 20, strokeWidth: 2 });

icons["map-pin"];   // markup interno do ícone
names;              // ["activity", "alert-circle", …]
```

Os exports nomeados (`checkIcon`, `arrowRightIcon`…) são **tree-shakable**: o bundler inclui só o que você importou.

| Opção de `svg()` | Padrão | Descrição |
|---|---|---|
| `size` | `24` | `width`/`height`; quando informado, também vira `--si-size` |
| `strokeWidth` | `1.75` | espessura do traço; quando informado, também vira `--si-stroke` |
| `label` | — | nome acessível; sem ele o ícone é decorativo (`aria-hidden`) |
| `class` | `"si-svg"` | atributo `class` |

Os tipos TypeScript vêm incluídos. `IconName` é a união de todos os nomes, então o editor autocompleta e acusa erro de digitação.

### 5. Web component

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/salve-icons/dist/element.js"></script>

<s-icon name="bell"></s-icon>
<s-icon name="trash" label="Excluir"></s-icon>
<s-icon name="heart" stroke="1.25"></s-icon>
```

O SVG fica dentro de um shadow DOM, mas a cor (`currentColor`), o `font-size`, `--si-size` e `--si-stroke` atravessam por herança, então o seu CSS controla o ícone de fora. Isso também evita erros de hydration em frameworks com SSR. Os atributos são reativos: trocar o `name` troca o ícone.

### Qual escolher?

| Situação | Forma recomendada |
|---|---|
| Site estático, WordPress, protótipo, "só quero que funcione" | **Classe CSS** |
| Muitos ícones por página e traço ajustável | **Sprite** |
| React, Next.js, Remix, Server Components | **Componentes React** |
| Vue, Svelte, Astro, SSR em geral, quer o SVG no HTML | **Módulo JS** |
| Vários frameworks, micro-frontends, HTML gerado por CMS | **Web component** |

---

## SSR e Next.js

Todos os formatos funcionam com renderização no servidor. Testado num app **Next.js 16 (App Router)** com **Turbopack e com webpack**: o build passa, o React hidrata sem avisos e o console fica limpo.

| Formato | No servidor | Observação |
|---|---|---|
| Classe CSS | ✅ HTML puro | nada a configurar |
| Componentes React | ✅ Server Components | sem hooks, sem `"use client"` |
| Módulo JS (`svg()`) | ✅ string | ideal para Astro, Vue SSR, templates |
| Sprite | ✅ HTML puro | sirva o `sprite.svg` como arquivo estático |
| Web component | ✅ importável no servidor | o módulo não faz nada no servidor; o ícone aparece quando o JS carrega |

**Next.js (App Router), do zero:**

```bash
npm i salve-css salve-icons
```

```jsx
// app/layout.jsx
import "salve-css";
import "salve-icons/css";   // opcional: só se usar as classes .si-*

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
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
      <input className="input" placeholder="Buscar" />
      <button className="btn btn-ghost btn-icon" aria-label="Notificações"><BellIcon /></button>
    </div>
  );
}
```

Os componentes React não precisam do `salve-icons/css`, porque o traço e o tamanho vêm de atributos. Com o CSS carregado, eles também obedecem `--si-size` e `--si-stroke`.

**Usando `<s-icon>` no Next.js:** importe o módulo num componente cliente.

```jsx
"use client";
import "salve-icons/element";

export const Zap = () => <s-icon name="zap"></s-icon>;
```

---

## Tamanho, cor e traço

**Tamanho:** por padrão, `1em`. Mude o `font-size` do pai, use uma classe de tamanho ou a variável:

```html
<i class="si si-star si-lg"></i>               <!-- 1.25em -->
<i class="si si-star" style="--si-size: 32px"></i>
<h2><i class="si si-zap"></i> Rápido</h2>      <!-- cresce com o título -->
```

| Classe | Tamanho |
|---|---|
| `.si-xs` | 0.75em |
| `.si-sm` | 0.875em |
| (padrão) | 1em |
| `.si-lg` | 1.25em |
| `.si-xl` | 1.5em |
| `.si-2x` | 2em |

**Cor:** sempre `currentColor`. Mude a cor do texto:

```html
<i class="si si-heart" style="color: crimson"></i>
<i class="si si-check-circle text-success"></i>   <!-- utilitário do salve-css -->
```

**Traço:** no sprite, no módulo JS e no web component, a espessura é ajustável (`--si-stroke`, `strokeWidth` ou o atributo `stroke`). Nas classes CSS, o traço vem embutido. Para outro valor, gere o CSS pelo CLI com `--stroke`.

**Animação:**

```html
<i class="si si-loader si-spin" aria-hidden="true"></i>
<i class="si si-bell si-pulse" aria-hidden="true"></i>
```

**Direção (RTL):** setas que devem inverter em árabe ou hebraico recebem `.si-flip-rtl`.

```html
<i class="si si-arrow-right si-flip-rtl"></i>
```

---

## Com o salve-css

As duas bibliotecas foram feitas juntas:

- Os ícones dentro de `.btn` ganham espaçamento pelo `gap` do botão. Ícones `<svg>` também são dimensionados automaticamente.
- Os tons e utilitários de cor do salve-css colorem os ícones: `class="si si-alert-triangle text-warning"`.
- O CSS de ícones fica na camada `salve.icons`, então o seu CSS também vence aqui.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/salve-css/dist/salve.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/salve-icons/dist/salve-icons.css">

<div class="alert tone-success" role="status">
  <i class="si si-check-circle alert-icon" aria-hidden="true"></i>
  <div><p class="alert-title">Pagamento confirmado</p></div>
</div>

<button class="btn btn-icon btn-ghost" aria-label="Mais opções" data-tip="Mais opções">
  <i class="si si-more-horizontal" aria-hidden="true"></i>
</button>
```

---

## Usando com frameworks

**React / Next.js / Remix:** use os [componentes React](#2-componentes-react).

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

**Astro** (renderiza no servidor, zero JS no cliente)

```astro
---
import { svg } from "salve-icons";
---
<button class="btn"><Fragment set:html={svg("plus", { size: "1em" })} /> Novo</button>
```

**Angular, Lit, qualquer framework:** use o web component.

```js
import "salve-icons/element";
// <s-icon name="check"></s-icon>
```

No Vue, avise ao compilador que `s-icon` é um elemento customizado (`compilerOptions.isCustomElement: tag => tag === 's-icon'`). No Angular, adicione `CUSTOM_ELEMENTS_SCHEMA` ao componente.

---

## Acessibilidade

- **Ícone decorativo** (há texto ao lado): esconda do leitor de tela.
  ```html
  <button class="btn"><i class="si si-plus" aria-hidden="true"></i> Adicionar</button>
  ```
- **Ícone sozinho num botão:** o nome vai no botão.
  ```html
  <button class="btn btn-icon" aria-label="Fechar"><i class="si si-x" aria-hidden="true"></i></button>
  ```
- **Ícone que transmite informação sozinho:** use `label` (JS / web component), ou `role="img"` + `aria-label`.
  ```html
  <s-icon name="alert-triangle" label="Atenção"></s-icon>
  ```
- Não comunique estado só pela cor do ícone. Acompanhe com texto.
- No alto contraste do Windows, os ícones de classe usam a cor de texto do sistema.

---

## Lista de ícones

| Categoria | Qtd. | Ícones |
|---|---|---|
| **Setas** | 27 | `arrow-down` `arrow-down-left` `arrow-down-right` `arrow-left` `arrow-left-right` `arrow-right` `arrow-up` `arrow-up-down` `arrow-up-left` `arrow-up-right` `chevron-down` `chevron-left` `chevron-right` `chevron-up` `chevrons-down` `chevrons-left` `chevrons-right` `chevrons-up` `chevrons-up-down` `corner-down-left` `external-link` `move` `redo` `refresh` `rotate-ccw` `rotate-cw` `undo` |
| **Interface** | 33 | `app-window` `circle` `columns` `droplet` `grip-vertical` `home` `infinity` `kanban` `layers` `layout-grid` `lightbulb` `list` `maximize` `menu` `minimize` `moon` `more-horizontal` `more-vertical` `palette` `pin` `power` `qr-code` `rows` `salve` `scan` `settings` `sidebar` `sliders` `square` `sun` `table` `toggle` `type` |
| **Ações** | 34 | `archive` `check` `clipboard` `copy` `download` `edit` `eye` `eye-off` `filter` `filter-x` `key` `link` `lock` `log-in` `log-out` `minus` `paperclip` `pencil` `plus` `printer` `save` `scissors` `search` `send` `share` `shield` `shield-alert` `trash` `unlock` `upload` `wrench` `x` `zoom-in` `zoom-out` |
| **Status** | 37 | `alert-circle` `alert-triangle` `award` `badge-check` `ban` `battery` `battery-charging` `battery-low` `bell` `bell-off` `bell-ring` `bluetooth` `bookmark` `check-circle` `circle-dot` `circle-minus` `circle-plus` `clock` `crown` `flag` `flame` `heart` `help-circle` `info` `loader` `octagon-alert` `shield-check` `signal` `smile` `sparkle` `star` `target` `thumbs-down` `thumbs-up` `trophy` `x-circle` `zap` |
| **Comunicação** | 19 | `at-sign` `contact` `globe` `inbox` `mail` `mail-open` `megaphone` `message` `message-text` `phone` `phone-call` `rss` `user` `user-check` `user-minus` `user-plus` `user-x` `users` `wifi` |
| **Arquivos** | 16 | `book` `cloud` `cloud-download` `cloud-upload` `code` `file` `file-check` `file-code` `file-plus` `file-text` `files` `folder` `folder-open` `folder-plus` `image` `terminal` |
| **Mídia** | 18 | `camera` `film` `gamepad` `headphones` `mic` `mic-off` `music` `pause` `play` `repeat` `shuffle` `skip-back` `skip-forward` `stop` `video` `video-off` `volume` `volume-x` |
| **Editor de texto** | 10 | `align-center` `align-left` `align-right` `bold` `heading` `italic` `list-ordered` `quote` `strikethrough` `underline` |
| **Comércio e finanças** | 17 | `banknote` `barcode` `briefcase` `calculator` `cart` `coins` `credit-card` `dollar-sign` `gift` `package` `percent` `receipt` `shopping-bag` `tag` `ticket` `truck` `wallet` |
| **Dispositivos** | 10 | `calendar` `keyboard` `laptop` `map-pin` `monitor` `mouse` `smartphone` `tablet` `tv` `watch` |
| **Dados** | 7 | `activity` `bar-chart` `hash` `line-chart` `pie-chart` `trending-down` `trending-up` |
| **Desenvolvimento** | 10 | `braces` `bug` `command` `cpu` `database` `git-branch` `git-commit` `git-merge` `git-pull-request` `server` |
| **Clima** | 6 | `cloud-rain` `cloud-sun` `snowflake` `thermometer` `umbrella` `wind` |
| **Mapas e viagem** | 13 | `anchor` `bike` `building` `car` `compass` `locate` `map` `mountain` `navigation` `plane` `route` `store` `train` |
| **Tempo** | 6 | `alarm-clock` `calendar-check` `calendar-plus` `history` `hourglass` `timer` |
| **Formas** | 4 | `diamond` `hexagon` `octagon` `triangle` |
| **Dia a dia** | 9 | `book-open` `coffee` `graduation-cap` `heart-pulse` `leaf` `pill` `ruler` `sprout` `utensils` |
| **Marcas e redes sociais** | 16 | `codepen` `discord` `dribbble` `facebook` `figma` `github` `instagram` `linkedin` `pinterest` `spotify` `telegram` `tiktok` `twitch` `whatsapp` `x-twitter` `youtube` |

**Sobre as marcas:** os ícones de redes sociais são versões simplificadas, no mesmo traço do resto da biblioteca, para combinar com a interface. As marcas pertencem aos seus donos. Use esses ícones para apontar para os serviços (links de perfil, login social, compartilhar), seguindo as diretrizes de cada marca. Quando o logo oficial colorido for obrigatório, use os arquivos fornecidos pela própria marca.

No terminal: `npx salve-icons list`. Para buscar com prévia e copiar com um clique, use o site de documentação.

---

## CLI: pacote só com os ícones que você usa

```bash
npx salve-icons build -i check,x,menu,search,trash -o public/icons
npx salve-icons build -s 1.5 -f css,sprite -o public/icons
npx salve-icons list
```

| Opção | Descrição |
|---|---|
| `-i, --icons <a,b,c>` | só esses ícones (padrão: todos) |
| `-s, --stroke <n>` | espessura do traço no CSS e nos SVGs (padrão: 1.75) |
| `-o, --out <pasta>` | pasta de saída (padrão: `./salve-icons`) |
| `-f, --formats <lista>` | `svg,sprite,css,js,json` (padrão: todos) |

**API Node:**

```js
import { buildIcons } from "salve-icons/build";

await buildIcons({ icons: ["check", "x"], stroke: 2, outDir: "public/icons", formats: ["css"] });
```

---

## Diretrizes de desenho

Todos os ícones seguem as mesmas regras, para que fiquem consistentes lado a lado:

- **Grade:** `viewBox="0 0 24 24"`, com conteúdo dentro da área de 2 a 22 (respiro de 2px).
- **Traço:** `1.75`, com pontas e junções arredondadas (`round`). Nada de preenchimento.
- **Cor:** só `currentColor`.
- **Raio dos cantos:** 2px em retângulos grandes, 1–1.5px nos pequenos.
- **Pontos:** um traço de comprimento `.01` com ponta redonda (`M12 8h.01`) ou um círculo `r="1"`.
- **Centro óptico:** formas triangulares e assimétricas são compensadas para parecer centralizadas.
- **Metáforas:** universais e literais. Marcas entram só na categoria `brands`, simplificadas no mesmo traço.

---

## Contribuindo com um ícone

1. Crie `src/icons/<nome>.svg` com a mesma moldura dos outros:
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.75"
        stroke-linecap="round" stroke-linejoin="round">
     <path d="…"/>
   </svg>
   ```
2. Adicione `{ "name", "category", "tags" }` em `src/meta.json`. As tags devem ser em inglês e português, para a busca encontrar das duas formas.
3. Rode `npm run build` e confira o ícone ao lado dos outros no site.

Nomes em inglês, `kebab-case`, descrevendo **o desenho** (`trash`), não a ação (`delete`). As ações entram nas tags.

---

## Perguntas frequentes

**Por que a classe CSS usa máscara em vez de fonte de ícones?**
Fontes de ícones ficam borradas, quebram quando a fonte não carrega e são lidas como caracteres estranhos por leitores de tela. A máscara usa o SVG de verdade e pinta com `currentColor`.

**Os ícones de classe funcionam em todos os navegadores?**
Sim. `mask-image` é suportado em todos os navegadores modernos (Chrome, Edge, Firefox, Safari).

**Posso usar sem o salve-css?**
Pode. O salve-icons é independente e não precisa de mais nada.

**Como deixo o traço mais fino nas classes CSS?**
Gere o CSS pelo CLI: `npx salve-icons build -s 1.25 -f css`.

**Faltou um ícone que eu preciso.**
Abra uma issue ou envie um PR seguindo as [diretrizes de desenho](#diretrizes-de-desenho).

---

## Desenvolvimento

```bash
npm run build        # gera dist/ a partir de src/icons
```

```
src/icons/*.svg     fonte da verdade (um arquivo por ícone)
src/meta.json       categorias e tags
src/element.js      web component <s-icon>
lib/build.js        gera svg/, sprite, CSS, módulo JS, tipos e JSON
bin/                CLI salve-icons
dist/               gerado (publicado no npm, fora do git)
```

## Licença

MIT © Julio Carneiro
