class GameManager {
  static #DURATION = (8 * 60 + 30) * 1000;
  static #FIRST_VOLCANO_FRAMES = 22;
  static #LAST_VOLCANO_FRAME = 35;
  static #ERUPTION_FPS = 13;
  static #LOSS_STOP_DELAY = 1100;
  static #END_INTERVAL = 2000;
  static #time = assertNotNull(document.getElementById("time"));
  static #volcano = assertNotNull(document.getElementById("volcano"));
  static #overlay = assertNotNull(document.getElementById("overlay"));
  static #tick = () => {};
  static #last = 0;
  static #id = 0;
  /** @type {((paused: boolean) => void)[]} */ static #onToggle = [];

  static get running() { return this.#id > 0; }

  /** @param {(paused: boolean) => void} listener */ static addToggleListener(listener) { this.#onToggle.push(listener); }

  /** @param {(paused: boolean) => void} listener */
  static removeToggleListener(listener) { this.#onToggle.splice(this.#onToggle.indexOf(listener), 1); }

  /** @param {boolean} paused */
  static #dispatchToggle(paused) {
    for (const listener of this.#onToggle) listener(paused);
  }

  static start() {
    let time = 0;
    this.#last = Date.now();
    (this.#tick = () => {
      const curr = Date.now();
      time += curr - this.#last;

      const lost = time >= this.#DURATION;
      if (lost) this.#onLoss();

      this.#time.style.width = `${Math.ceil(time * 100 / this.#DURATION)}%`;
      this.#volcano.style.setProperty("--frame", Math.floor(time * this.#FIRST_VOLCANO_FRAMES / this.#DURATION).toString());

      if (!lost) {
        this.#last = curr;
        this.#id = requestAnimationFrame(this.#tick);
      }
    })();

    FlyingObjectsManager.start();
  }

  static #pause() {
    cancelAnimationFrame(this.#id);
    this.#last = 0;
  }

  static toggleTime() {
    if (this.running) {
      this.#pause();
      this.#id = 0;
    } else {
      this.#last = Date.now();
      this.#tick();
    }

    this.#dispatchToggle(!this.running);
  }

  static onWin() { this.#onEnd("Hai Vinto!!!") }
  static #onLoss() {
    SoundManager.stop();

    for (const child of this.#volcano.children) {
      if (child instanceof HTMLImageElement) child.classList.add("unloaded");
    }

    setTimeout(() => this.#id = 0, this.#LOSS_STOP_DELAY);
    new Animator(this.#volcano, this.#ERUPTION_FPS, this.#FIRST_VOLCANO_FRAMES, this.#LAST_VOLCANO_FRAME).toggle();
    this.#onEnd("Hai perso...");
  }

  /** @param {string} text */
  static #onEnd(text) {
    this.#pause();
    this.#tick = () => {};

    for (const child of this.#volcano.children) {
      if (child instanceof HTMLButtonElement) child.classList.add("unloaded");
    }

    Switcher.GAME.switch("volcano");
    setTimeout(() => {
      this.#overlay.classList.remove("unloaded");
      this.#overlay.textContent = text;
      setTimeout(() => {
        Switcher.LEVEL.switch("main");
        this.#reset();
      }, this.#END_INTERVAL);
    }, this.#END_INTERVAL);
  }

  static #reset() {
    for (const child of this.#volcano.children) child.classList.toggle("unloaded");
    FlyingObjectsManager.reset();
    this.#id = 0;
    this.#dispatchToggle(false);
    BuildingsManager.reset();
    ResourceManager.reset();
    CapManager.reset();
    ArtifactsManager.reset();
    Switcher.GAME.switch("buildings");
    SoundManager.stop();
    SoundManager.play("main");
  }
}
