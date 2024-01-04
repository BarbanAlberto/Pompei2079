class Animator {
  #element;
  #firstFrame;
  #mspf;
  #duration;
  #t = 0;
  #toggled = false;
  #id = 0;

  /**
   * @param {HTMLElement} element
   * @param {number} fps
   * @param {number} firstFrame
   * @param {number} lastFrame
   */
  constructor(element, fps, firstFrame, lastFrame) {
    this.#element = element;
    this.#firstFrame = firstFrame;
    this.#mspf = 1000 / fps;
    this.#duration = this.#mspf * (lastFrame - this.#firstFrame - 1);
    this.#element.style.setProperty("--frame", "0");
  }

  get toggled() { return this.#toggled; }

  /** @param {boolean} toggled */
  toggle(toggled = !this.#toggled) {
    if (toggled == this.#toggled) return;

    cancelAnimationFrame(this.#id);

    this.#toggled = !this.#toggled;
    let last = Date.now();
    const onFrame = () => {
      const curr = Date.now();

      this.#t = Math.min(Math.max(this.#t + (curr - last) * (this.#toggled ? 1 : -1), 0), this.#duration);
      this.#element.style.setProperty("--frame", ((
        this.#toggled
        ? Math.floor(this.#t / this.#mspf) + 1
        : Math.ceil(this.#t / this.#mspf)
      ) + this.#firstFrame).toString());

      if (this.#toggled ? this.#t < this.#duration : this.#t > 0) {
        last = curr;
        this.#id = requestAnimationFrame(onFrame);
      } else this.#id = 0;
    };
    onFrame();
  }
}
