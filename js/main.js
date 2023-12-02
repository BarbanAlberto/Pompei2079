(volume => {
  bindClick("play", () => Switcher.LEVEL.switch("game"));
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

  /**
   * @param {string} id
   * @param {() => void} onClick
   */
  function bindClick(id, onClick) {
    assertNotNull(document.getElementById(id)).addEventListener("click", onClick);
  }
})(assertNotNull(document.getElementById("volume")));

SoundManager.play("main");
