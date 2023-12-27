class SoundManager {
  static #MAX_VOLUME = 10;
  static #SOUNDS = /** @type {const} */ ({
    main: {
      filename: "Alexander Nakarada - Battle Of The Creek.m4a",
      music: true
    },
    ingame: {
      filename: "Age of Empires II - Bass Bag.mp3",
      music: true
    },
    creation: {
      filename: "Creazione Edificio.mp3",
      music: false
    },
    destruction: {
      filename: "Distruzione Edificio.mp3",
      music: false
    }
  });

  /** @type {Set<HTMLAudioElement>} */ static #playing = new Set();
  /** @type {boolean} */ static #interacted = false;

  /** @type {number} */ static #volume;
  static get volume() { return this.#volume; }
  static set volume(volume) {
    this.#volume = Math.min(Math.max(volume, 0), this.#MAX_VOLUME);
    const scaledVolume = this.#volume / this.#MAX_VOLUME;
    for (const sound of this.#playing) sound.volume = scaledVolume;
  }

  /** @param {"main" | "ingame" | "creation" | "destruction"} sound */
  static play(sound) {
    const audio = this.#instantiate(sound);
    if (this.#interacted) audio.play();
    this.#playing.add(audio);
  }

  static stop() {
    if (this.#interacted) {
      for (const sound of this.#playing) {
        sound.pause();
        sound.src = sound.src;
      }
    }

    this.#playing.clear();
  }

  /** @param {"main" | "ingame" | "creation" | "destruction"} name */
  static #instantiate(name) {
    const info = this.#SOUNDS[name];
    const sound = new Audio(`sounds/${info.filename}`);
    sound.volume = this.#volume / this.#MAX_VOLUME;
    sound.loop = info.music;
    sound.addEventListener("pause", () => sound.currentTime == sound.duration ? this.#playing.delete(sound) : sound.play());
    return sound;
  }

  static {
    this.volume = this.#MAX_VOLUME / 2;

    /** @param {MouseEvent | KeyboardEvent} e */
    const onInteraction = e => {
      if (e instanceof KeyboardEvent && (e.key.length != 1 && e.key != "Tab")) return;
      removeEventListener("click", onInteraction);
      removeEventListener("keydown", onInteraction);
      for (const sound of this.#playing) sound.play();
      this.#interacted = true;
    };

    addEventListener("click", onInteraction);
    addEventListener("keydown", onInteraction);
  }
}
