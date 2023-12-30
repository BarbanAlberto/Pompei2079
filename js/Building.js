class Building {
  static #DURATION = 250;
  static #BASE_SCALE = 0.75;
  static #MAX_A_OFFSET = 0.1;
  static #MAX_OMEGA_OFFSET = 0.1;
  static #RANDOM_STEPS = 100;
  static #A_X = 0.05;
  static #A_Y = 0.1;
  static #OMEGA = 1000 / this.#DURATION;
  #type;
  #level = 1;
  #lot;
  #element;
  #id;

  /**
   * @param {BuildingType} type
   * @param {ParentNode} lot
   */
  constructor(type, lot) {
    this.#type = type;
    this.#lot = lot;
    this.#element = new Image();
    Building.setTypeImg(this.#element, this.#type);
    this.#lot.append(this.#element);
    this.#id = setInterval(() => this.#update(), BuildingType.UPDATE_INTERVAL);
  }

  get type() { return this.#type; }
  get level() { return this.#level; }

  #update() {
    const income = this.#type.onUpdate(this.#level);
    if (income == 0) return;

    const aX = Building.#A_X + Building.#random(Building.#MAX_A_OFFSET);
    const aY = Building.#A_Y + Building.#random(Building.#MAX_A_OFFSET);
    const omegaX = Building.#OMEGA + Building.#random(Building.#MAX_OMEGA_OFFSET);
    const omegaY = Building.#OMEGA + Building.#random(Building.#MAX_OMEGA_OFFSET);
    const start = Date.now();
    const onFrame = () => {
      const time = Date.now() - start;
      this.#element.style.setProperty("--x-scale", (1 - Building.#sin(aX, omegaX, time / 1000) / Building.#BASE_SCALE).toString());
      this.#element.style.setProperty("--y-scale", (1 + Building.#sin(aY, omegaY, time / 1000) / Building.#BASE_SCALE).toString());
      requestAnimationFrame(time < Building.#DURATION ? onFrame : () => this.#element.removeAttribute("style"));
    };
    onFrame();

    const floatingText = document.createElement("span");
    floatingText.textContent = "+" + Math.round(income * 10) / 10;
    floatingText.addEventListener("animationend", () => floatingText.remove());
    this.#lot.append(floatingText);
  }

  /** @param {number} max */
  static #random(max) { return Math.floor(Math.random() * (this.#RANDOM_STEPS + 1)) * max / this.#RANDOM_STEPS; }

  /**
   * @param {number} a
   * @param {number} omega
   * @param {number} x
   */
  static #sin(a, omega, x) { return a * Math.sin(omega * x * 2 * Math.PI); }

  upgrade() {
    const success = this.#type.onUpgrade(this.#level);
    if (success) this.#level++;
    return success;
  }

  destroy() {
    clearInterval(this.#id);
    this.#type.onDestroy(this.#level);
    this.#element.remove();
  }

  /**
   * @param {HTMLImageElement} img
   * @param {BuildingType} type
   */
  static setTypeImg(img, type) { img.src = `img/${type.id}.png`; }
}
