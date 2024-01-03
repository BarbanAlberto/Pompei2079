((volume, playPause) => {
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

  const playPauseAnimator = new Animator(assertInstanceOf(playPause.firstElementChild, HTMLElement), 24, 0, 6);
  GameManager.addToggleListener(() => playPauseAnimator.toggle());
  playPause.addEventListener("click", () => GameManager.toggleTime());

  bindClick("show-volcano", () => Switcher.GAME.switch("volcano"));
  bindClick("show-museum", () => Switcher.GAME.switch("museum"));
  bindClick("build", () => CapManager.tryBuild());
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
})(
  assertNotNull(document.getElementById("volume")),
  assertNotNull(document.getElementById("play-pause"))
);

SoundManager.play("main");
