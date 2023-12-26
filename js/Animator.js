class Animator {
  static #FPS = 16;
  static #FRAMES = 3;
  static #MSPF = 1000 / this.#FPS;
  static #DURATION = this.#MSPF * this.#FRAMES;
  #element;
  #t = 0;
  #toggled = false;
  #id = 0;

  /** @param {HTMLElement} element */
  constructor(element) {
    this.#element = element;
    this.#element.style.setProperty("--frame", "0");
  }

  get toggled() { return this.#toggled; }

  toggle() {
    cancelAnimationFrame(this.#id);

    this.#toggled = !this.#toggled;
    let last = Date.now();
    const onFrame = () => {
      const delta = (Date.now() - last) * (this.#toggled ? 1 : -1);
      this.#t = Math.min(Math.max(this.#t + delta, 0), Animator.#DURATION);
      this.#element.style.setProperty("--frame", (
        this.#toggled
        ? Math.floor(this.#t / Animator.#MSPF) + 1
        : Math.ceil(this.#t / Animator.#MSPF)
      ).toString());

      if (this.#toggled ? this.#t < Animator.#DURATION : this.#t > 0) {
        last = Date.now();
        this.#id = requestAnimationFrame(onFrame);
      } else this.#id = 0;
    }

    onFrame();
  }
}
