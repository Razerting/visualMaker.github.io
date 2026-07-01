export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossible de lire l'image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Impossible de charger l'image."));
      image.onload = () => resolve(image);
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function getImageDrawMetrics(image, canvasWidth, canvasHeight, fit, transform) {
  if (!image) return null;

  const baseRatio = fit === "contain"
    ? Math.min(canvasWidth / image.width, canvasHeight / image.height)
    : Math.max(canvasWidth / image.width, canvasHeight / image.height);
  const ratio = baseRatio * transform.zoom;
  const width = image.width * ratio;
  const height = image.height * ratio;
  const overflowX = Math.max(0, (width - canvasWidth) / 2);
  const overflowY = Math.max(0, (height - canvasHeight) / 2);
  const x = (canvasWidth - width) / 2 + (transform.offsetX / 100) * overflowX;
  const y = (canvasHeight - height) / 2 + (transform.offsetY / 100) * overflowY;

  return { x, y, width, height, overflowX, overflowY };
}

export function clampImageTransform(transform) {
  return {
    zoom: Math.min(3, Math.max(1, Number(transform.zoom) || 1)),
    offsetX: Math.min(100, Math.max(-100, Number(transform.offsetX) || 0)),
    offsetY: Math.min(100, Math.max(-100, Number(transform.offsetY) || 0)),
  };
}
