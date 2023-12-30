class GameManager {
  static #DURATION = (8 * 60 + 30) * 1000;
  static #FRAMES = 22;
  static #LOSS_INTERVAL = 2000;
  static #time = assertNotNull(document.getElementById("time"));
  static #volcano = assertNotNull(document.getElementById("volcano"));
  static #overlay = assertNotNull(document.getElementById("overlay"));
  static #id = 0;

  static start() {
    const start = Date.now();
    const onFrame = () => {
      const time = (Date.now() - start) / this.#DURATION;
      const lost = time >= 1;
      if (lost) this.#onLoss();
      this.#time.style.width = `${Math.ceil(time * 100)}%`;
      this.#volcano.style.setProperty("--frame", Math.floor(time * this.#FRAMES).toString());
      if (!lost) this.#id = requestAnimationFrame(onFrame);
    };
    onFrame();
  }

  static onWin() { this.#onEnd("Hai Vinto!!!") }
  static #onLoss() {
    SoundManager.stop();

    for (const child of this.#volcano.children) {
      if (child instanceof HTMLImageElement) child.classList.add("unloaded");
    }

    new Animator(this.#volcano, 13, 22, 35).toggle();
    this.#onEnd("Hai perso...");
  }

  /** @param {string} text */
  static #onEnd(text) {
    cancelAnimationFrame(this.#id);
    this.#id = 0;

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
      }, this.#LOSS_INTERVAL);
    }, this.#LOSS_INTERVAL);
  }

  static #reset() {
    for (const child of this.#volcano.children) child.classList.toggle("unloaded");
    BuildingsManager.reset();
    ResourceManager.reset();
    CapManager.reset();
    ArtifactsManager.reset();
    Switcher.GAME.switch("buildings");
    SoundManager.stop();
    SoundManager.play("main");
  }
}
