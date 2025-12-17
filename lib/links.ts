import type { Lang } from "@/lib/i18n";

export function withLang(path: string, lang: Lang) {
  const hasQuery = path.includes("?");
  return `${path}${hasQuery ? "&" : "?"}lang=${lang}`;
}
