/** @const {string} */
const NO_JS_ATTR = 'no-js';

/** @const {string} */
const NO_TOUCH_ATTR = 'no-touch';

/** @class */
class Utilities {

  constructor(config) {
    this.config = config;
  }

  /**
   * @description Initializes Google Analytics tracking.
   * @param {!Object} config: GA settings (id, hostname)
   */
  googleAnalytics(config) {
    if (window.location.hostname === config.domain) {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga')
      ga('create', config.id, 'auto')
      ga('send', 'pageview')
    }
  }

  /** @description Removes 'no-js' attribute if JS is enabled. */
  hasJs() {
    document.body.removeAttribute(NO_JS_ATTR);
  }

  /** @description Removes 'no-touch' attribute if device is touch-enabled. */
  noTouch() {
    if ('ontouchstart' in window || navigator.msMaxTouchPoints > 0) {
      document.body.removeAttribute(NO_TOUCH_ATTR);
    }
  }

  /** @description Initializes all utilities. */
  init() {
    this.hasJs();
    this.noTouch();
    this.googleAnalytics(this.config);
  }
}


export { Utilities };
