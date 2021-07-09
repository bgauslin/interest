interface SettingsFields {
  fallback: string,
  name: string,
  options: SettingsOptions[],
}

interface SettingsOptions {
  label: string,
  value: string,
}

const ARIA_EXPANDED_ATTR = 'aria-expanded';
const ARIA_HIDDEN_ATTR = 'aria-hidden';
const CURRENCY_ATTR = 'currency';

const Settings: SettingsFields[] = [
  {
    name: 'currency',
    fallback: 'usd',
    options: [
      { label: '$', value: 'usd' },
      { label: '€', value: 'eur' },
      { label: '£', value: 'gbp' },
      { label: '¥', value: 'yen' },
      { label: '₹', value: 'inr' },
    ]
  }
];

/**
 * Custom element that lets a user set app-wide options.
 */
export class UserSettings extends HTMLElement {
  private button: HTMLButtonElement;
  private closeMenuListener: EventListenerObject;
  private menu: HTMLElement;

  constructor() {
    super();
    this.closeMenuListener = this.closeMenu.bind(this);
    this.addEventListener('click', this.handleClick);
    this.addEventListener('keyup', this.handleKey);
  }

  static get observedAttributes(): string[] {
    return [CURRENCY_ATTR];
  }

  connectedCallback() {
    this.setup();
    this.setUserOptions();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.updateOption(name, oldValue, newValue);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('keyup', this.handleKey);
    document.removeEventListener('click', this.closeMenuListener);
  }

  /**
   * Attaches settings elements to the DOM and set defaults for first run.
   */
  private setup() {
    const template = require('./settings.pug');
    this.innerHTML = template({settings: Settings});
    this.button =
        document.getElementById('settings-toggle') as HTMLButtonElement;
    this.menu = document.getElementById('menu');
  }

  /**
   * Retrieves user values from localStorage if they exist, and sets a
   * fallback value if not. The value is then set, which triggers the 
   * attributeChangedCallback.
   */
  private setUserOptions() {
    for (const setting of Settings) {
      const {name, fallback} = setting;
      const value = localStorage.getItem(name) || fallback;
      this.setAttribute(name, value);
    }
  }

  /**
   * Sets current option.
   */
  private updateOption(name: string, oldValue: string, newValue: string) {
    const oldElement =
        this.querySelector(`[value=${oldValue}]`) as HTMLInputElement;
    const newElement =
        this.querySelector(`[value=${newValue}]`) as HTMLInputElement;

    if (oldElement) {
      oldElement.checked = false;
    }

    if (newElement) {
      newElement.checked = true;
    }

    document.body.setAttribute(name, newValue);
    localStorage.setItem(name, newValue);
  }

  /**
   * Updates the settings attribute and closes the menu.
   */
  private setOption(target: HTMLElement) {
    const newOption = target.getAttribute('for');
    if (newOption) {
      const element = target.querySelector('[name]');
      const name = element.getAttribute('name');
      const value = element.getAttribute('value');
      this.setAttribute(name, value);
      this.closeMenu();
    }
  }

  /**
   * Closes the menu and removes the click-to-close listener that's added when
   * the menu is opened by the toggle button.
   */
  private closeMenu() {
    document.removeEventListener('click', this.closeMenuListener);
    this.button.setAttribute(ARIA_EXPANDED_ATTR, 'false');
    this.menu.setAttribute(ARIA_HIDDEN_ATTR, 'true');
  }

  /**
   * Toggles the menu open/closed if the button was clicked. If the menu is
   * open, the next click anywhere will close it.
   */
  private handleClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target === this.button) {
      if (this.button.getAttribute(ARIA_EXPANDED_ATTR) === 'true') {
        this.closeMenu();
      } else {
        this.button.setAttribute(ARIA_EXPANDED_ATTR, 'true');
        this.menu.setAttribute(ARIA_HIDDEN_ATTR, 'false');
        window.requestAnimationFrame(() => {
          document.addEventListener('click', this.closeMenuListener);
        });
      }
    } else {
      this.setOption(target);
    }
  }

  /**
   * Adds keyboard navigation to the menu.
   */
  private handleKey(event: KeyboardEvent) {
    switch (event.code) {
      case 'Enter':
        this.setOption(event.target as HTMLElement);
        break;
      case 'Escape':
        this.closeMenu();
        break;
    }
  }
}

customElements.define('user-settings', UserSettings);
