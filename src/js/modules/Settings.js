/** @enum {string} */
const Attribute = {
  CHECKED: 'checked',
  CURRENCY: 'currency',
  OPEN: 'open',
  THEME: 'theme',
};

/** @enum {string} */
const CssClass = {
  MASK: 'mask',
  TOGGLE: 'settings__toggle',
};

/** @const {Array<Object>} */
const UserSettings = [
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
      {
        isoSymbol: 'USD',
        label: '$',
        value: 'usd',
      },
      {
        isoSymbol: 'EUR',
        label: '€',
        value: 'eur',
      },
      {
        isoSymbol: 'GBP',
        label: '£',
        value: 'gbp',
      },
      {
        isoSymbol: 'YEN',
        label: '¥',
        value: 'yen',
      },
      {
        isoSymbol: 'INR',
        label: '₹',
        value: 'inr',
      },
    ]
  }
];

/** @class */
class Settings extends HTMLElement {
  constructor() {
    super();
  }

  // static get observedAttributes() {
  //   return [Attribute.THEME, Attribute.CURRENCY];
  // }

  /** @callback */
  // attributeChangedCallback(name, oldValue, newValue) {
  //   console.log(`attributeChangedCallback for ${name}`);
  // }

  /** @callback */
  connectedCallback() {
    this.setupDom_();
    this.setupStorage_();
    this.handleEvents_();
  }

  /**
   * Attaches settings elements to DOM and set defaults for first run.
   * @private
   */
  setupDom_() {
    let menuGroups = '';

    UserSettings.forEach((setting) => {
      const { name, fallback, options } = setting;
      let optionsHtml = '';
      options.forEach((option) => {
        // TODO: Simplify markup and styles for options.
        optionsHtml += `
          <li class="item" type="${name}">
            <label class="item__label" for="${option.value}">
              <input class="option" type="radio" name="${name}" value="${option.value}">
              <span class="option__label" option="${option.value}">${option.label}</span>
            </label>
          </li>
        `;
      });

      menuGroups += `
        <div class="menu__group" setting="${name}">
          <ul class="menu__list">
            ${optionsHtml}
          </ul>
        </div>
      `;
    });

    this.innerHTML = `
      <button class="${CssClass.TOGGLE}" aria-label="Settings">${this.renderIcon_('cog')}</button>
      <div class="menu">
        <div class="menu__content">
          ${menuGroups}
        </div>
      </div>
      <div class="${CssClass.MASK}"></div>
    `;
  }

  /**
   * Retrieves user value from localStorage if it exists, and if not, uses
   * fallback value. Then the element sets that value as a body attribute for
   * styling and saves it to localStorage for later visits.
   * @private
   */
  setupStorage_() {
    UserSettings.forEach((setting) => {
      const { name, fallback } = setting;
      const value = localStorage.getItem(name) || fallback;
      document.body.setAttribute(name, value);
      localStorage.setItem(name, value);
    });
  }

  /**
   * TODO...
   * @private
   */
  handleEvents_() {
    this.addEventListener('click', (e) => {
      // Toggle the menu open/closed.
      if (e.target.classList.contains(CssClass.TOGGLE)) {
        if (this.hasAttribute(Attribute.OPEN)) {
          this.removeAttribute(Attribute.OPEN);
        } else {
          this.setAttribute(Attribute.OPEN, '');
        }
      }

      // Change the current theme or currency.
      const value = e.target.getAttribute('for');
      if (value) {
        console.log(value);
        // this.setAttribute(COLOR_ATTR, value);
      }
    });

    // Close the menu when clicking outside of the menu.
    document.querySelector(`.${CssClass.MASK}`).addEventListener('click', (e) => {
      this.removeAttribute(Attribute.OPEN);
    });
  }

  /**
   * Sets current option and adds a listener to each option.
   * @param {!string} option - Attribute to set on the body element,
   *     which is also the 'name' of the input.
   * @private
   */
  updateOptions_(option) {
    const currentAttr = document.body.getAttribute(option);

    [...document.querySelectorAll(`[name=${option}]`)].forEach((el) => {
      if (currentAttr == el.value) {
        el.setAttribute(CHECKED_ATTR, '');
      }
      el.addEventListener('click', () => {
        this.changeOption_(option, el.value);
      });
    });
  }

  /**
   * Sets an attribute on the body element and saves it to localStorage.
   * @param {!string} name - The attribute to set on the body element.
   * @param {!string} value - The value of the body attribute.
   * @private
   */
  changeOption_(name, value) {
    document.body.setAttribute(name, value);
    localStorage.setItem(name, value);
  }

