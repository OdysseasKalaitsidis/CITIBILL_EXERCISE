import type { Activity } from "@/types";

export const normalizeText = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const getCategoryName = (activity: Activity) => {
  const normTitle = normalizeText(activity.title);
  if (
    normTitle.includes("ακροπολη") ||
    normTitle.includes("αγορα") ||
    normTitle.includes("πλακα") ||
    normTitle.includes("ξεναγηση") ||
    normTitle.includes("περιηγηση")
  ) {
    return "CULTURE";
  }
  if (normTitle.includes("food") || normTitle.includes("γευσιγνωσια") || normTitle.includes("μαγειρικης")) {
    return "FOOD";
  }
  if (normTitle.includes("μιξολογιας") || normTitle.includes("cocktail")) {
    return "DRINK";
  }
  if (normTitle.includes("μουσειο") || normTitle.includes("φωτογραφια") || normTitle.includes("art")) {
    return "ART";
  }
  if (normTitle.includes("bike") || normTitle.includes("χορων") || normTitle.includes("πεζοπορια")) {
    return "OUTDOORS";
  }
  return "TRIP";
};
