(volume => {
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

  /**
   * @param {string} id
   * @param {() => void} onClick
   */
  function bindClick(id, onClick) {
    assertNotNull(document.getElementById(id)).addEventListener("click", onClick);
  }
})(assertNotNull(document.getElementById("volume")));

SoundManager.play("main");
