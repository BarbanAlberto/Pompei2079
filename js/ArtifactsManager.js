class ArtifactsManager {
  static #ARTIFACTS = /** @type {const} */ ([
    {id: "Anello", name: "Anello dei due serpenti", foundYear: "2018", description: "Un anello dorato, caratterizzato da due teste di serpente, appartenuto ad una fuggiasca di Pompei"},
    {id: "Caraffa", name: "Vaso", foundYear: "Sconosciuto", description: "Un vaso decorativo per contenere cibi e bevande"},
    {id: "Moneta", name: "Amuleto femminile", foundYear: "2019", description: "Un amuleto usato dalle donne per proteggersi dalla cattiva sorte"},
    {id: "Monile", name: "Monile", foundYear: "2019", description: "Un monile usato dalle donne come ornamento personale"},
    {id: "Coppa d'oro", name: "Coppa dorata", foundYear: "Sconosciuto", description: "Calice d'oro utilizzato per bere nei banchetti"},
    {id: "Statuetta", name: "Statuetta decorativa", foundYear: "2019", description: "Una statuetta decorativa rappresentante una figura umana "},
    {id: "Pane", name: "Pane", foundYear: "2015", description: "Una pagnotta di panis quadratis, cibo tipico dell'epoca romana"},
    {id: "Rana", name: "Bocca di fontana rana", foundYear: "Sconosciuto", description: "La bocca di una fontana a forma di rana"},
    {id: "Uomo rannicchiato", name: "Uomo rannicchiato", foundYear: "Sconosciuto", description: "Il calco di un uomo rannicchiato per la paura durante l'eruzione del Vesuvio"},
    {id: "Cavallo", name: "Cavallo", foundYear: "2018", description: "Il calco di un cavallo, con una ricca bardatura militare, rimasto coinvolto nell'eruzione"}
  ]);
  static get TOTAL() { return this.#ARTIFACTS.length; }
  static #ROWS = 2;
  static #COLUMNS = this.TOTAL / this.#ROWS;
  static #dialog = assertInstanceOf(document.getElementById("artifact-info"), HTMLDialogElement);
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

    this.#dialog.close();
  }

  static {
    /**
     * @param {HTMLElement} el
     * @param {number} i
     */
    const setX = (el, i) => el.style.left = `${(i % this.#COLUMNS) * 100 + 120}px`;
    const artifactTemplate = assertInstanceOf(document.getElementById("artifact"), HTMLTemplateElement).content;
    const dialogImg = assertInstanceOf(this.#dialog.firstElementChild, HTMLImageElement);

    this.#ARTIFACTS.forEach((info, i) => {
      const unknown = assertInstanceOf(artifactTemplate.cloneNode(true).childNodes[1], HTMLElement);
      setX(unknown, i);
      unknown.style.top = `${Math.floor(i / this.#COLUMNS) * 160 + 32}px`;

      const artifact = new Image();
      artifact.src = `img/${info.id}.png`;
      artifact.alt = info.id;
      artifact.classList.add("artifact", "unloaded");
      setX(artifact, i);
      artifact.style.bottom = `${216 - Math.floor(i / this.#COLUMNS) * 160}px`;

      artifact.addEventListener("click", () => {
        dialogImg.src = artifact.src;
        dialogImg.alt = info.id;
        assertNotNull(this.#dialog.lastElementChild).textContent =
          `${info.name}\nAnno di ritrovamento: ${info.foundYear}\n${info.description}`;

        setTimeout(() => {
          if (this.#dialog.open) return;

          this.#dialog.show();
          GameManager.toggleTime();
        });
      });

      this.#artifacts.push({unknown, artifact});
      this.#dialog.before(unknown);
      this.#dialog.before(artifact);
    });

    assertNotNull(document.getElementById("museum")).addEventListener("click", () => {
      if (!this.#dialog.open) return;

      this.#dialog.close();
      GameManager.toggleTime();
    });
  }
}
