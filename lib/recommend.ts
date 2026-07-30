import { getChampions } from "./getChampions";
import type { Champion, Role } from "../types/champion";

export type Recommendation = {
  champion: Champion;
  score: number;
  reasons: string[];
};

export function recommend(
  allyTeam: (Champion | null)[],
  enemyTeam: (Champion | null)[],
  selectedRole: Role,
): Recommendation[] {
  const selectedIds = [...allyTeam, ...enemyTeam]
    .filter((champion): champion is Champion => champion !== null)
    .map((champion) => champion.id);

  return getChampions()
    .filter(
      (champion) =>
        champion.roles.includes(selectedRole) &&
        !selectedIds.includes(champion.id),
    )
    .map((champion) => ({
      champion,
      score: 0,
      reasons: [],
    }));
}