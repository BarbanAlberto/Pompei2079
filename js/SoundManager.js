class SoundManager {
  static #MAX_VOLUME = 10;
  static #SOUNDS = {
    main: this.#createSound("Alexander Nakarada - Battle Of The Creek.m4a", true),
    ingame: this.#createSound("Age of Empires II - Bass Bag.mp3", true)
  };

  /** @type {number} */ static #volume;
  static get volume() { return this.#volume; }
  static set volume(volume) {
    this.#volume = Math.min(Math.max(volume, 0), this.#MAX_VOLUME);
    const scaledVolume = this.#volume / this.#MAX_VOLUME;
    for (const sound of Object.values(this.#SOUNDS)) sound.volume = scaledVolume;
  }

  static #interacted = false;
  static #stopping = false;

  /** @param {"main" | "ingame"} sound */
  static play(sound) {
    if (this.#interacted) {
      this.#play(sound);
      return;
    }

    const play = () => {
      this.#interacted = true;
      removeEventListener("click", play);
      removeEventListener("keydown", play);
      this.#play(sound);
    };

    addEventListener("click", play);
    addEventListener("keydown", play);
  }

  /** @param {Parameters<typeof SoundManager["play"]>[0]} sound */
  static #play(sound) { this.#SOUNDS[sound].play(); }

  static stop() {
    this.#stopping = true;
    for (const sound of Object.values(this.#SOUNDS)) {
      if (!sound.loop) continue;
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * @param {string} filename
   * @param {boolean} music
   */
  static #createSound(filename, music) {
    const sound = new Audio(`sounds/${filename}`);
    if (music) {
      sound.loop = true;
      sound.addEventListener("pause", () => {
        if (this.#stopping) {
          this.#stopping = false;
          return;
        }
        sound.play();
      });
    }
    return sound;
  }

  static { this.volume = this.#MAX_VOLUME / 2; }
}
