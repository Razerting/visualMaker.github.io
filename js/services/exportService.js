import { JPG_QUALITY } from "../config/appConfig.js";

export function sanitizeFileName(value) {
  const cleanValue = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleanValue || "drill-maker";
}

export function downloadCanvasAsJpg(canvas, requestedFileName) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Export impossible."));
          return;
        }

        const fileName = sanitizeFileName(requestedFileName);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.jpg`;
        document.body.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        resolve({ fileName, sizeKb: Math.max(1, Math.round(blob.size / 1024)) });
      },
      "image/jpeg",
      JPG_QUALITY,
    );
  });
}
