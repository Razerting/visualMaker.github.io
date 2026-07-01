import { getImageDrawMetrics } from "../services/imageService.js";
import { getPositionGroups, getStackSpacing, measureTextBlock } from "../services/textLayoutService.js";

export class CanvasView {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.lastImageMetrics = null;
  }

  resize(format) {
    this.canvas.width = format.width;
    this.canvas.height = format.height;
  }

  draw(state) {
    this.drawBackground(state);
    this.drawTextGroups(state);
  }

  drawBackground(state) {
    this.ctx.fillStyle = state.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.lastImageMetrics = null;

    if (state.backgroundMode !== "image" || !state.backgroundImage) return;

    const metrics = getImageDrawMetrics(
      state.backgroundImage,
      this.canvas.width,
      this.canvas.height,
      state.imageFit,
      state.imageTransform,
    );
    if (!metrics) return;

    this.lastImageMetrics = metrics;
    this.ctx.drawImage(state.backgroundImage, metrics.x, metrics.y, metrics.width, metrics.height);
  }

  drawTextGroups(state) {
    const padding = state.format.padding;
    const maxWidth = this.canvas.width - padding * 2;
    const groups = getPositionGroups(state.texts);

    Object.values(groups).forEach((texts) => {
      const blocks = texts.map((text) => ({
        text,
        metrics: measureTextBlock(this.ctx, text, maxWidth, state.format.fontSize),
      }));
      const totalHeight = blocks.reduce((sum, block) => sum + block.metrics.height, 0)
        + getStackSpacing() * Math.max(0, blocks.length - 1);
      let y = this.getY(texts[0].positionY, totalHeight, padding);

      blocks.forEach(({ text, metrics }) => {
        this.ctx.fillStyle = text.color;
        this.ctx.font = `400 ${metrics.size}px ${text.fontFamily}`;
        this.ctx.textBaseline = "top";
        this.ctx.textAlign = text.positionX;
        const x = this.getX(text.positionX, padding);

        metrics.lines.forEach((line, index) => {
          this.ctx.fillText(line, x, y + index * metrics.lineGap, maxWidth);
        });
        y += metrics.height + getStackSpacing();
      });
    });
  }

  getX(positionX, padding) {
    if (positionX === "center") return this.canvas.width / 2;
    if (positionX === "right") return this.canvas.width - padding;
    return padding;
  }

  getY(positionY, totalHeight, padding) {
    if (positionY === "middle") return (this.canvas.height - totalHeight) / 2;
    if (positionY === "bottom") return this.canvas.height - padding - totalHeight;
    return padding;
  }

  getCanvasDeltaFromPointer(startEvent, currentEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      dx: (currentEvent.clientX - startEvent.clientX) * scaleX,
      dy: (currentEvent.clientY - startEvent.clientY) * scaleY,
    };
  }
}
