import { FUTURE_BACKGROUND_GENERATION } from "../config/appConfig.js";

export function getBackgroundGenerationPlan() {
  return FUTURE_BACKGROUND_GENERATION;
}

export async function generateMissingBackground() {
  throw new Error("La génération de fond IA est prévue dans l'architecture, mais pas activée.");
}
