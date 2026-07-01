import { FONTS, FORMATS } from "../config/appConfig.js";

const DEFAULT_TEXT = "LIVRAISON\nET RETOURS\nGRATUITS\nEN BOUTIQUE";

export class EditorState {
  constructor() {
    this.format = FORMATS[0];
    this.backgroundMode = "color";
    this.backgroundColor = "#f7f6f2";
    this.backgroundImage = null;
    this.imageFit = "cover";
    this.imageTransform = {
      offsetX: 0,
      offsetY: 0,
      zoom: 1,
    };
    this.activeTextId = 1;
    this.nextTextId = 2;
    this.fileName = "drill-maker";
    this.texts = [
      {
        id: 1,
        content: DEFAULT_TEXT,
        color: "#090909",
        fontSize: FORMATS[0].fontSize,
        fontFamily: FONTS[0].value,
        lineHeight: 1.15,
        positionX: "left",
        positionY: "bottom",
      },
    ];
  }

  setFormat(formatId) {
    this.format = FORMATS.find((format) => format.id === formatId) || FORMATS[0];
    this.texts.forEach((text) => {
      text.fontSize = this.format.fontSize;
    });
  }

  getActiveText() {
    return this.texts.find((text) => text.id === this.activeTextId) || this.texts[0];
  }

  updateActiveText(partial) {
    Object.assign(this.getActiveText(), partial);
  }

  addTextBlock() {
    const text = {
      id: this.nextTextId,
      content: "NOUVEAU TEXTE",
      color: "#090909",
      fontSize: this.format.fontSize,
      fontFamily: FONTS[0].value,
      lineHeight: 1.15,
      positionX: "center",
      positionY: "middle",
    };
    this.nextTextId += 1;
    this.texts.push(text);
    this.activeTextId = text.id;
  }

  removeActiveTextBlock() {
    if (this.texts.length === 1) return;
    this.texts = this.texts.filter((text) => text.id !== this.activeTextId);
    this.activeTextId = this.texts[0].id;
  }

  resetImageTransform() {
    this.imageTransform = {
      offsetX: 0,
      offsetY: 0,
      zoom: 1,
    };
  }
}
