import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import shadowStyles from './expandable.scss';

/**
 * Custom element that expands/collapses a target element when its source
 * element is clicked.
 */
@customElement('expandable-drawer')
class Expandable extends LitElement {
  @query('.drawer') drawer: HTMLElement;
  @state() open: Boolean = false;

  static styles = css`${shadowStyles}`;

  private toggleOpen() {
    this.open = this.open;
    const direction = this.open ? 'expand' : 'collapse';
    this.expandCollapse(direction);
  }

  private expandCollapse(action: string) {
    const drawerHeight = `${this.drawer.scrollHeight / 16}rem`;

    if (action === 'expand') {
      this.drawer.style.blockSize = drawerHeight;
      this.drawer.addEventListener('transitionend', () => {
        this.drawer.style.blockSize = null;
      }, {once: true});
    } else {
      window.requestAnimationFrame(() => {
        this.drawer.style.blockSize = drawerHeight;
        window.requestAnimationFrame(() => {
          this.drawer.style.blockSize = '0';
        });
      });
    }
  }

  render() {
    const labelPrefix = this.open ? 'Hide' : 'Show';
    return html`
      <button
        aria-controls="drawer"
        aria-expanded="${this.open}"
        @click="${this.toggleOpen}">
        ${labelPrefix} <slot name="label"></slot>
      </button>
      <div
        aria-hidden="${!this.open}"
        class="drawer"
        id="drawer">
        <slot name="drawer"></slot>
      </div>
    `;
  }
}


