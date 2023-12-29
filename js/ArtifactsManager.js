class ArtifactsManager {
  static #NAMES = /** @type {const} */ ([
    "Anello", "Caraffa", "Moneta", "Monile", "Coppa d'oro",
    "Statuetta", "Pane", "Rana", "Uomo rannicchiato", "Cavallo"
  ]);
  static get TOTAL() { return this.#NAMES.length; }
  static #ROWS = 2;
  static #COLUMNS = this.TOTAL / this.#ROWS;
  static #element = assertNotNull(document.getElementById("museum"));
  /** @type {{unknown: Element, artifact: Element}[]} */ static #artifacts = [];

  /** @param {number} i */
  static onArtifactFound(i) {
    const artifact = assertNotUndefined(this.#artifacts[i]);
    artifact.unknown.classList.add("unloaded");
    artifact.artifact.classList.remove("unloaded");
  }

  static reset() {
    for (const artifact of this.#artifacts) {
      artifact.artifact.classList.add("unloaded");
      artifact.unknown.classList.remove("unloaded");
    }
  }

  static {
    /**
     * @param {HTMLElement} el
     * @param {number} i
     */
    const setX = (el, i) => el.style.left = `${(i % this.#COLUMNS) * 100 + 120}px`;
    const artifactTemplate = assertInstanceOf(document.getElementById("artifact"), HTMLTemplateElement).content;

    this.#NAMES.forEach((name, i) => {
      const unknown = assertInstanceOf(artifactTemplate.cloneNode(true).childNodes[1], HTMLElement);
      setX(unknown, i);
      unknown.style.top = `${Math.floor(i / this.#COLUMNS) * 160 + 32}px`;

      const artifact = new Image();
      artifact.src = `img/${name}.png`;
      artifact.alt = name;
      artifact.classList.add("artifact", "unloaded");
      setX(artifact, i);
      artifact.style.bottom = `${216 - Math.floor(i / this.#COLUMNS) * 160}px`;

      this.#artifacts.push({unknown, artifact});
      this.#element.append(unknown);
      this.#element.append(artifact);
    });
  }
}
