class GameManager {
  static #DURATION = (8 * 60 + 30) * 1000;
  static #FRAMES = 22;
  static #LOSS_INTERVAL = 2000;
  static #time = assertNotNull(document.getElementById("time"));
  static #volcano = assertNotNull(document.getElementById("volcano"));
  static #overlay = assertNotNull(document.getElementById("overlay"));

  static start() {
    const start = Date.now();
    const onFrame = () => {
      const time = (Date.now() - start) / this.#DURATION;
      const lost = time >= 1;
      if (lost) this.#onLoss();
      this.#time.style.width = `${Math.ceil(time * 100)}%`;
      this.#volcano.style.setProperty("--frame", Math.floor(time * this.#FRAMES).toString());
      if (!lost) requestAnimationFrame(onFrame);
    }

    onFrame();
  }

  static #onLoss() {
    SoundManager.stop();
    new Animator(this.#volcano, 13, 22, 35).toggle();
    for (const child of this.#volcano.children) child.classList.add("unloaded");
    Switcher.GAME.switch("volcano");
    setTimeout(() => {
      this.#overlay.classList.remove("unloaded");
      this.#overlay.textContent = "Hai perso...";
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
    ArtifactsManager.reset();
    Switcher.GAME.switch("buildings");
    SoundManager.stop();
    SoundManager.play("main");
  }
}
