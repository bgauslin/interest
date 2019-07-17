import { Expandable } from './Expandable';
import { Settings } from './Settings';

/** @const {Object} */
const FOOTER_INFO = {
  label: 'Ben Gauslin',
  title: 'Ben Gauslin’s Website',
  url: 'https://gauslin.com',
  yearStart: '2018',
  yearEnd: new Date().getFullYear().toString().substr(-2),
}

/** @class */
class App {
  constructor(id) {
    /** @private {!string} */
    this.id_ = id;
  }

  /**
   * Renders all HTML for the app.
   * @public
   */
  init() {
    // Register custom elements
    customElements.define('my-expandable', Expandable);
    customElements.define('user-settings', Settings);
    
    // Render everything into the DOM.
    const app = document.getElementById(this.id_);
    app.innerHTML += this.renderHeader_();
    app.innerHTML += this.renderContent_();
    app.innerHTML += this.renderFooter_();

    // Dispatch custom event and let modules know there's now a DOM for them.
    document.dispatchEvent(new CustomEvent('ready'));
  }

  /**
   * Renders header element into the DOM.
   * @private
   */
  renderHeader_() {
    return `
      <header class="header">
        <div class="header__frame">
          <h1 class="header__title">${document.title}</h1>
          <user-settings class="settings"></user-settings>
        </div>
      </header>
    `;
  }

  /**
   * Renders user inputs, table, and expandable button into the DOM.
   * @private
   */
  renderContent_() {
    return `
      <div class="values">
        <ul class="values__list"></ul>
        <div class="values__total"></div>
      </div>

      <div class="table" id="table">
        <div class="table__frame">
          <table class="table__data"></table>
        </div>
      </div>

      <my-expandable target="table"></my-expandable>
    `;
  }

  /**
   * Renders footer element into the DOM.
   * @private
   */
  renderFooter_() {
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
}

export { App };
