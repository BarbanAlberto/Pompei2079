/** @template {string[]} TNames */
class Switcher {
  /** @type {Switcher<["main", "game"]>} */ static #LEVEL = new this({
    main: assertNotNull(document.getElementById("main-menu")),
    game: assertNotNull(document.getElementById("game"))
  }, true);
  static get LEVEL() { return this.#LEVEL; }

  /** @type {Switcher<["main", "settings"]>} */ static #MAIN_MENU = new this({
    main: assertNotNull(document.getElementById("main")),
    settings: assertNotNull(document.getElementById("settings"))
  }, false);
  static get MAIN_MENU() { return this.#MAIN_MENU; }

  /** @type {Switcher<["buildings", "volcano", "museum"]>} */ static #GAME = new this({
    buildings: assertNotNull(document.getElementById("buildings")),
    volcano: assertNotNull(document.getElementById("volcano")),
    museum: assertNotNull(document.getElementById("museum"))
  }, false);
  static get GAME() { return this.#GAME; }

  #elements;
  #hideClass;
  /** @type {HTMLElement} */ #shown;

  /**
   * @param {{[name in TNames[number]]: HTMLElement}} elements
   * @param {boolean} isLevel
   */
  constructor(elements, isLevel) {
    this.#elements = elements;
    this.#hideClass = isLevel ? "unloaded" : "hidden";

    const values = Object.values(/** @type {{[name: string]: HTMLElement}} */ (this.#elements));
    this.#shown = assertNotUndefined(values[0]);
    for (const el of values.slice(1)) this.#setHidden(el, true);
  }

  /** @param {TNames[number]} name */
  switch(name) {
    this.#setHidden(this.#shown, true);
    this.#shown = this.#elements[name];
    this.#setHidden(this.#shown, false);
  }

  /**
   * @param {HTMLElement} el
   * @param {boolean} hidden
   */
  #setHidden(el, hidden) { el.classList.toggle(this.#hideClass, hidden); }
}
