import { STACK_SPACING } from "../config/appConfig.js";

export function getWrappedLines(ctx, text, maxWidth) {
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

export function measureTextBlock(ctx, textConfig, maxWidth, fallbackSize) {
  const size = Number(textConfig.fontSize) || fallbackSize;
  const lineRatio = Number(textConfig.lineHeight) || 1.15;
  ctx.font = `400 ${size}px ${textConfig.fontFamily}`;
  const lines = getWrappedLines(ctx, textConfig.content.trim(), maxWidth);
  const lineGap = size * lineRatio;
  const height = lines.length ? lines.length * lineGap - (lineGap - size) : 0;

  return { lines, lineGap, height, size };
}

export function getPositionGroups(texts) {
  return texts.reduce((groups, text) => {
    if (!text.content.trim()) return groups;
    const key = `${text.positionX}-${text.positionY}`;
    groups[key] = groups[key] || [];
    groups[key].push(text);
    return groups;
  }, {});
}

export function getStackSpacing() {
  return STACK_SPACING;
}
