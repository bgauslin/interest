interface SettingsFields {
  fallback: string,
  name: string,
  options: SettingsOptions[],
}

interface SettingsOptions {
  label: string,
  value: string,
}

const CURRENCY_ATTR: string = 'currency';
const OPEN_ATTR: string = 'open';
const THEME_ATTR: string = 'theme';
const TOGGLE_CLASS: string = 'settings__toggle';

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
class UserSettings extends HTMLElement {
  private closeMenuListener_: any;
  private toggleButton_: HTMLButtonElement;

  constructor() {
    super();
    this.closeMenuListener_ = this.closeMenu_.bind(this);
    this.addEventListener('click', this.handleClick_);
    this.addEventListener('keyup', this.handleKey_);
  }

  static get observedAttributes(): string[] {
    return [CURRENCY_ATTR, THEME_ATTR];
  }

  connectedCallback(): void {
    this.setup_();
    this.setUserOptions_();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    this.updateOption_(name, oldValue, newValue);
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.handleClick_);
    this.removeEventListener('keyup', this.handleKey_);
    document.removeEventListener('click', this.closeMenuListener_);
  }

  /**
   * Toggles the menu open/closed if the button was clicked, and changes the
   * theme or currency if an option was clicked. If the menu is open, the next
   * click will close it.
   */
  private handleClick_(e: Event): void {
    const target = <HTMLElement>e.target;

    if (target === this.toggleButton_) {
      if (this.hasAttribute(OPEN_ATTR)) {
        this.closeMenu_();
      } else {
        this.setAttribute(OPEN_ATTR, '');
        window.requestAnimationFrame(() => {
          document.addEventListener('click', this.closeMenuListener_);
        });
      }
    } else {
      this.setOption_(target);
    }
  }

  /**
   * Adds keyboard navigation to the menu.
   */
  private handleKey_(e: KeyboardEvent): void {
    switch (e.code) {
      case 'Enter':
        this.setOption_(<HTMLElement>e.target);
        break;
      case 'Escape':
        this.closeMenu_();
        break;
    }
  }

  /**
   * Updates the settings attribute and closes the menu.
   */
  private setOption_(target: HTMLElement): void {
    const newOption = target.getAttribute('for');
    if (newOption) {
      const el = target.querySelector('[name]');
      const name = el.getAttribute('name');
      const value = el.getAttribute('value');
      this.setAttribute(name, value);

      this.closeMenu_();
    }
  }

  /**
   * Closes the menu and removes the click-to-close listener that's added when
   * the menu is opened by the toggle button.
   */
  private closeMenu_(): void {
    this.removeAttribute(OPEN_ATTR);
    document.removeEventListener('click', this.closeMenuListener_);
  }

  /**
   * Sets current option.
   */
  private updateOption_(name: string, oldValue: string, newValue: string): void {
    const oldEl = <HTMLInputElement>this.querySelector(`[value=${oldValue}]`);
    const newEl = <HTMLInputElement>this.querySelector(`[value=${newValue}]`);

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
  private setUserOptions_(): void {
    Settings.forEach((setting) => {
      const {name, fallback} = setting;
      const value = localStorage.getItem(name) || fallback;
      this.setAttribute(name, value);
    });
  }

  /**
   * Attaches settings elements to the DOM and set defaults for first run.
   */
  private setup_(): void {
    let menuGroups = '';

    Settings.forEach((setting) => {
      const {name, options} = setting;
      let optionsHtml = '';
      options.forEach((option) => {
        optionsHtml += `\
          <li class="item" type="${name}">\
            <label class="item__label" for="${option.value}" tabindex="0">\
              <input class="option" type="radio" name="${name}" value="${option.value}" tabindex="-1">\
              <span class="option__label" option="${option.value}">${option.label}</span>\
            </label>\
          </li>\
        `;
      });

      menuGroups += `\
        <div class="menu__group" setting="${name}">\
          <ul class="menu__list">\
            ${optionsHtml}\
          </ul>\
        </div>\
      `;
    });

    const html = `\
      <button class="${TOGGLE_CLASS}" tabindex="0" aria-label="Settings">\
        <svg class="settings__icon" viewbox="0 0 24 24">\
          <path d="M22.847 14.798 L20.85 13.645 C21.052 12.558 21.052 11.442 20.85 10.355 L22.847 9.202 C23.077 9.07 23.18 8.798 23.105 8.545 22.584 6.877 21.698 5.367 20.541 4.111 20.362 3.919 20.072 3.872 19.847 4.003 L17.85 5.156 C17.011 4.434 16.045 3.877 15 3.511 L15 1.209 C15 0.947 14.817 0.717 14.559 0.661 12.839 0.277 11.077 0.295 9.441 0.661 9.183 0.717 9 0.947 9 1.209 L9 3.516 C7.959 3.886 6.994 4.444 6.15 5.161 L4.158 4.008 C3.928 3.877 3.642 3.919 3.464 4.116 2.306 5.367 1.42 6.877 0.9 8.55 0.82 8.803 0.928 9.075 1.158 9.206 L3.155 10.359 C2.953 11.447 2.953 12.563 3.155 13.65 L1.158 14.803 C0.928 14.934 0.825 15.206 0.9 15.459 1.42 17.128 2.306 18.638 3.464 19.894 3.642 20.086 3.933 20.133 4.158 20.002 L6.155 18.849 C6.994 19.57 7.959 20.128 9.005 20.494 L9.005 22.8 C9.005 23.063 9.188 23.292 9.445 23.349 11.166 23.733 12.928 23.714 14.564 23.349 14.822 23.292 15.005 23.063 15.005 22.8 L15.005 20.494 C16.045 20.124 17.011 19.566 17.855 18.849 L19.851 20.002 C20.081 20.133 20.367 20.091 20.545 19.894 21.703 18.642 22.589 17.133 23.109 15.459 23.18 15.202 23.077 14.93 22.847 14.798 Z M12 15.75 C9.933 15.75 8.25 14.067 8.25 12 8.25 9.933 9.933 8.25 12 8.25 14.067 8.25 15.75 9.933 15.75 12 15.75 14.067 14.067 15.75 12 15.75 Z"/>\
        </svg>\
      </button>\
      <div class="menu">\
        <div class="menu__content">\
          ${menuGroups}\
        </div>\
      </div>\
    `;

    this.innerHTML = html.replace(/\s\s/g, '');
    this.toggleButton_ = this.querySelector(`.${TOGGLE_CLASS}`);
  }
}

export {UserSettings};