  /**
   * Renders an inline SVG icon.
   * @param {!string} name
   * @param {?string=} modifier - BEM classname modifier
   * @return {string}
   * @private
   */
  renderIcon_(name, modifier = name) {
    let svgPath;
    switch (name) {
      case 'cog':
        svgPath = 'M22.847 14.798 L20.85 13.645 C21.052 12.558 21.052 11.442 20.85 10.355 L22.847 9.202 C23.077 9.07 23.18 8.798 23.105 8.545 22.584 6.877 21.698 5.367 20.541 4.111 20.362 3.919 20.072 3.872 19.847 4.003 L17.85 5.156 C17.011 4.434 16.045 3.877 15 3.511 L15 1.209 C15 0.947 14.817 0.717 14.559 0.661 12.839 0.277 11.077 0.295 9.441 0.661 9.183 0.717 9 0.947 9 1.209 L9 3.516 C7.959 3.886 6.994 4.444 6.15 5.161 L4.158 4.008 C3.928 3.877 3.642 3.919 3.464 4.116 2.306 5.367 1.42 6.877 0.9 8.55 0.82 8.803 0.928 9.075 1.158 9.206 L3.155 10.359 C2.953 11.447 2.953 12.563 3.155 13.65 L1.158 14.803 C0.928 14.934 0.825 15.206 0.9 15.459 1.42 17.128 2.306 18.638 3.464 19.894 3.642 20.086 3.933 20.133 4.158 20.002 L6.155 18.849 C6.994 19.57 7.959 20.128 9.005 20.494 L9.005 22.8 C9.005 23.063 9.188 23.292 9.445 23.349 11.166 23.733 12.928 23.714 14.564 23.349 14.822 23.292 15.005 23.063 15.005 22.8 L15.005 20.494 C16.045 20.124 17.011 19.566 17.855 18.849 L19.851 20.002 C20.081 20.133 20.367 20.091 20.545 19.894 21.703 18.642 22.589 17.133 23.109 15.459 23.18 15.202 23.077 14.93 22.847 14.798 Z M12 15.75 C9.933 15.75 8.25 14.067 8.25 12 8.25 9.933 9.933 8.25 12 8.25 14.067 8.25 15.75 9.933 15.75 12 15.75 14.067 14.067 15.75 12 15.75 Z';
        break;
      case 'sliders':
        svgPath = 'M23.25 18 L7.5 18 7.5 17.25 C7.5 16.838 7.162 16.5 6.75 16.5 L5.25 16.5 C4.837 16.5 4.5 16.838 4.5 17.25 L4.5 18 0.75 18 C0.337 18 0 18.338 0 18.75 L0 20.25 C0 20.663 0.337 21 0.75 21 L4.5 21 4.5 21.75 C4.5 22.163 4.837 22.5 5.25 22.5 L6.75 22.5 C7.162 22.5 7.5 22.163 7.5 21.75 L7.5 21 23.25 21 C23.662 21 24 20.663 24 20.25 L24 18.75 C24 18.338 23.662 18 23.25 18 Z M23.25 10.5 L19.5 10.5 19.5 9.75 C19.5 9.338 19.162 9 18.75 9 L17.25 9 C16.837 9 16.5 9.338 16.5 9.75 L16.5 10.5 0.75 10.5 C0.337 10.5 0 10.838 0 11.25 L0 12.75 C0 13.163 0.337 13.5 0.75 13.5 L16.5 13.5 16.5 14.25 C16.5 14.663 16.837 15 17.25 15 L18.75 15 C19.162 15 19.5 14.663 19.5 14.25 L19.5 13.5 23.25 13.5 C23.662 13.5 24 13.163 24 12.75 L24 11.25 C24 10.838 23.662 10.5 23.25 10.5 Z M23.25 3 L13.5 3 13.5 2.25 C13.5 1.838 13.162 1.5 12.75 1.5 L11.25 1.5 C10.837 1.5 10.5 1.838 10.5 2.25 L10.5 3 0.75 3 C0.337 3 0 3.338 0 3.75 L0 5.25 C0 5.663 0.337 6 0.75 6 L10.5 6 10.5 6.75 C10.5 7.163 10.837 7.5 11.25 7.5 L12.75 7.5 C13.162 7.5 13.5 7.163 13.5 6.75 L13.5 6 23.25 6 C23.662 6 24 5.663 24 5.25 L24 3.75 C24 3.338 23.662 3 23.25 3 Z';
        break;
    }

    return `<svg class="icon icon--${modifier}" viewbox="0 0 24 24"><path d="${svgPath}"/></svg>`;
  }
}

export { Settings };
