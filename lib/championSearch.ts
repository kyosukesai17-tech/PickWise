import type { Champion } from "../types/champion";

export function normalizeChampionSearchValue(
  value: string,
): string {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s・･_\-‐‑‒–—―]/g, "");
}

export function matchesChampionSearch(
  champion: Champion,
  normalizedQuery: string,
): boolean {
  return [champion.name, champion.id].some((value) =>
    normalizeChampionSearchValue(value).includes(normalizedQuery),
  );
}
