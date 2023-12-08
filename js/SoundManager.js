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

  /** @type {Set<HTMLAudioElement> | true} */ static #interacted = new Set();
  static #stopping = false;

  /** @param {"main" | "ingame"} sound */
  static play(sound) {
    const audio = this.#SOUNDS[sound];
    if (this.#interacted == true) audio.play();
    else this.#interacted.add(audio);
  }

  static stop() {
    if (this.#interacted != true) {
      for (const sound of this.#interacted) {
        if (sound.loop) this.#interacted.delete(sound);
      }
    } else {
      this.#stopping = true;
      for (const sound of Object.values(this.#SOUNDS)) {
        if (!sound.loop) continue;
        sound.pause();
        sound.currentTime = 0;
      }
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

  static {
    this.volume = this.#MAX_VOLUME / 2;

    const onInteraction = () => {
      removeEventListener("click", onInteraction);
      removeEventListener("keydown", onInteraction);
      if (this.#interacted == true) throw new TypeError("Assertion failed: interacted was already true");
      for (const sound of this.#interacted) sound.play();
      this.#interacted = true;
    };

    addEventListener("click", onInteraction);
    addEventListener("keydown", onInteraction);
  }
}
