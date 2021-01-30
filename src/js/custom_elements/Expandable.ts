const ARIA_EXPANDED_ATTR: string = 'aria-expanded';
const EXPANDED_ATTR: string = 'expanded';
const LABEL_ATTR: string = 'label';
const TARGET_ATTR: string = 'target';

/**
 * Custom element that expands/collapses a target element when its source
 * element is clicked.
 */
export class Expandable extends HTMLElement {
  private button: HTMLElement;
  private hasSetup: boolean;
  private label: string;
  private target: HTMLElement;

  constructor() {
    super();
    this.hasSetup = false;
    this.addEventListener('click', this.toggleExpanded);
  }

  static get observedAttributes(): string[] {
    return [EXPANDED_ATTR];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    const direction = (newValue === '') ? 'expand' : 'collapse';
    this.expandCollapse(direction);
  }

  connectedCallback(): void {
    this.label = this.getAttribute(LABEL_ATTR);
    this.target = document.getElementById(this.getAttribute(TARGET_ATTR));
    [LABEL_ATTR, TARGET_ATTR].forEach((attr) => this.removeAttribute(attr));
    this.setup();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.toggleExpanded);
  }

  /**
   * Adds a button element to the DOM, and sets initial state of the expandable
   * and related elements.
   */
  private setup(): void {
    const buttonId = `${this.className}-button`;
    const html = `\
      <button class="${this.className}__button" id="${buttonId}"></button>\
    `;
    this.innerHTML = html.replace(/\s\s/g, '');
    this.button = this.querySelector('button');

    if (localStorage.getItem(EXPANDED_ATTR) === 'true') {
      this.setAttribute(EXPANDED_ATTR, '');
      this.target.setAttribute(EXPANDED_ATTR, '');
    } else {
      this.target.style.height = '0';
      this.target.removeAttribute(EXPANDED_ATTR);
    }

    this.button.setAttribute(ARIA_EXPANDED_ATTR,
        String(this.hasAttribute(EXPANDED_ATTR)));
    this.button.setAttribute('aria-controls', this.target.id);
    this.target.setAttribute('aria-controlledby', buttonId);

    this.updateLabel();
    this.hasSetup = true;
  }

  /**
   * Toggles attribute which triggers the attributeChanged callback.
   */
  private toggleExpanded(): void {
    if (this.hasAttribute(EXPANDED_ATTR)) {
      this.removeAttribute(EXPANDED_ATTR);
    } else {
      this.setAttribute(EXPANDED_ATTR, '');
    }
    this.button.setAttribute(ARIA_EXPANDED_ATTR,
      String(this.hasAttribute(EXPANDED_ATTR)));
  }

  /**
   * Expands or collapses the target element.
   */
  private expandCollapse(action: string): void {
    if (!this.hasSetup) {
      return;
    }

    const elHeight = this.target.scrollHeight;

    if (action === 'expand') {
      this.target.setAttribute(EXPANDED_ATTR, '');
      this.target.style.height = `${elHeight / 16}rem`;
      this.target.addEventListener('transitionend', () => {
        this.target.style.height = null;
      }, {once: true});

    } else {
      this.target.removeAttribute(EXPANDED_ATTR);
      window.requestAnimationFrame(() => {
        this.target.style.height = `${elHeight / 16}rem`;
        window.requestAnimationFrame(() => {
          this.target.style.height = '0';
        });
      });
    }

    this.updateLabel();
  }

  /**
   * Updates label text based on whether the element is expanded or collapsed.
   */
  private updateLabel(): void {
    const expanded = this.hasAttribute(EXPANDED_ATTR);
    const prefix = expanded ? 'Hide' : 'Show';
    this.button.textContent = `${prefix} ${this.label}`;
    localStorage.setItem(EXPANDED_ATTR, String(expanded));
  }
}
