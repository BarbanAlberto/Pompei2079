(volume => {
  bindClick("play", () => {
    Switcher.LEVEL.switch("game");
    SoundManager.stop();
    SoundManager.play("ingame");
    GameManager.start();
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

  bindClick("show-volcano", () => Switcher.GAME.switch("volcano"));
  bindClick("show-museum", () => Switcher.GAME.switch("museum"));
  for (const el of document.getElementsByClassName("back")) {
    assertInstanceOf(el, HTMLElement).addEventListener("click", () => Switcher.GAME.switch("buildings"));
  }

  /**
   * @param {string} id
   * @param {() => void} onClick
   */
  function bindClick(id, onClick) {
    assertNotNull(document.getElementById(id)).addEventListener("click", onClick);
  }
})(assertNotNull(document.getElementById("volume")));

SoundManager.play("main");
