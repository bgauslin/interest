const EMPTY_ATTR: string = 'empty';
const HIDDEN_ATTR: string = 'hidden';
const SOURCE_ATTR: string = 'source';
const TARGETS_ATTR: string = 'targets';

/**
 * Observes a source element for toggling the visibility of target elements.
 */
export class VisibilityToggle extends HTMLElement {
  private observer: MutationObserver;
  private source: HTMLElement;
  private targets: NodeList;
  
  constructor() {
    super();
    this.observer = new MutationObserver(() => this.toggleVisibility());
  }

  connectedCallback() {
    this.setup();
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  private setup() {
    this.source = document.querySelector(this.getAttribute(SOURCE_ATTR));
    this.targets = document.querySelectorAll(this.getAttribute(TARGETS_ATTR));

    this.observer.observe(this.source, {attributes: true});
    this.toggleVisibility();

    [SOURCE_ATTR, TARGETS_ATTR].forEach((attr) => this.removeAttribute(attr));
  }

  private toggleVisibility() {
    for (const target of this.targets) {
      const element = target as HTMLElement;
      if (this.source.hasAttribute(EMPTY_ATTR)) {
        element.setAttribute(HIDDEN_ATTR, '');
      } else {
        element.removeAttribute(HIDDEN_ATTR);
      }
    }
  }
}

customElements.define('visibility-toggle', VisibilityToggle);