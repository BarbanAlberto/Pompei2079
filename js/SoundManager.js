/** @typedef {"main" | "ingame" | "creation" | "market" | "furnace" | "mine" | "destruction"} Sound */

class SoundManager {
  static #MAX_VOLUME = 10;
  /** @type {Record<Sound, {readonly filename: string, readonly music: boolean}>} */ static #SOUNDS = {
    main: {filename: "Alexander Nakarada - Battle Of The Creek.m4a", music: true},
    ingame: {filename: "Age of Empires II - Bass Bag.mp3", music: true},
    creation: {filename: "Creazione Edificio.mp3", music: false},
    market: {filename: "Produzione Mercato.mp3", music: false},
    furnace: {filename: "Produzione Fornace.mp3", music: false},
    mine: {filename: "Produzione Miniera.mp3", music: false},
    destruction: {filename: "Distruzione Edificio.mp3", music: false}
  };

  /** @type {Set<HTMLAudioElement>} */ static #playing = new Set();
  /** @type {boolean} */ static #interacted = false;

  /** @type {number} */ static #volume;
  static get volume() { return this.#volume; }
  static set volume(volume) {
    this.#volume = Math.min(Math.max(volume, 0), this.#MAX_VOLUME);
    const scaledVolume = this.#volume / this.#MAX_VOLUME;
    for (const audio of this.#playing) audio.volume = scaledVolume;
  }

  /** @param {Sound} sound */
  static play(sound) {
    const audio = this.#instantiate(sound);
    if (this.#interacted) {
      audio.play().catch(e => {
        if (e.name != "AbortError") throw e;
      });
    }

    this.#playing.add(audio);
  }

  static stop() {
    if (this.#interacted) {
      for (const audio of this.#playing) {
        audio.pause();
        audio.src = audio.src;
      }
    }

    this.#playing.clear();
  }

  /** @param {Sound} sound */
  static #instantiate(sound) {
    const info = this.#SOUNDS[sound];
    const audio = new Audio(`sounds/${info.filename}`);
    audio.volume = this.#volume / this.#MAX_VOLUME;
    audio.loop = info.music;
    audio.addEventListener("pause", () => audio.currentTime == audio.duration ? this.#playing.delete(audio) : audio.play());
    return audio;
  }

  static {
    this.volume = this.#MAX_VOLUME / 2;

    /** @param {MouseEvent | KeyboardEvent} e */
    const onInteraction = e => {
      if (e instanceof KeyboardEvent && (e.key.length != 1 && e.key != "Tab")) return;
      removeEventListener("click", onInteraction);
      removeEventListener("keydown", onInteraction);
      for (const audio of this.#playing) audio.play();
      this.#interacted = true;
    };

    addEventListener("click", onInteraction);
    addEventListener("keydown", onInteraction);
  }
}
