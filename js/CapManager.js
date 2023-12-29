class CapManager {
  static #CAPS = 4;
  static #CAP_COST = 3000;
  /** @type {Element[]} */ static #caps = [];
  static #builtCaps = 0;

  static tryBuild() {
    if (ResourceManager.get("bricks") < this.#CAP_COST) return;
    ResourceManager.change("bricks", -this.#CAP_COST, false);
    assertNotUndefined(this.#caps[this.#builtCaps]).classList.remove("unloaded");
    if (++this.#builtCaps == this.#CAPS) GameManager.onWin();
  }

  static reset() {
    for (const cap of this.#caps) cap.classList.add("unloaded");
    this.#builtCaps = 0;
  }

  static {
    const volcanoBack = assertNotNull(document.getElementById("volcano-back"));
    for (let i = 1; i <= this.#CAPS; i++) {
      const cap = new Image();
      cap.src = `img/Tappo${i}.png`;
      cap.alt = `Tappo ${i}`;
      cap.classList.add("unloaded");
      this.#caps.push(cap);
      volcanoBack.before(cap);
    }
  }
}
