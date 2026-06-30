const formats = [
  {
    id: "square",
    label: "Carré réseaux sociaux",
    width: 1080,
    height: 1080,
    fontSize: 64,
    padding: 90,
    description: "1080 x 1080 px, idéal pour Instagram et contenus carrés.",
  },
  {
    id: "story",
    label: "Story verticale",
    width: 1080,
    height: 1920,
    fontSize: 72,
    padding: 90,
    description: "1080 x 1920 px, adapté aux stories et reels covers.",
  },
  {
    id: "banner",
    label: "Bannière desktop",
    width: 1920,
    height: 720,
    fontSize: 58,
    padding: 120,
    description: "1920 x 720 px, pour une zone hero ou campagne web.",
  },
  {
    id: "landscape",
    label: "Paysage web",
    width: 1200,
    height: 628,
    fontSize: 52,
    padding: 74,
    description: "1200 x 628 px, format polyvalent pour pages et partages.",
  },
  {
    id: "email",
    label: "Header email",
    width: 1400,
    height: 560,
    fontSize: 50,
    padding: 80,
    description: "1400 x 560 px, pour newsletters et blocs CRM.",
  },
];

const state = {
  format: formats[0],
  backgroundMode: "color",
  backgroundImage: null,
  positionX: "left",
  positionY: "bottom",
};

const canvas = document.querySelector("#previewCanvas");
const ctx = canvas.getContext("2d");
const formatSelect = document.querySelector("#formatSelect");
const formatMeta = document.querySelector("#formatMeta");
const backgroundColor = document.querySelector("#backgroundColor");
const colorModeButton = document.querySelector("#colorModeButton");
const imageModeButton = document.querySelector("#imageModeButton");
const backgroundColorField = document.querySelector("#backgroundColorField");
const uploadArea = document.querySelector("#uploadArea");
const imageUpload = document.querySelector("#imageUpload");
const imageFit = document.querySelector("#imageFit");
const imageFitField = document.querySelector("#imageFitField");
const textInput = document.querySelector("#textInput");
const textColor = document.querySelector("#textColor");
const fontSize = document.querySelector("#fontSize");
const lineHeight = document.querySelector("#lineHeight");
const positionGrid = document.querySelector("#positionGrid");
const qualityRange = document.querySelector("#qualityRange");
const downloadButton = document.querySelector("#downloadButton");
const exportInfo = document.querySelector("#exportInfo");

function initFormats() {
  formats.forEach((format) => {
    const option = document.createElement("option");
    option.value = format.id;
    option.textContent = format.label;
    formatSelect.append(option);
  });
}

function setFormat(formatId) {
  state.format = formats.find((format) => format.id === formatId) || formats[0];
  canvas.width = state.format.width;
  canvas.height = state.format.height;
  fontSize.value = state.format.fontSize;
  formatMeta.textContent = `${state.format.width} x ${state.format.height} px. ${state.format.description}`;
  draw();
}

function setBackgroundMode(mode) {
  state.backgroundMode = mode;
  const isImage = mode === "image";
  colorModeButton.classList.toggle("active", !isImage);
  imageModeButton.classList.toggle("active", isImage);
  backgroundColorField.classList.toggle("hidden", isImage);
  uploadArea.classList.toggle("hidden", !isImage);
  imageFitField.classList.toggle("hidden", !isImage);
  draw();
}

function readUploadedImage(file) {
  if (!file) {
    state.backgroundImage = null;
    draw();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      state.backgroundImage = image;
      draw();
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function drawBackground() {
  ctx.fillStyle = backgroundColor.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (state.backgroundMode !== "image" || !state.backgroundImage) {
    return;
  }

  const source = state.backgroundImage;
  const ratio = imageFit.value === "contain"
    ? Math.min(canvas.width / source.width, canvas.height / source.height)
    : Math.max(canvas.width / source.width, canvas.height / source.height);
  const width = source.width * ratio;
  const height = source.height * ratio;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  if (imageFit.value === "contain") {
    ctx.fillStyle = backgroundColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(source, x, y, width, height);
}

function getWrappedLines(text, maxWidth) {
  const rawLines = text.split("\n");
  const lines = [];

  rawLines.forEach((rawLine) => {
    const words = rawLine.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      return;
    }

    let currentLine = "";
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width <= maxWidth || !currentLine) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    lines.push(currentLine);
  });

  return lines;
}

function drawText() {
  const text = textInput.value.trim();
  if (!text) {
    return;
  }

  const padding = state.format.padding;
  const size = Number(fontSize.value) || state.format.fontSize;
  const lineRatio = Number(lineHeight.value) || 1.15;
  const maxWidth = canvas.width - padding * 2;

  ctx.fillStyle = textColor.value;
  ctx.font = `400 ${size}px Arial, Helvetica, sans-serif`;
  ctx.textBaseline = "top";
  ctx.textAlign = state.positionX;

  const lines = getWrappedLines(text, maxWidth);
  const lineGap = size * lineRatio;
  const blockHeight = lines.length * lineGap - (lineGap - size);

  let x = padding;
  if (state.positionX === "center") x = canvas.width / 2;
  if (state.positionX === "right") x = canvas.width - padding;

  let y = padding;
  if (state.positionY === "middle") y = (canvas.height - blockHeight) / 2;
  if (state.positionY === "bottom") y = canvas.height - padding - blockHeight;

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineGap, maxWidth);
  });
}

function draw() {
  drawBackground();
  drawText();
  updateExportInfo();
}

function updateExportInfo() {
  const quality = Math.round(Number(qualityRange.value) * 100);
  exportInfo.textContent = `Export JPG ${state.format.width} x ${state.format.height} px, qualité ${quality}%.`;
}

function downloadJpg() {
  draw();
  exportInfo.textContent = "Préparation du JPG...";
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        exportInfo.textContent = "Export impossible. Essayez avec une autre image.";
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `drill-maker-${state.format.id}.jpg`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      const size = Math.max(1, Math.round(blob.size / 1024));
      exportInfo.textContent = `Téléchargement lancé - JPG ${size} Ko.`;
    },
    "image/jpeg",
    Number(qualityRange.value),
  );
}

function bindEvents() {
  formatSelect.addEventListener("change", (event) => setFormat(event.target.value));
  colorModeButton.addEventListener("click", () => setBackgroundMode("color"));
  imageModeButton.addEventListener("click", () => setBackgroundMode("image"));
  imageUpload.addEventListener("change", (event) => readUploadedImage(event.target.files[0]));

  [backgroundColor, imageFit, textInput, textColor, fontSize, lineHeight, qualityRange].forEach((input) => {
    input.addEventListener("input", draw);
  });

  positionGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    state.positionX = button.dataset.x;
    state.positionY = button.dataset.y;
    positionGrid.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    draw();
  });

  downloadButton.addEventListener("click", downloadJpg);
}

initFormats();
bindEvents();
setFormat("square");
