class BuildingType {
  static MARKET = new this("Mercato", "Mercato");
  static FURNACE = new this("Fornace", "Fornace");
  static MINE = new this("Miniera", "Miniera");
  static FINDS = new this("Reperti", "Reperti");
  static FORTUNE = new this("Fortuna", "Tempio Fortuna");
  static WEALTH = new this("Ricchezza", "Tempio Ricchezza");
  static #VALUES = /** @type {const} */ ([this.MARKET, this.FURNACE, this.MINE, this.FINDS, this.FORTUNE, this.WEALTH]);

  #name;
  #id;

  /**
   * @param {string} name
   * @param {string} id
   */
  constructor(name, id) {
    this.#name = name;
    this.#id = id;
  }

  get name() { return this.#name; }
  get id() { return this.#id; }

  static values() { return this.#VALUES; }
}
