class Building {
  #type;
  #level = 1;
  #id;

  /** @param {BuildingType} type */
  constructor(type) {
    this.#type = type;
    this.#id = setInterval(() => this.#type.onUpdate(this.#level), BuildingType.UPDATE_INTERVAL);
  }

  get type() { return this.#type; }
  get level() { return this.#level; }

  upgrade() {
    const success = this.#type.onUpgrade(this.#level);
    if (success) this.#level++;
    return success;
  }

  destroy() {
    clearInterval(this.#id);
    this.#type.onDestroy(this.#level);
  }
}
