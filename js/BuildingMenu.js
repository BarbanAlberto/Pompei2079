class BuildingMenu {
  static #element = assertInstanceOf(document.getElementById("building-menu"), HTMLDialogElement);
  /** @type {ChildNode} */ static get element() { return this.#element; }
  /** @type {Node[]} */ static #costs = [];
  /** @type {?{onType(type: ?BuildingType): void, onClose(): void}} */ static #open = null;

  /**
   * @param {?{type: BuildingType, upgradeCost: number}} currBuilding
   * @param {(type: ?BuildingType) => void} callback
   * @returns {Promise<void>}
   */
  static open(currBuilding, callback) {
    if (this.#open != null) this.close();

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

  /** @param {?{type: BuildingType, upgradeCost: number}} currBuilding */
  static #updateCosts(currBuilding) {
    for (const cost of this.#costs) cost.textContent = Building.CREATION_COST.toString();
    if (currBuilding != null) {
      assertNotUndefined(this.#costs[BuildingType.values().indexOf(currBuilding.type)]).textContent = currBuilding.upgradeCost.toString();
    }
  }

  static close() {
    assertNotNull(this.#open).onClose();
    this.#open = null;
    this.#element.close();
  }

  /**
   * @param {HTMLImageElement} img
   * @param {BuildingType} type
   */
  static setBuildingImg(img, type) { img.src = `img/${type.id}.png`; }

  static {
    const template = assertInstanceOf(document.getElementById("building"), HTMLTemplateElement).content;
    const sell = assertInstanceOf(this.#element.firstElementChild, HTMLElement);

    for (const type of BuildingType.values()) {
      const button = assertInstanceOf(template.cloneNode(true).childNodes[1], HTMLElement);
      this.setBuildingImg(assertInstanceOf(button.children[0], HTMLImageElement), type);

      const info = assertNotUndefined(button.children[1]);
      assertNotUndefined(info.children[0]).textContent = type.name;

      this.#costs.push(assertNotUndefined(info.children[1]));
      button.addEventListener("click", () => assertNotNull(this.#open).onType(type));
      sell.before(button);
    }

    sell.addEventListener("click", () => assertNotNull(this.#open).onType(null));
  }
}
