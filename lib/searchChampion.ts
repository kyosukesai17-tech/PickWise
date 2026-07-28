import { getChampions } from "./getChampions";

export function searchChampion(keyword: string) {
  if (!keyword.trim()) {
    return [];
  }

  const lower = keyword.toLowerCase();

  return getChampions().filter((champion) => {
    return (
      champion.name.startsWith(keyword) ||
      champion.id.toLowerCase().startsWith(lower)
    );
  });
}