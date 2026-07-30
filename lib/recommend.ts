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
  allyBans: (Champion | null)[],
  enemyBans: (Champion | null)[],
  selectedRole: Role,
): Recommendation[] {
  const unavailableChampionIds = [
    ...allyTeam,
    ...enemyTeam,
    ...allyBans,
    ...enemyBans,
  ]
    .filter(
      (
        champion,
      ): champion is Champion =>
        champion !== null,
    )
    .map((champion) => champion.id);

  const unavailableChampionIdSet =
    new Set(unavailableChampionIds);

  return getChampions()
    .filter(
      (champion) =>
        champion.roles.includes(selectedRole) &&
        !unavailableChampionIdSet.has(champion.id),
    )
    .map((champion) => ({
      champion,

      ...calculateScore(
        allyTeam,
        enemyTeam,
        champion,
      ),
    }))
    .sort(
      (a, b) =>
        b.score - a.score,
    );
}