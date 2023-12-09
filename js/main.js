((volume, game, lottoTemplate) => {
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

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 2; j++) {
      const lotto = assertInstanceOf(lottoTemplate.cloneNode(true).childNodes[1], HTMLElement);
      lotto.style.left = `${i * 50 + 146}px`;
      lotto.style.top = `${(j * 2 + 1 - i % 2) * 29 + 218}px`;
      game.append(lotto);
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
  assertNotNull(document.getElementById("game")),
  assertInstanceOf(document.getElementById("lotto"), HTMLTemplateElement).content
);

SoundManager.play("main");
