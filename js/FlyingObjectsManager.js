class FlyingObjectsManager {
  static #parent = assertNotNull(document.getElementById("flying-objects"));
  /** @type {[number, number]} */ static #ids = [0, 0];

  static start() {
    for (let i = 0; i < 5; i++) this.#spawn(true, false);
    for (let i = 0; i < 2; i++) this.#spawn(false, false);
    this.#spawnLoop(2500, 7500, true);
    this.#spawnLoop(10000, 30000, false);
  }

  /**
   * @param {number} minInterval
   * @param {number} maxInterval
   * @param {boolean} isBird
   */
  static #spawnLoop(minInterval, maxInterval, isBird) {
    this.#ids[+isBird] = setTimeout(() => {
      this.#spawn(isBird, true);
      this.#spawnLoop(minInterval, maxInterval, isBird);
    }, Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval);
  }

  /**
   * @param {boolean} isBird
   * @param {boolean} fromEdge
   */
  static #spawn(isBird, fromEdge) {
    if (!GameManager.running) return;

    const img = new Image();
    img.src = `img/${isBird ? "Uccello" : `Nuvola${Math.floor(Math.random() * 4) + 1}`}.png`;
    if (isBird) img.classList.add("bird");
    img.style.top = `${Math.floor(Math.random() * 121)}px`;

    const right = Math.random() < 0.5;
    const scale = Math.random() * 0.5 + 0.75;

    img.addEventListener("load", () => {
      const width = (isBird ? img.naturalWidth / 8 : img.naturalWidth) * scale;
      const startX = fromEdge ? right ? -width : 640 : Math.floor(Math.random() * (640 + width)) - width;
      const endX = right ? 640 : -width;

      const animation = img.animate([
        {transform: `translateX(${startX}px) scale(${scale})`},
        {transform: `translateX(${endX}px) scale(${scale})`}
      ], Math.abs(startX - endX) * 1000 / (Math.random() * 15 + (isBird ? 20 : 5)));

      function toggle() {
        if (!GameManager.running) animation.pause();
        else animation.play();
      }

      animation.addEventListener("finish", () => {
        img.remove();
        GameManager.removeToggleListener(toggle);
      });

      GameManager.addToggleListener(toggle);
      this.#parent.append(img);
    }, {once: true});
  }

  static reset() {
    for (const id of this.#ids) clearTimeout(id);
    this.#ids = [0, 0];
    for (const img of this.#parent.children) assertNotUndefined(img.getAnimations()[0]).finish();
  }

  static { GameManager.addToggleListener(paused => this.#parent.classList.toggle("paused", paused)); }
}
