class BuildingMenu {
  static #element = assertInstanceOf(document.getElementById("building-menu"), HTMLDialogElement);
  /** @type {ChildNode} */ static get element() { return this.#element; }
  /** @type {Node[]} */ static #costs = [];
  /** @type {?{onType(type: ?BuildingType): void, onClose(): void}} */ static #open = null;

  /**
   * @param {?{type: BuildingType, level: number}} currBuilding
   * @param {(type: ?BuildingType) => void} callback
   * @returns {Promise<void>}
   */
  static open(currBuilding, callback) {
    this.close();
    this.#updateCosts(currBuilding);
    this.#element.show();
    return new Promise(resolve => this.#open = {
      onType: type => {
        callback(type);
        this.#updateCosts(currBuilding);
      },
      onClose: resolve
    });
  }

  /** @param {?{type: BuildingType, level: number}} currBuilding */
  static #updateCosts(currBuilding) {
    for (const cost of this.#costs) cost.textContent = BuildingType.CREATION_COST.toString();
    if (currBuilding != null) {
      assertNotUndefined(this.#costs[BuildingType.values().indexOf(currBuilding.type)]).textContent =
        (currBuilding.level * BuildingType.UPGRADE_COST_INCREMENT).toString();
    }
  }

  static close() {
    this.#open?.onClose();
    this.#open = null;
    this.#element.close();
  }

  static {
    const template = assertInstanceOf(document.getElementById("building"), HTMLTemplateElement).content;
    const sell = assertInstanceOf(this.#element.firstElementChild, HTMLElement);

    for (const type of BuildingType.values()) {
      const button = assertInstanceOf(template.cloneNode(true).childNodes[1], HTMLElement);
      Building.setTypeImg(assertInstanceOf(button.children[0], HTMLImageElement), type);

      const info = assertNotUndefined(button.children[1]);
      assertNotUndefined(info.children[0]).textContent = type.name;

      this.#costs.push(assertNotUndefined(info.children[1]));
      button.addEventListener("click", () => assertNotNull(this.#open).onType(type));
      sell.before(button);
    }

    sell.addEventListener("click", () => assertNotNull(this.#open).onType(null));
  }
}
