class Building {
  static CREATION_COST = 100;
  static UPGRADE_COST_INCREMENT = 40;
  #type;
  #level = 1;

  /** @param {BuildingType} type */
  constructor(type) { this.#type = type; }

  get type() { return this.#type; }
  get level() { return this.#level; }
  get upgradeCost() { return this.#level * Building.UPGRADE_COST_INCREMENT; }
  upgrade() { this.#level++; }
}
