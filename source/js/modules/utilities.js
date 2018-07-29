/**
 * @description Removes 'no-js' attribute if JS is enabled.
 */
const hasJs = () => {
  document.body.removeAttribute('no-js');
}

/**
 * @description Removes 'no-touch' attribute if device is touch-enabled.
 */
const noTouch = () => {
  if ('ontouchstart' in window || navigator.msMaxTouchPoints > 0) {
    document.body.removeAttribute('no-touch');
  }
}


export { hasJs, noTouch };
