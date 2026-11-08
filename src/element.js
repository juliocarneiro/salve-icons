// <s-icon> web component — works in plain HTML, React, Vue, Svelte, Angular…
//   <script type="module" src="https://cdn.jsdelivr.net/npm/salve-icons/dist/element.js"></script>
//   <s-icon name="check"></s-icon>
//   <s-icon name="trash" label="Excluir" stroke="2"></s-icon>
//
// The SVG lives in a shadow root, so frameworks that hydrate server HTML (Next.js, Nuxt,
// SvelteKit…) never see unexpected children: no hydration mismatch.
// Color (currentColor), font-size, --si-size and --si-stroke are inherited, so your CSS
// still controls the icon from outside.
//
// SSR-safe: importing this module on the server is a no-op, because the element is only
// defined where `customElements` exists.
import { svg } from './index.js';

const STYLE = `:host{display:inline-flex;vertical-align:-0.125em;line-height:0}
svg{inline-size:var(--si-size,1em);block-size:var(--si-size,1em);stroke-width:var(--si-stroke,1.75)}`;

export function defineSalveIcon(tag = 's-icon') {
  if (typeof customElements === 'undefined' || customElements.get(tag)) return;

  class SalveIcon extends HTMLElement {
    static observedAttributes = ['name', 'label', 'stroke'];

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    render() {
      const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
      const name = this.getAttribute('name');
      if (!name) {
        root.innerHTML = '';
        return;
      }
      const stroke = Number(this.getAttribute('stroke'));
      try {
        root.innerHTML = `<style>${STYLE}</style>${svg(name, {
          label: this.getAttribute('label') ?? undefined,
          strokeWidth: stroke || undefined,
          class: undefined,
        })}`;
      } catch (error) {
        console.warn(error.message);
        root.innerHTML = '';
      }
    }
  }

  customElements.define(tag, SalveIcon);
}

defineSalveIcon();
