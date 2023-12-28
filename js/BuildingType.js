class BuildingType {
  static UPDATE_INTERVAL = 1000;
  static CREATION_COST = 100;
  static DEFAULT_INCOME_PER_MS = 0.001;
  static DEFAULT_INCOME_INCREMENT = 0.2;
  static BASE_COST = 7.5;
  static BASE_ARTIFACT_CHANCE = 0.005;
  static UPGRADE_COST_INCREMENT = 40;
  static RETURN = 0.5;

  static MARKET = new this("Mercato", "Mercato", {
    sound: "market",
    incomePerMs: 0.004,
    onUpdate(_level, cost, income) {
      if (ResourceManager.get("minerals") < cost) return false;
      ResourceManager.change("minerals", -cost, true);
      ResourceManager.change("coins", income, true);
      return true;
    }
  });

  static FURNACE = new this("Fornace", "Fornace", {
    sound: "furnace",
    incomePerMs: 0.002,
    incomeIncrement: 0.4,
    onUpdate(_level, cost, income) {
      if (ResourceManager.get("minerals") < cost) return false;
      ResourceManager.change("minerals", -cost, true);
      ResourceManager.change("bricks", income, true);
      return true;
    }
  });

  static MINE = new this("Miniera", "Miniera", {
    sound: "mine",
    incomePerMs: 0.004,
    onUpdate(_level, _cost, income) {
      ResourceManager.change("minerals", income, true);
      return true;
    }
  });

  static FINDS = new this("Reperti", "Reperti", {
    onUpdate(level) {
      const found = Math.random() < BuildingType.BASE_ARTIFACT_CHANCE * level;
      if (found) ArtifactsManager.onArtifactFound(Math.floor(Math.random() * ArtifactsManager.TOTAL));
      return found;
    }
  });

  static FORTUNE = new this("Fortuna", "Tempio Fortuna", {
    onCreate() {
      if (ResourceManager.bonuses.minerals >= 1) return false;
      ResourceManager.bonuses.minerals++;
      return true;
    },
    onDestroy() { ResourceManager.bonuses.minerals--; }
  });

  static WEALTH = new this("Ricchezza", "Tempio Ricchezza", {
    onCreate() {
      if (ResourceManager.bonuses.coins >= 1) return false;
      ResourceManager.bonuses.coins++;
      return true;
    },
    onDestroy() { ResourceManager.bonuses.coins--; }
  });

  static #VALUES = /** @type {const} */ ([this.MARKET, this.FURNACE, this.MINE, this.FINDS, this.FORTUNE, this.WEALTH]);

  #name;
  #id;
  #sound;
  #income;
  #incomeIncrement;
  #onCreate;
  #onUpdate;
  #onDestroy;

  /**
   * @param {string} name
   * @param {string} id
   * @param {{
   *   sound?: Sound,
   *   incomePerMs?: number,
   *   incomeIncrement?: number,
   *   onCreate?(): boolean,
   *   onUpdate?(level: number, cost: number, income: number): boolean,
   *   onDestroy?(): void
   * }} options
   */
  constructor(name, id, options) {
    this.#name = name;
    this.#id = id;
    this.#sound = options.sound ?? null;
    this.#income = (options.incomePerMs ?? BuildingType.DEFAULT_INCOME_PER_MS) * BuildingType.UPDATE_INTERVAL;
    this.#incomeIncrement = options.incomeIncrement ?? BuildingType.DEFAULT_INCOME_INCREMENT;
    this.#onCreate = options.onCreate ?? (() => true);
    this.#onUpdate = options.onUpdate ?? (() => false);
    this.#onDestroy = options.onDestroy ?? (() => {});
  }

  get name() { return this.#name; }
  get id() { return this.#id; }

  onCreate() {
    if (ResourceManager.get("bricks") < BuildingType.CREATION_COST || !this.#onCreate()) return false;
    ResourceManager.change("bricks", -BuildingType.CREATION_COST, false);
    if (this.#sound != null) SoundManager.play("creation");
    return true;
  }

  /** @param {number} level */
  onUpdate(level) {
    if (this.#onUpdate(
      level,
      Math.ceil(BuildingType.BASE_COST / Math.round(level / 2)),
      ((level - 1) * this.#incomeIncrement + 1) * this.#income
    ) && this.#sound != null) {
      SoundManager.play(this.#sound);
    }
  }

  /** @param {number} level */
  onUpgrade(level) {
    const cost = level * BuildingType.UPGRADE_COST_INCREMENT;
    if (ResourceManager.get("coins") < cost) return false;
    ResourceManager.change("coins", -cost, false);
    return true;
  }

  /** @param {number} level */
  onDestroy(level) {
    if (this.#sound != null) SoundManager.play("destruction");
    ResourceManager.change("bricks", BuildingType.RETURN * BuildingType.CREATION_COST, false);
    ResourceManager.change("coins", level * (level - 1) / 2 * BuildingType.RETURN * BuildingType.UPGRADE_COST_INCREMENT, false);
    this.#onDestroy();
  }

  static values() { return this.#VALUES; }
}
