class Animator {
  static #FPS = 16;
  static #FRAMES = 3;
  static #MSPF = 1000 / this.#FPS;
  static #DURATION = this.#MSPF * this.#FRAMES;
  #element;
  #t = 0;
  #open = false;
  #id = 0;

  /** @param {HTMLElement} element */
  constructor(element) {
    this.#element = element;
    this.#element.style.setProperty("--frame", "0");
  }

  toggle() {
    cancelAnimationFrame(this.#id);

    this.#open = !this.#open;
    let last = Date.now();
    const onFrame = () => {
      const delta = (Date.now() - last) * (this.#open ? 1 : -1);
      this.#t = Math.min(Math.max(this.#t + delta, 0), Animator.#DURATION);
      this.#element.style.setProperty("--frame", (
        this.#open
        ? Math.floor(this.#t / Animator.#MSPF) + 1
        : Math.ceil(this.#t / Animator.#MSPF)
      ).toString());

      if (this.#open ? this.#t < Animator.#DURATION : this.#t > 0) {
        last = Date.now();
        this.#id = requestAnimationFrame(onFrame);
      } else this.#id = 0;
    }

    onFrame();
  }
}
