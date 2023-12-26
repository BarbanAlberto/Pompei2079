((volume, museum, artifactTemplate) => {
  bindClick("play", () => {
    Switcher.LEVEL.switch("game");
    SoundManager.stop();
    SoundManager.play("ingame");
  });
  bindClick("show-settings", () => Switcher.MAIN_MENU.switch("settings"));
  bindClick("back", () => Switcher.MAIN_MENU.switch("main"));

  function updateVolume() { volume.textContent = `${SoundManager.volume}`; }
  updateVolume();
  for (const {id, delta} of [{id: "inc", delta: 1}, {id: "dec", delta: -1}]) {
    bindClick(id, () => {
      SoundManager.volume += delta;
      updateVolume();
    });
  }

  bindClick("exit", () => {
    Switcher.LEVEL.switch("main");
    SoundManager.stop();
    SoundManager.play("main");
  });

  

  bindClick("show-volcano", () => Switcher.GAME.switch("volcano"));
  bindClick("show-museum", () => Switcher.GAME.switch("museum"));
  for (const el of document.getElementsByClassName("back")) {
    assertInstanceOf(el, HTMLElement).addEventListener("click", () => Switcher.GAME.switch("buildings"));
  }

  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 5; x++) {
      const unknown = assertInstanceOf(artifactTemplate.cloneNode(true).childNodes[1], HTMLElement);
      unknown.style.left = `${x * 100 + 56}px`;
      unknown.style.top = `${y * 160 + 32}px`;
      museum.append(unknown);
    }
  }

  /**
   * @param {string} id
   * @param {() => void} onClick
   */
  function bindClick(id, onClick) {
    assertNotNull(document.getElementById(id)).addEventListener("click", onClick);
  }
})(
  assertNotNull(document.getElementById("volume")),
  assertNotNull(document.getElementById("museum")),
  assertInstanceOf(document.getElementById("artifact"), HTMLTemplateElement).content
);

SoundManager.play("main");
