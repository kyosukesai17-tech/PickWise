import { champions } from "../data/champions";
import { Champion } from "../types/champion";

export function searchChampion(keyword: string): Champion[] {
  if (!keyword.trim()) {
    return [];
  }

  return champions.filter((champion) =>
    champion.name.toLowerCase().startsWith(keyword.toLowerCase())
  );
}