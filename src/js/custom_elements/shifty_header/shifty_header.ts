enum CustomProperty {
  OFFSET = '--sticky-offset',
  SHIFT = '--sticky-shift',
}

/**
 * Custom element that shifts a fixed header in and out of the viewport
 * depending on scroll direction.
 */
export class ShiftyHeader extends HTMLElement {
  private height: number;
  private resizeListener: any;
  private scrollChange: number;
  private scrollListener: any;
  private shift: number;
  private yScroll: number;
  private yScrollLast: number;

  constructor() {
    super();
    this.shift = 0;
    this.yScrollLast = 0;
    this.resizeListener = this.getHeight.bind(this);
    this.scrollListener = this.applyShift.bind(this);
    window.addEventListener('resize', this.resizeListener);
    document.addEventListener('scroll', this.scrollListener);
  }

  connectedCallback() {
    this.getHeight();
    this.applyShift();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.resizeListener);
    document.removeEventListener('scroll', this.scrollListener);
  }

  private getHeight() {
    this.height = this.offsetHeight;
  }

  private applyShift() {
    // Get current scroll position.
    this.yScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Update shift value based on change in scroll position if it's within
    // height bounds.
    this.scrollChange = this.yScroll - this.yScrollLast;
    if (this.shift > 0 || this.shift < this.height) {
      this.shift += this.scrollChange;
    }

    // Reset shift value if it exceeds height bounds.
    if (this.shift > this.height) {
      this.shift = this.height;
    } else if (this.shift < 0) {
      this.shift = 0;
    }

    // Set CSS values for related elements to reference.
    document.documentElement.style.setProperty(
      CustomProperty.OFFSET, `${(this.height - this.shift) / 16}rem`);
    document.documentElement.style.setProperty(
      CustomProperty.SHIFT, `-${this.shift / 16}rem`);

    // Update yScrollLast for determining scroll change on next tick.
    this.yScrollLast = (this.yScroll <= 0) ? 0 : this.yScroll;
  }
}

customElements.define('shifty-header', ShiftyHeader);
