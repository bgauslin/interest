import { Expandable } from './Expandable';
import { Settings } from './Settings';
import { UserValues } from'./UserValues';

/** @class */
class App {
  constructor(id) {
    /** @private {!Element} */
    this.appEl_ = document.getElementById(id);
  }

  /**
   * Renders all HTML for the app.
   * @public
   */
  init() {
    // Register custom elements
    customElements.define('my-expandable', Expandable);
    customElements.define('user-settings', Settings);
    customElements.define('user-values', UserValues);
    
    // Render everything into the DOM.
    this.renderHeader_();
    this.renderContent_();
    this.renderFooter_();

    // Dispatch custom event and let modules know there's now a DOM for them.
    document.dispatchEvent(new CustomEvent('ready'));
  }

  /**
   * Renders header element into the DOM.
   * @private
   */
  renderHeader_() {
    this.appEl_.innerHTML += `
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
    this.appEl_.innerHTML += `
      <user-values class="values"></user-values>
      ${this.renderTable_('table')}
      <my-expandable target="table"></my-expandable>
    `;
  }

  /**
   * Renders table markup for calculated user values.
   * @param {!string} classname
   * @param {?string=} id
   * @private
   */
  renderTable_(classname, id = classname) {
    return `
      <div class="${classname}" id="${id}">
        <div class="${classname}__frame">
          <table class="${classname}__data"></table>
        </div>
        <p class="rotate-screen">
          Rotate screen to view <span>Interest</span> and <span>Growth</span> columns.
        </p>
      </div>
    `;
  }

  /**
   * Renders footer element into the DOM.
   * @private
   */
  renderFooter_() {
    const { label, title, url, yearStart, yearEnd } = FOOTER_INFO;
    this.appEl_.innerHTML += `
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

/** @const {Object} */
const FOOTER_INFO = {
  label: 'Ben Gauslin',
  title: 'Ben Gauslin’s Website',
  url: 'https://gauslin.com',
  yearStart: '2018',
  yearEnd: new Date().getFullYear().toString().substr(-2),
}

export { App };
