/** @const {string} */
const NO_JS_ATTR = 'no-js';

/** @const {string} */
const NO_TOUCH_ATTR = 'no-touch';

/** @description Removes 'no-js' attribute if JS is enabled. */
const hasJs = () => document.body.removeAttribute(NO_JS_ATTR);

/** @description Removes 'no-touch' attribute if device is touch-enabled. */
const noTouch = () => {
  if ('ontouchstart' in window || navigator.msMaxTouchPoints > 0) {
    document.body.removeAttribute(NO_TOUCH_ATTR);
  }
}


export { hasJs, noTouch };
