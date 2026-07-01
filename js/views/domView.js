import { FONTS, FORMATS } from "../config/appConfig.js";

export class DomView {
  constructor() {
    this.elements = {
      canvas: document.querySelector("#previewCanvas"),
      formatSelect: document.querySelector("#formatSelect"),
      formatMeta: document.querySelector("#formatMeta"),
      backgroundColor: document.querySelector("#backgroundColor"),
      colorModeButton: document.querySelector("#colorModeButton"),
      imageModeButton: document.querySelector("#imageModeButton"),
      backgroundColorField: document.querySelector("#backgroundColorField"),
      uploadArea: document.querySelector("#uploadArea"),
      imageUpload: document.querySelector("#imageUpload"),
      imageFit: document.querySelector("#imageFit"),
      imageFitField: document.querySelector("#imageFitField"),
      imageAdjustPanel: document.querySelector("#imageAdjustPanel"),
      imageZoom: document.querySelector("#imageZoom"),
      imageOffsetX: document.querySelector("#imageOffsetX"),
      imageOffsetY: document.querySelector("#imageOffsetY"),
      resetImageTransformButton: document.querySelector("#resetImageTransformButton"),
      textList: document.querySelector("#textList"),
      addTextButton: document.querySelector("#addTextButton"),
      removeTextButton: document.querySelector("#removeTextButton"),
      textInput: document.querySelector("#textInput"),
      textColor: document.querySelector("#textColor"),
      fontSize: document.querySelector("#fontSize"),
      fontFamily: document.querySelector("#fontFamily"),
      lineHeight: document.querySelector("#lineHeight"),
      positionGrid: document.querySelector("#positionGrid"),
      fileNameInput: document.querySelector("#fileNameInput"),
      downloadButton: document.querySelector("#downloadButton"),
      exportInfo: document.querySelector("#exportInfo"),
    };
  }

  initOptions() {
    FORMATS.forEach((format) => {
      const option = document.createElement("option");
      option.value = format.id;
      option.textContent = format.label;
      this.elements.formatSelect.append(option);
    });

    FONTS.forEach((font) => {
      const option = document.createElement("option");
      option.value = font.value;
      option.textContent = font.label;
      this.elements.fontFamily.append(option);
    });
  }

  render(state) {
    this.renderBackgroundMode(state);
    this.renderFormatMeta(state);
    this.renderImageTransform(state);
    this.renderTextList(state);
    this.syncActiveTextControls(state);
    this.updateExportInfo(state);
  }

  renderBackgroundMode(state) {
    const isImage = state.backgroundMode === "image";
    this.elements.colorModeButton.classList.toggle("active", !isImage);
    this.elements.imageModeButton.classList.toggle("active", isImage);
    this.elements.backgroundColorField.classList.toggle("hidden", isImage);
    this.elements.uploadArea.classList.toggle("hidden", !isImage);
    this.elements.imageFitField.classList.toggle("hidden", !isImage);
    this.elements.imageAdjustPanel.classList.toggle("hidden", !isImage || !state.backgroundImage);
  }

  renderFormatMeta(state) {
    this.elements.formatMeta.textContent = `${state.format.width} x ${state.format.height} px. ${state.format.description}`;
  }

  renderImageTransform(state) {
    this.elements.imageFit.value = state.imageFit;
    this.elements.imageZoom.value = state.imageTransform.zoom;
    this.elements.imageOffsetX.value = state.imageTransform.offsetX;
    this.elements.imageOffsetY.value = state.imageTransform.offsetY;
  }

  renderTextList(state) {
    this.elements.textList.innerHTML = "";
    state.texts.forEach((text, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = text.id === state.activeTextId ? "text-item active" : "text-item";
      button.dataset.id = String(text.id);
      button.innerHTML = `
        <span>Texte ${index + 1}</span>
        <small>${text.positionY} / ${text.positionX}</small>
      `;
      this.elements.textList.append(button);
    });
  }

  syncActiveTextControls(state) {
    const text = state.getActiveText();
    if (!text) return;

    this.elements.textInput.value = text.content;
    this.elements.textColor.value = text.color;
    this.elements.fontSize.value = text.fontSize;
    this.elements.fontFamily.value = text.fontFamily;
    this.elements.lineHeight.value = text.lineHeight;
    this.elements.removeTextButton.disabled = state.texts.length === 1;

    this.elements.positionGrid.querySelectorAll("button").forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.x === text.positionX && button.dataset.y === text.positionY,
      );
    });
  }

  updateExportInfo(state) {
    this.elements.exportInfo.textContent = `Export JPG ${state.format.width} x ${state.format.height} px, qualité web optimisée.`;
  }

  setExportStatus(message) {
    this.elements.exportInfo.textContent = message;
  }
}
