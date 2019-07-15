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
   * @param {!string} id
   */
  constructor(id) {
    /** @private {!string} */
    this.id_ = id;
  }

  /**
   * Renders all HTML for the app.
   * @public
   */
  init() {
    const app = document.getElementById(this.id_);
    
    // Render everything into the DOM.
    app.innerHTML += this.renderHeaderEl_();
    this.renderMenuEl_(MENU_LOCATION);
    app.innerHTML += this.renderUserValuesEl_();
    app.innerHTML += this.renderTableEl_();
    app.innerHTML += this.renderToggleEl_();
    app.innerHTML += this.renderFooterEl_();
    app.innerHTML += this.renderMaskEl_();

    // Dispatch custom event and let modules know there's now a DOM for them.
    document.dispatchEvent(new CustomEvent('ready'));
  }

  /**
   * Renders footer element into the DOM.
   * @private
   */
  renderFooterEl_() {
    const { label, title, url, yearStart, yearEnd } = FOOTER_INFO;
    return `
      <footer class="footer">
        <p class="copyright">
          <span class="copyright__years">© ${yearStart}-${yearEnd}</span>
          <a class="copyright__owner"
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
