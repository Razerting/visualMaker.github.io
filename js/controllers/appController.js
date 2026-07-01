import { EditorState } from "../models/editorState.js";
import { downloadCanvasAsJpg } from "../services/exportService.js";
import { clampImageTransform, loadImageFromFile } from "../services/imageService.js";
import { CanvasView } from "../views/canvasView.js";
import { DomView } from "../views/domView.js";

export class AppController {
  constructor() {
    this.state = new EditorState();
    this.domView = new DomView();
    this.canvasView = new CanvasView(this.domView.elements.canvas);
    this.dragState = null;
  }

  init() {
    this.domView.initOptions();
    this.bindEvents();
    this.canvasView.resize(this.state.format);
    this.render();
    this.redrawWhenFontsAreReady();
  }

  bindEvents() {
    const { elements } = this.domView;

    elements.formatSelect.addEventListener("change", (event) => {
      this.state.setFormat(event.target.value);
      this.canvasView.resize(this.state.format);
      this.render();
      this.redrawWhenFontsAreReady();
    });

    elements.colorModeButton.addEventListener("click", () => {
      this.state.backgroundMode = "color";
      this.render();
    });

    elements.imageModeButton.addEventListener("click", () => {
      this.state.backgroundMode = "image";
      this.render();
    });

    elements.backgroundColor.addEventListener("input", (event) => {
      this.state.backgroundColor = event.target.value;
      this.render();
    });

    elements.imageUpload.addEventListener("change", async (event) => {
      this.state.backgroundImage = await loadImageFromFile(event.target.files[0]);
      this.state.resetImageTransform();
      this.state.backgroundMode = this.state.backgroundImage ? "image" : this.state.backgroundMode;
      this.render();
    });

    elements.imageFit.addEventListener("input", (event) => {
      this.state.imageFit = event.target.value;
      this.state.resetImageTransform();
      this.render();
    });

    elements.imageZoom.addEventListener("input", (event) => {
      this.updateImageTransform({ zoom: Number(event.target.value) });
    });

    elements.imageOffsetX.addEventListener("input", (event) => {
      this.updateImageTransform({ offsetX: Number(event.target.value) });
    });

    elements.imageOffsetY.addEventListener("input", (event) => {
      this.updateImageTransform({ offsetY: Number(event.target.value) });
    });

    elements.resetImageTransformButton.addEventListener("click", () => {
      this.state.resetImageTransform();
      this.render();
    });

    elements.addTextButton.addEventListener("click", () => {
      this.state.addTextBlock();
      this.render();
    });

    elements.removeTextButton.addEventListener("click", () => {
      this.state.removeActiveTextBlock();
      this.render();
    });

    elements.textList.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      this.state.activeTextId = Number(button.dataset.id);
      this.render();
    });

    elements.textInput.addEventListener("input", (event) => {
      this.state.updateActiveText({ content: event.target.value });
      this.render();
    });

    elements.textColor.addEventListener("input", (event) => {
      this.state.updateActiveText({ color: event.target.value });
      this.render();
    });

    elements.fontSize.addEventListener("input", (event) => {
      this.state.updateActiveText({ fontSize: Number(event.target.value) });
      this.render();
    });

    elements.fontFamily.addEventListener("input", (event) => {
      this.state.updateActiveText({ fontFamily: event.target.value });
      this.render();
      this.redrawWhenFontsAreReady();
    });

    elements.lineHeight.addEventListener("input", (event) => {
      this.state.updateActiveText({ lineHeight: Number(event.target.value) });
      this.render();
    });

    elements.positionGrid.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      this.state.updateActiveText({ positionX: button.dataset.x, positionY: button.dataset.y });
      this.render();
    });

    elements.fileNameInput.addEventListener("input", (event) => {
      this.state.fileName = event.target.value;
      this.domView.updateExportInfo(this.state);
    });

    elements.downloadButton.addEventListener("click", async () => {
      this.canvasView.draw(this.state);
      this.domView.setExportStatus("Préparation du JPG...");
      try {
        const result = await downloadCanvasAsJpg(elements.canvas, this.state.fileName);
        this.domView.setExportStatus(`Téléchargement lancé - ${result.fileName}.jpg, ${result.sizeKb} Ko.`);
      } catch {
        this.domView.setExportStatus("Export impossible. Essayez avec une autre image.");
      }
    });

    this.bindCanvasDrag();
  }

  bindCanvasDrag() {
    const { canvas } = this.domView.elements;

    canvas.addEventListener("pointerdown", (event) => {
      if (this.state.backgroundMode !== "image" || !this.state.backgroundImage) return;
      canvas.setPointerCapture(event.pointerId);
      this.dragState = {
        startEvent: event,
        startTransform: { ...this.state.imageTransform },
      };
      canvas.classList.add("is-dragging");
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!this.dragState || !this.canvasView.lastImageMetrics) return;
      const delta = this.canvasView.getCanvasDeltaFromPointer(this.dragState.startEvent, event);
      const metrics = this.canvasView.lastImageMetrics;
      this.updateImageTransform({
        offsetX: this.dragState.startTransform.offsetX + this.toOffsetDelta(delta.dx, metrics.overflowX),
        offsetY: this.dragState.startTransform.offsetY + this.toOffsetDelta(delta.dy, metrics.overflowY),
      });
    });

    canvas.addEventListener("pointerup", (event) => this.endCanvasDrag(event));
    canvas.addEventListener("pointercancel", (event) => this.endCanvasDrag(event));
  }

  endCanvasDrag(event) {
    if (!this.dragState) return;
    this.domView.elements.canvas.releasePointerCapture(event.pointerId);
    this.domView.elements.canvas.classList.remove("is-dragging");
    this.dragState = null;
  }

  toOffsetDelta(delta, overflow) {
    if (!overflow) return 0;
    return (delta / overflow) * 100;
  }

  updateImageTransform(partial) {
    this.state.imageTransform = clampImageTransform({
      ...this.state.imageTransform,
      ...partial,
    });
    this.render();
  }

  render() {
    this.canvasView.draw(this.state);
    this.domView.render(this.state);
  }

  redrawWhenFontsAreReady() {
    if (!document.fonts) return;
    document.fonts.ready.then(() => this.render());
  }
}
