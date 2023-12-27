class ResourceManager {
  /** @type {Record<"bricks" | "minerals" | "coins", {readonly element: Node, amount: number}>} */ static #resources = {
    bricks: {
      element: assertNotNull(document.getElementById("bricks")),
      amount: 500
    },
    minerals: {
      element: assertNotNull(document.getElementById("minerals")),
      amount: 500
    },
    coins: {
      element: assertNotNull(document.getElementById("coins")),
      amount: 500
    }
  };

  /** @param {"bricks" | "minerals" | "coins"} resource */
  static get(resource) { return this.#resources[resource].amount; }

  /**
   * @param {"bricks" | "minerals" | "coins"} resource
   * @param {number} delta
   */
  static change(resource, delta) {
    const res = this.#resources[resource];
    res.amount += delta;
    this.#updateDisplay(res);
  }

  /** @param {{element: Node, amount: number}} res */
  static #updateDisplay(res) { res.element.textContent = res.amount.toString(); }

  static {
    for (const res of Object.values(this.#resources)) this.#updateDisplay(res);
  }
}
