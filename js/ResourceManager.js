/** @typedef {"bricks" | "minerals" | "coins"} Resource */

class ResourceManager {
  static #INITIAL_AMOUNT = 500;
  static #MULTIPLIER = 0.5;
  /** @type {Record<Resource, {readonly element: Node, amount: number}>} */ static #resources = {
    bricks: {
      element: assertNotNull(document.getElementById("bricks")),
      amount: this.#INITIAL_AMOUNT
    },
    minerals: {
      element: assertNotNull(document.getElementById("minerals")),
      amount: this.#INITIAL_AMOUNT
    },
    coins: {
      element: assertNotNull(document.getElementById("coins")),
      amount: this.#INITIAL_AMOUNT
    }
  };

  /** @type {Record<Resource, number>} */ static bonuses = {
    bricks: 0,
    minerals: 0,
    coins: 0
  };

  /** @param {Resource} resource */
  static get(resource) { return this.#resources[resource].amount; }

  /**
   * @param {Resource} resource
   * @param {number} delta
   * @param {boolean} multiply
   */
  static change(resource, delta, multiply) {
    const res = this.#resources[resource];
    res.amount += multiply ? delta * (1 + this.bonuses[resource] * this.#MULTIPLIER) : delta;
    this.#updateDisplay(res);
  }

  /** @param {{element: Node, amount: number}} res */
  static #updateDisplay(res) { res.element.textContent = Math.round(res.amount).toString(); }

  static {
    for (const res of Object.values(this.#resources)) this.#updateDisplay(res);
  }
}
