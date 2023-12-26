class ResourceManager {
  static #resources = {
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
      amount: 0
    }
  };

  /**
   * @param {"bricks" | "minerals" | "coins"} resource
   * @param {number} amount
   */
  static change(resource, amount) {
    const res = this.#resources[resource];
    if (res.amount < -amount) return false;

    res.amount += amount;
    this.#updateDisplay(res);
    return true;
  }

  /** @param {{element: Node, amount: number}} res */
  static #updateDisplay(res) { res.element.textContent = res.amount.toString(); }

  static {
    for (const res of Object.values(this.#resources)) this.#updateDisplay(res);
  }
}
