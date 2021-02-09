interface SettingsFields {
  fallback: string,
  name: string,
  options: SettingsOptions[],
}

interface SettingsOptions {
  label: string,
  value: string,
}

const ARIA_EXPANDED_ATTR: string = 'aria-expanded';
const ARIA_HIDDEN_ATTR: string = 'aria-hidden';
const CURRENCY_ATTR: string = 'currency';
const OPEN_ATTR: string = 'open';
const THEME_ATTR: string = 'theme';

const Settings: SettingsFields[] = [
  {
    name: 'theme',
    fallback: 'light',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Sepia', value: 'sepia' },
      { label: 'Dark', value: 'dark' },
    ],
  },
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
 * Custom element that lets a user set the app's theme colors and currency.
 */
export class UserSettings extends HTMLElement {
  private closeMenuListener: any;
  private menu: HTMLElement;
  private toggleButton: HTMLButtonElement;

  constructor() {
    super();
    this.closeMenuListener = this.closeMenu.bind(this);
    this.addEventListener('click', this.handleClick);
    this.addEventListener('keyup', this.handleKey);
  }

  static get observedAttributes(): string[] {
    return [CURRENCY_ATTR, THEME_ATTR];
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
   * Toggles the menu open/closed if the button was clicked, and changes the
   * theme or currency if an option was clicked. If the menu is open, the next
   * click will close it.
   */
  private handleClick(e: Event) {
    const target = e.target as HTMLElement;

    if (target === this.toggleButton) {
      if (this.hasAttribute(OPEN_ATTR)) {
        this.closeMenu();
      } else {
        this.setAttribute(OPEN_ATTR, '');
        this.toggleButton.setAttribute(ARIA_EXPANDED_ATTR, 'true');
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
  private handleKey(e: KeyboardEvent) {
    switch (e.code) {
      case 'Enter':
        this.setOption(e.target as HTMLElement);
        break;
      case 'Escape':
        this.closeMenu();
        break;
    }
  }

  /**
   * Updates the settings attribute and closes the menu.
   */
  private setOption(target: HTMLElement) {
    const newOption = target.getAttribute('for');
    if (newOption) {
      const el = target.querySelector('[name]');
      const name = el.getAttribute('name');
      const value = el.getAttribute('value');
      this.setAttribute(name, value);

      this.closeMenu();
    }
  }

  /**
   * Closes the menu and removes the click-to-close listener that's added when
   * the menu is opened by the toggle button.
   */
  private closeMenu() {
    this.removeAttribute(OPEN_ATTR);
    document.removeEventListener('click', this.closeMenuListener);
    this.toggleButton.setAttribute(ARIA_EXPANDED_ATTR, 'false');
    this.menu.setAttribute(ARIA_HIDDEN_ATTR, 'true');
  }

  /**
   * Sets current option.
   */
  private updateOption(name: string, oldValue: string, newValue: string) {
    const oldEl = this.querySelector(`[value=${oldValue}]`) as HTMLInputElement;
    const newEl = this.querySelector(`[value=${newValue}]`) as HTMLInputElement;

    if (oldEl) {
      oldEl.checked = false;
    }

    if (newEl) {
      newEl.checked = true;
    }

    document.body.setAttribute(name, newValue);
    localStorage.setItem(name, newValue);
  }

  /**
   * Retrieves user values from localStorage if they exist, and sets a
   * fallback value if not. The value is then set, which triggers the 
   * attributeChangedCallback.
   */
  private setUserOptions() {
    Settings.forEach((setting) => {
      const {name, fallback} = setting;
      const value = localStorage.getItem(name) || fallback;
      this.setAttribute(name, value);
    });
  }

  /**
   * Attaches settings elements to the DOM and set defaults for first run.
   */
  private setup() {
    const template = require('../templates/settings.pug');
    this.innerHTML = template({settings: Settings});
    
    this.toggleButton = this.querySelector('.settings__toggle');
    this.menu = this.querySelector('.menu');
  }
}
