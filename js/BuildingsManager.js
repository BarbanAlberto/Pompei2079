class BuildingsManager {
  static #ROWS = 2;
  static #COLUMNS = 7;
  /** @type {(?Building)[]} */ static #buildings = Array.from({length: this.#ROWS * this.#COLUMNS}, () => null);
  /** @type {ParentNode[]} */ static #lots = [];

  /**
   * @param {number} id
   * @param {?BuildingType} type
   */
  static #set(id, type) {
    const lot = assertNotUndefined(this.#lots[id]);
    if (type != null) {
      this.#buildings[id] = new Building(type);
      const img = new Image();
      BuildingMenu.setBuildingImg(img, type);
      lot.append(img);
    } else if (this.#buildings[id] != null) {
      this.#buildings[id] = null;
      assertNotNull(lot.lastChild).remove();
    }
  }

  static reset() {
    BuildingMenu.close();

    for (let i = 0; i < this.#buildings.length; i++) {
      this.#buildings[i]?.destroy();
      this.#set(i, null);
    }
  }

  static {
    const lotTemplate = assertInstanceOf(document.getElementById("lot"), HTMLTemplateElement).content;

    for (let x = 0; x < this.#COLUMNS; x++) {
      for (let y = 0; y < this.#ROWS; y++) {
        const id = x * this.#ROWS + y;

        const lot = assertInstanceOf(lotTemplate.cloneNode(true).childNodes[1], HTMLElement);
        lot.style.left = `${x * 50 + 146}px`;
        lot.style.top = `${(y * 2 + 1 - x % 2) * 29 + 218}px`;

        const img = assertInstanceOf(lot.firstElementChild, HTMLImageElement);
        img.alt = `Apri / Chiudi menù edificio ${id + 1}`;

        const animator = new Animator(img, 16, 0, 4);
        lot.addEventListener("click", () => {
          if (animator.toggled) {
            BuildingMenu.close();
            return;
          }

          animator.toggle();
          const curr = assertNotUndefined(this.#buildings[id]);
          BuildingMenu.open(curr, type => {
            if (type == null) {
              curr?.destroy();
              BuildingMenu.close();
              this.#set(id, null);
            } else if (curr == null) {
              if (!type.onCreate()) return;
              BuildingMenu.close();
              this.#set(id, type);
            } else if (type == curr.type) curr.upgrade();
          }).then(() => animator.toggle());
        });

        this.#lots.push(lot);
        BuildingMenu.element.before(lot);
      }
    }
  }
}
