const JPG_QUALITY = 0.82;
const STACK_SPACING = 22;

const formats = [
  {
    id: "drill",
    label: "Drill",
    ratio: "200:121",
    baseWidth: 200,
    baseHeight: 121,
    scale: 3,
    fontSize: 34,
    padding: 42,
    description: "Ratio 200:121, export x3 pour la qualité iOS.",
  },
  {
    id: "tuile",
    label: "Tuile",
    ratio: "637:956",
    baseWidth: 637,
    baseHeight: 956,
    scale: 3,
    fontSize: 82,
    padding: 120,
    description: "Ratio 637:956, export x3 pour la qualité iOS.",
  },
  {
    id: "cat-banner",
    label: "Cat banner",
    ratio: "1920:760",
    baseWidth: 1920,
    baseHeight: 760,
    scale: 2,
    fontSize: 86,
    padding: 140,
    description: "Ratio 1920:760, export x2 pour la qualité iOS.",
  },
].map((format) => ({
  ...format,
  width: format.baseWidth * format.scale,
  height: format.baseHeight * format.scale,
}));

const fonts = [
  { label: "REM (recommandé)", value: "\"REM\", Arial, sans-serif" },
  { label: "Baton Turbo (recommandé)", value: "\"Baton Turbo\", \"BatonTurbo-Regular\", \"BatonTurboWeb-Regular\", Arial, sans-serif" },
  { label: "Inter (recommandé)", value: "\"Inter\", Arial, sans-serif" },
  { label: "Arial (recommandé)", value: "Arial, Helvetica, sans-serif" },
  { label: "Helvetica Neue (recommandé)", value: "\"Helvetica Neue\", Helvetica, Arial, sans-serif" },
  { label: "Avenir Next (recommandé)", value: "\"Avenir Next\", Avenir, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "\"Times New Roman\", Times, serif" },
  { label: "Courier New", value: "\"Courier New\", Courier, monospace" },
];

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
const textList = document.querySelector("#textList");
const addTextButton = document.querySelector("#addTextButton");
const removeTextButton = document.querySelector("#removeTextButton");
const textInput = document.querySelector("#textInput");
const textColor = document.querySelector("#textColor");
const fontSize = document.querySelector("#fontSize");
const fontFamily = document.querySelector("#fontFamily");
const lineHeight = document.querySelector("#lineHeight");
const positionGrid = document.querySelector("#positionGrid");
const fileNameInput = document.querySelector("#fileNameInput");
const downloadButton = document.querySelector("#downloadButton");
const exportInfo = document.querySelector("#exportInfo");

const state = {
  format: formats[0],
  backgroundMode: "color",
  backgroundImage: null,
  activeTextId: 1,
  nextTextId: 2,
  texts: [
    {
      id: 1,
      content: "LIVRAISON\nET RETOURS\nGRATUITS\nEN BOUTIQUE",
      color: "#090909",
      fontSize: formats[0].fontSize,
      fontFamily: fonts[0].value,
      lineHeight: 1.15,
      positionX: "left",
      positionY: "bottom",
    },
  ],
};

function initFormats() {
  formats.forEach((format) => {
    const option = document.createElement("option");
    option.value = format.id;
    option.textContent = format.label;
    formatSelect.append(option);
  });
}

function initFonts() {
  fonts.forEach((font) => {
    const option = document.createElement("option");
    option.value = font.value;
    option.textContent = font.label;
    fontFamily.append(option);
  });
}

function getActiveText() {
  return state.texts.find((text) => text.id === state.activeTextId) || state.texts[0];
}

