/** @const {Object} */
const FOOTER_INFO = {
  label: 'Ben Gauslin',
  title: 'Ben Gauslin’s Website',
  url: 'https://gauslin.com',
  yearStart: '2018',
  yearEnd: new Date().getFullYear().toString().substr(-2), 
}

/** @const {string} */
const MENU_LOCATION = '.header__frame';

/** @class */
class Templates {
  /**
   * @param {!Object} config
   */
  constructor(config) {
    /** @const {!string} */
    this.target = config.target;

    /** @const {?Element} */
    this.targetEl = null;
  }

  /**
   * Renders all HTML for the app.
   * @public
   */
  init() {
    this.targetEl = document.querySelector(this.target);

    if (this.targetEl) {
      this.targetEl.innerHTML += this.renderHeaderEl_();
      this.renderMenuEl_(MENU_LOCATION);
      this.targetEl.innerHTML += this.renderUserValuesEl_();
      this.targetEl.innerHTML += this.renderTableEl_();
      this.targetEl.innerHTML += this.renderToggleEl_();
      this.targetEl.innerHTML += this.renderFooterEl_();
      this.targetEl.innerHTML += this.renderMaskEl_();

      // Dispatch custom event and let modules know there's now a DOM for them.
      document.dispatchEvent(new CustomEvent('ready'));
    }
  }

  /**
   * Renders footer element into the DOM.
   * @private
   */
  renderFooterEl_() {
    const { label, title, url, yearStart, yearEnd } = FOOTER_INFO;
    return `
      <footer class="footer">
        <p class="footer__copyright">
          © ${yearStart}-${yearEnd}
          <a class="footer__link"
             href="${url}"
             title="${title} (opens in a new window)"
             target="_blank"
             rel="noopener">${label}</a>
        </p>
      </footer>
    `;
  }

  /**
   * Renders header element into the DOM.
   * @private
   */
  renderHeaderEl_() {
    return `
      <header class="header">
        <div class="header__frame">
          <h1 class="header__title">${document.title}</h1>
        </div>
      </header>
    `;
  }

  /**
   * Renders click mask element into the DOM.
   * @private
   */
  renderMaskEl_() {
    return '<div class="mask" inactive></div>';
  }

  /**
   * Renders settings menu element into the DOM.
   * @param {string} selector - Selector for element menu is attached to.
   * @private
   */
  renderMenuEl_(selector) {
    const parentEl = document.querySelector(selector);
    parentEl.innerHTML += `
      <div class="settings">
        <input class="settings__toggle" type="checkbox" aria-label="Settings">
        <div class="menu">
          <div class="menu__content"></div>
        </div>
      </div>
    `;
  }

  /**
   * Renders table element into the DOM.
   * @private
   */
  renderTableEl_() {
    return `
      <div class="table">
        <div class="table__frame">
          <table class="table__data"></table>
        </div>
      </div>
    `;
  }
  
  /**
   * Renders toggle element into the DOM.
   * @private
   */
  renderToggleEl_() {
    return `
      <div class="toggle">
        <button class="toggle__button"></button>
      </div>
    `;
  }

  /**
   * Renders user inputs into the DOM.
   * @private
   */
  renderUserValuesEl_() {
    return `
      <div class="values">
        <ul class="values__list"></ul>
        <div class="values__total"></div>
      </div>
    `;
  }
}

export { Templates };
