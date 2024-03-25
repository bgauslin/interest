import {LitElement, css, html} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {AppEvents, STORAGE_ITEM} from '../../modules/shared';
import shadowStyles from './drawer.scss';

/**
 * Custom element that expands/collapses a drawer when a button is clicked.
 */
@customElement('app-drawer')
class Drawer extends LitElement {
  @query('[aria-controls="drawer"]') button: HTMLButtonElement;
  @query('[id="drawer"]') drawer: HTMLDivElement;
  
  @state() drawerSize = '0';
  @state() open: Boolean = false;
  @state() target: HTMLElement;

  static styles = css`${shadowStyles}`;

  // TODO: Refactor/relocate touch listeners to app element.
  connectedCallback() {
    super.connectedCallback();
    this.getLocalStorage();
    this.dispatchDrawerState();
    this.addEventListener('touchstart', this.handleTouchstart, {passive: true});
    this.addEventListener('touchend', this.handleTouchend, {passive: true});
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('touchstart', this.handleTouchstart);
    this.removeEventListener('touchend', this.handleTouchend);
  }

  private getLocalStorage() {
    const storage = JSON.parse(localStorage.getItem(STORAGE_ITEM));
    if (!storage) {
      return;
    }

    if (storage.drawer) {
      this.open = storage.drawer;
      if (this.open) {
        this.drawerSize = null;
      }
    }
  }

  private toggleDrawer() {
    if (this.open) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
    this.open = !this.open;
    this.dispatchDrawerState();
  }

  private closeDrawer() {
    window.requestAnimationFrame(() => {
      this.drawerSize = this.getDrawerSize();
      window.requestAnimationFrame(() => this.drawerSize = '0');
    });
  }

  private openDrawer() {
    this.drawerSize = this.getDrawerSize();
    this.drawer.addEventListener('transitionend', () => {
      this.drawerSize = null;
    }, {once: true});
    this.button.blur();
  }

  private getDrawerSize(): string {
    return `${this.drawer.scrollHeight / 16}rem`;
  }

  private dispatchDrawerState() {
    this.dispatchEvent(new CustomEvent(AppEvents.DRAWER, {
      bubbles: true,
      composed: true,
      detail: {
        drawer: this.open,
      }
    }));
  }

  private handleTouchstart(event: TouchEvent) {
    const composed = event.composedPath();
    this.target = <HTMLElement>composed[0];

    if (this.target.tagName === 'BUTTON') {
      this.target.classList.add('touch');
    }
  }

  private handleTouchend() {
    this.target.classList.remove('touch');
  }

  protected render() {
    const label = this.open ? 'Hide table' : 'Show table';
    const style = this.drawerSize ? `--block-size: ${this.drawerSize}` : '';
    return html`
      <button
        aria-controls="drawer"
        aria-expanded="${this.open}"
        type="button"
        @click="${this.toggleDrawer}">${label}</button>
      <div id="drawer" style="${style}">
        <slot></slot>
      </div>
    `;
  }
}
