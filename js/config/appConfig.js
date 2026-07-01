export const JPG_QUALITY = 0.82;
export const STACK_SPACING = 22;

export const FORMATS = [
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

export const FONTS = [
  { label: "REM (recommandé)", value: "\"REM\", Arial, sans-serif" },
  {
    label: "Baton Turbo (recommandé)",
    value: "\"Baton Turbo\", \"BatonTurbo-Regular\", \"BatonTurboWeb-Regular\", Arial, sans-serif",
  },
  { label: "Inter (recommandé)", value: "\"Inter\", Arial, sans-serif" },
  { label: "Arial (recommandé)", value: "Arial, Helvetica, sans-serif" },
  { label: "Helvetica Neue (recommandé)", value: "\"Helvetica Neue\", Helvetica, Arial, sans-serif" },
  { label: "Avenir Next (recommandé)", value: "\"Avenir Next\", Avenir, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "\"Times New Roman\", Times, serif" },
  { label: "Courier New", value: "\"Courier New\", Courier, monospace" },
];

export const FUTURE_BACKGROUND_GENERATION = {
  enabled: false,
  trigger: "generate-missing-background",
  expectedInput: "Current image, target format, visible empty zones, optional user prompt.",
  expectedOutput: "A browser-usable image blob resized/cropped by the existing image service.",
};
