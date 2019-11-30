class ShiftyHeader extends HTMLElement {
  private height_: number;
  private scrollChange_: number;
  private shift_: number;
  private yScroll_: number;
  private yScrollLast_: number;

  constructor() {
    super();
    this.shift_ = 0;
    this.yScrollLast_ = 0;
  }

  connectedCallback(): void {
    this.getHeight_();
    this.applyShift_();
    this.resize_();
  }

  private getHeight_(): void {
    this.height_ = this.offsetHeight;
  }

  private resize_(): void {
    window.addEventListener('resize', () => {
      this.getHeight_();
    }, { passive: true });
  }

  private applyShift_(): void {
    document.addEventListener('scroll', () => {
      // Get current scroll position.
      this.yScroll_ = window.pageYOffset || document.documentElement.scrollTop;
      
      // Update shift value based on change in scroll position if it's within
      // height bounds.
      this.scrollChange_ = this.yScroll_ - this.yScrollLast_;
      if (this.shift_ > 0 || this.shift_ < this.height_) {
        this.shift_ += this.scrollChange_;
      }

      // Reset shift value if it exceeds height bounds.
      if (this.shift_ > this.height_) {
        this.shift_ = this.height_;
      } else if (this.shift_ < 0) {
        this.shift_ = 0;
      }

      // Apply CSS transform to shift the element vertically.
      this.style.transform = `translate3d(0, ${-this.shift_}px, 0)`;

      // Update yScrollLast for determining scroll change on next tick.
      this.yScrollLast_ = (this.yScroll_ <= 0) ? 0 : this.yScroll_;

    }, false);
  }
}

export { ShiftyHeader };
