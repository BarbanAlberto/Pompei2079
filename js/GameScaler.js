addEventListener("resize", () => {
  document.body.style.transform = "scale(0)";
  const size = document.documentElement.getBoundingClientRect();
  const scale = Math.min(size.width / 640, size.height / 360);
  document.body.style.transform = `translate(${(size.width - scale * 640) / 2}px, ${(size.height - scale * 360) / 2}px) scale(${scale})`;
});
dispatchEvent(new UIEvent("resize"));
