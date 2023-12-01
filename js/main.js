((main, settings, volume) => {
  assertNotNull(document.getElementById("show-settings")).addEventListener("click", () => {
    main.classList.add("hidden");
    settings.removeAttribute("class");
  });
  assertNotNull(document.getElementById("back")).addEventListener("click", () => {
    settings.classList.add("hidden");
    main.removeAttribute("class");
  });

  function updateVolume() { volume.textContent = `${SoundManager.volume}`; }
  updateVolume();
  assertNotNull(document.getElementById("inc")).addEventListener("click", () => {
    SoundManager.volume++;
    updateVolume();
  });
  assertNotNull(document.getElementById("dec")).addEventListener("click", () => {
    SoundManager.volume--;
    updateVolume();
  });
})(
  assertNotNull(document.getElementById("main")),
  assertNotNull(document.getElementById("settings")),
  assertNotNull(document.getElementById("volume"))
);

SoundManager.play();
