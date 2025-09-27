import QrCreator from "./qrCreator.js";

export function createQrCanvas(text, options = {}) {
  if (!text) {
    throw new Error("QR text is required");
  }
  const { size = 140, fill = "#1f2a4b", background = "#ffffff" } = options;
  const canvas = document.createElement("canvas");
  QrCreator.render(
    {
      text,
      size,
      fill,
      background,
      ecLevel: "M",
      radius: 0,
      quiet: 2
    },
    canvas
  );
  return canvas;
}

export function createQrDataUrl(text, options = {}) {
  const canvas = createQrCanvas(text, options);
  return canvas.toDataURL("image/png");
}

export function renderQr(target, text, options = {}) {
  if (!target) return null;
  const canvas = createQrCanvas(text, options);
  target.innerHTML = "";
  target.appendChild(canvas);
  return canvas;
}