function setFormat(formatId) {
  state.format = formats.find((format) => format.id === formatId) || formats[0];
  canvas.width = state.format.width;
  canvas.height = state.format.height;
  state.texts.forEach((text) => {
    text.fontSize = state.format.fontSize;
  });
  formatMeta.textContent = `${state.format.width} x ${state.format.height} px. ${state.format.description}`;
  syncActiveTextControls();
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

function measureTextBlock(textConfig, maxWidth) {
  const size = Number(textConfig.fontSize) || state.format.fontSize;
  const lineRatio = Number(textConfig.lineHeight) || 1.15;
  ctx.font = `400 ${size}px ${textConfig.fontFamily}`;
  const lines = getWrappedLines(textConfig.content.trim(), maxWidth);
  const lineGap = size * lineRatio;
  const height = lines.length ? lines.length * lineGap - (lineGap - size) : 0;

  return { lines, lineGap, height, size };
}

function getPositionGroups() {
  return state.texts.reduce((groups, text) => {
    if (!text.content.trim()) return groups;
    const key = `${text.positionX}-${text.positionY}`;
    groups[key] = groups[key] || [];
    groups[key].push(text);
    return groups;
  }, {});
}

function getX(positionX, padding) {
  if (positionX === "center") return canvas.width / 2;
  if (positionX === "right") return canvas.width - padding;
  return padding;
}

function getY(positionY, totalHeight, padding) {
  if (positionY === "middle") return (canvas.height - totalHeight) / 2;
  if (positionY === "bottom") return canvas.height - padding - totalHeight;
  return padding;
}

function drawTextGroups() {
  const padding = state.format.padding;
  const maxWidth = canvas.width - padding * 2;
  const groups = getPositionGroups();

  Object.values(groups).forEach((texts) => {
    const blocks = texts.map((text) => ({
      text,
      metrics: measureTextBlock(text, maxWidth),
    }));
    const totalHeight = blocks.reduce((sum, block) => sum + block.metrics.height, 0)
      + STACK_SPACING * Math.max(0, blocks.length - 1);
    let y = getY(texts[0].positionY, totalHeight, padding);

    blocks.forEach(({ text, metrics }) => {
      ctx.fillStyle = text.color;
      ctx.font = `400 ${metrics.size}px ${text.fontFamily}`;
      ctx.textBaseline = "top";
      ctx.textAlign = text.positionX;
      const x = getX(text.positionX, padding);

      metrics.lines.forEach((line, index) => {
        ctx.fillText(line, x, y + index * metrics.lineGap, maxWidth);
      });
      y += metrics.height + STACK_SPACING;
    });
  });
}

function draw() {
  drawBackground();
  drawTextGroups();
  updateExportInfo();
  renderTextList();
}

function redrawWhenFontsAreReady() {
  if (!document.fonts) return;
  document.fonts.ready.then(draw);
}

function updateExportInfo() {
  exportInfo.textContent = `Export JPG ${state.format.width} x ${state.format.height} px, qualité web optimisée.`;
}

function sanitizeFileName(value) {
  const cleanValue = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleanValue || "drill-maker";
}

function downloadJpg() {
  drawBackground();
  drawTextGroups();
  exportInfo.textContent = "Préparation du JPG...";
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        exportInfo.textContent = "Export impossible. Essayez avec une autre image.";
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = sanitizeFileName(fileNameInput.value);
      link.href = url;
      link.download = `${fileName}.jpg`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      const size = Math.max(1, Math.round(blob.size / 1024));
      exportInfo.textContent = `Téléchargement lancé - ${fileName}.jpg, ${size} Ko.`;
    },
    "image/jpeg",
    JPG_QUALITY,
  );
}

function renderTextList() {
  textList.innerHTML = "";
  state.texts.forEach((text, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = text.id === state.activeTextId ? "text-item active" : "text-item";
    button.dataset.id = String(text.id);
    button.innerHTML = `
      <span>Texte ${index + 1}</span>
      <small>${text.positionY} / ${text.positionX}</small>
    `;
    textList.append(button);
  });
}

function syncActiveTextControls() {
  const text = getActiveText();
  if (!text) return;

  textInput.value = text.content;
  textColor.value = text.color;
  fontSize.value = text.fontSize;
  fontFamily.value = text.fontFamily;
  lineHeight.value = text.lineHeight;

  positionGrid.querySelectorAll("button").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.x === text.positionX && button.dataset.y === text.positionY,
    );
  });
  removeTextButton.disabled = state.texts.length === 1;
}

function updateActiveText(partial) {
  const text = getActiveText();
  if (!text) return;
  Object.assign(text, partial);
  draw();
}

function addTextBlock() {
  const newText = {
    id: state.nextTextId,
    content: "NOUVEAU TEXTE",
    color: "#090909",
    fontSize: state.format.fontSize,
    fontFamily: fonts[0].value,
    lineHeight: 1.15,
    positionX: "center",
    positionY: "middle",
  };
  state.nextTextId += 1;
  state.texts.push(newText);
  state.activeTextId = newText.id;
  syncActiveTextControls();
  draw();
}

function removeActiveTextBlock() {
  if (state.texts.length === 1) return;
  state.texts = state.texts.filter((text) => text.id !== state.activeTextId);
  state.activeTextId = state.texts[0].id;
  syncActiveTextControls();
  draw();
}

function bindEvents() {
  formatSelect.addEventListener("change", (event) => setFormat(event.target.value));
  colorModeButton.addEventListener("click", () => setBackgroundMode("color"));
  imageModeButton.addEventListener("click", () => setBackgroundMode("image"));
  imageUpload.addEventListener("change", (event) => readUploadedImage(event.target.files[0]));
  addTextButton.addEventListener("click", addTextBlock);
  removeTextButton.addEventListener("click", removeActiveTextBlock);

  backgroundColor.addEventListener("input", draw);
  imageFit.addEventListener("input", draw);
  fileNameInput.addEventListener("input", updateExportInfo);

  textInput.addEventListener("input", (event) => updateActiveText({ content: event.target.value }));
  textColor.addEventListener("input", (event) => updateActiveText({ color: event.target.value }));
  fontSize.addEventListener("input", (event) => updateActiveText({ fontSize: Number(event.target.value) }));
  fontFamily.addEventListener("input", (event) => {
    updateActiveText({ fontFamily: event.target.value });
    redrawWhenFontsAreReady();
  });
  lineHeight.addEventListener("input", (event) => updateActiveText({ lineHeight: Number(event.target.value) }));

  textList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    state.activeTextId = Number(button.dataset.id);
    syncActiveTextControls();
    renderTextList();
  });

  positionGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    updateActiveText({ positionX: button.dataset.x, positionY: button.dataset.y });
    syncActiveTextControls();
  });

  downloadButton.addEventListener("click", downloadJpg);
}

initFormats();
initFonts();
bindEvents();
setFormat("drill");
redrawWhenFontsAreReady();
