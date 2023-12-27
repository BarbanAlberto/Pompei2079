class BuildingType {
  static CREATION_COST = 100;
  static UPGRADE_COST_INCREMENT = 40;
  static RETURN = 0.5;

  static MARKET = new this("Mercato", "Mercato", true);
  static FURNACE = new this("Fornace", "Fornace", true);
  static MINE = new this("Miniera", "Miniera", true);
  static FINDS = new this("Reperti", "Reperti", false);
  static FORTUNE = new this(
    "Fortuna", "Tempio Fortuna", false,
    () => BuildingsManager.fortunePlaced ? false : BuildingsManager.fortunePlaced = true,
    () => BuildingsManager.fortunePlaced = false
  );
  static WEALTH = new this(
    "Ricchezza", "Tempio Ricchezza", false,
    () => BuildingsManager.wealthPlaced ? false : BuildingsManager.wealthPlaced = true,
    () => BuildingsManager.wealthPlaced = false
  );

  static #VALUES = /** @type {const} */ ([this.MARKET, this.FURNACE, this.MINE, this.FINDS, this.FORTUNE, this.WEALTH]);

  #name;
  #id;
  #hasSounds;
  #onCreate;
  #onDestroy;

  /**
   * @param {string} name
   * @param {string} id
   * @param {boolean} hasSounds
   */
  constructor(name, id, hasSounds, onCreate = () => true, onDestroy = () => {}) {
    this.#name = name;
    this.#id = id;
    this.#hasSounds = hasSounds;
    this.#onCreate = onCreate;
    this.#onDestroy = onDestroy;
  }

  get name() { return this.#name; }
  get id() { return this.#id; }

  onCreate() {
    if (ResourceManager.get("bricks") < BuildingType.CREATION_COST || !this.#onCreate()) return false;
    ResourceManager.change("bricks", -BuildingType.CREATION_COST);
    if (this.#hasSounds) SoundManager.play("creation");
    return true;
  }

  /** @param {number} level */
  onUpgrade(level) {
    const cost = level * BuildingType.UPGRADE_COST_INCREMENT;
    if (ResourceManager.get("coins") < cost) return false;
    ResourceManager.change("coins", -cost);
    return true
  }

  /** @param {number} level */
  onDestroy(level) {
    if (this.#hasSounds) SoundManager.play("destruction");
    ResourceManager.change("bricks", BuildingType.CREATION_COST * BuildingType.RETURN);
    ResourceManager.change("coins", level * (level - 1) / 2 * BuildingType.UPGRADE_COST_INCREMENT * BuildingType.RETURN);
    this.#onDestroy();
  }

  static values() { return this.#VALUES; }
}
