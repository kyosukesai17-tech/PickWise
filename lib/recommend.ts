import { getChampions } from "./getChampions";
import { calculateScore } from "./calculateScore";

import type {
  Champion,
  Role,
} from "../types/champion";

import type {
  Recommendation,
} from "../types/recommendation";

export function recommend(
  allyTeam: (Champion | null)[],
  enemyTeam: (Champion | null)[],
  selectedRole: Role,
): Recommendation[] {
  const selectedIds = [...allyTeam, ...enemyTeam]
    .filter(
      (champion): champion is Champion =>
        champion !== null,
    )
    .map((champion) => champion.id);

  return getChampions()
    .filter(
      (champion) =>
        champion.roles.includes(selectedRole) &&
        !selectedIds.includes(champion.id),
    )
    .map((champion) => ({
      champion,
      ...calculateScore(
        allyTeam,
        champion,
      ),
    }))
    .sort(
      (a, b) =>
        b.score - a.score,
    );
}