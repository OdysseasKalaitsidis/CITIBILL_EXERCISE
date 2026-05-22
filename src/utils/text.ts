export function normalizeText(textStr: string): string {
  return textStr
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
