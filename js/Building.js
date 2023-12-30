class Building {
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

    const floatingText = document.createElement("span");
    floatingText.textContent = "+" + Math.round(income * 10) / 10;
    floatingText.addEventListener("animationend", () => floatingText.remove());
    this.#lot.append(floatingText);
  }

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
