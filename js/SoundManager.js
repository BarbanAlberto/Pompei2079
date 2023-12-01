class SoundManager {
  static #MAX_VOLUME = 10;

  /** @type {number} */ static #volume;
  static get volume() { return this.#volume; }
  static set volume(volume) {
    this.#volume = Math.min(Math.max(volume, 0), this.#MAX_VOLUME);
    this.#MENU_MUSIC.volume = this.#volume / this.#MAX_VOLUME;
  }

  static #MENU_MUSIC = new Audio("sounds/Alexander Nakarada - Battle Of The Creek.m4a");
  static #stopping = false;
  static {
    this.#MENU_MUSIC.loop = true;
    this.#MENU_MUSIC.addEventListener("pause", () => {
      if (this.#stopping) {
        this.#stopping = false;
        return;
      }
      this.#MENU_MUSIC.play();
    });
    this.volume = this.#MAX_VOLUME / 2;
  }

  static play() {
    addEventListener("pointerdown", () => this.#MENU_MUSIC.play(), {once: true});
  }

  static stop() {
    this.#stopping = true;
    this.#MENU_MUSIC.pause();
  }
}
