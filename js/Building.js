class Building {
  #type;
  #level = 1;

  /** @param {BuildingType} type */
  constructor(type) { this.#type = type; }

  get type() { return this.#type; }
  get level() { return this.#level; }

  upgrade() {
    const success = this.#type.onUpgrade(this.#level);
    if (success) this.#level++;
    return success;
  }

  destroy() { this.#type.onDestroy(this.#level); }
}
