import { getChampions } from "./getChampions";
import type { Champion } from "../types/champion";

export type Recommendation = {
  champion: Champion;
  score: number;
  reasons: string[];
};

export function recommend(
  allyTeam: (Champion | null)[],
  enemyTeam: (Champion | null)[],
): Recommendation[] {
  const selectedIds = [...allyTeam, ...enemyTeam]
    .filter((champion): champion is Champion => champion !== null)
    .map((champion) => champion.id);

  return getChampions()
    .filter((champion) => !selectedIds.includes(champion.id))
    .map((champion) => ({
      champion,
      score: 0,
      reasons: [],
    }));
}