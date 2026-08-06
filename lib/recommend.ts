import { getChampions } from "./getChampions";
import { calculateScore } from "./calculateScore";
import { getChampionDetail } from "./analyzeTraits";

import type {
  Champion,
  Role,
} from "../types/champion";

import type {
  Recommendation,
} from "../types/recommendation";
import type { DraftSide } from "../types/draftPhase";

export function recommend(
  allyTeam: (Champion | null)[],
  enemyTeam: (Champion | null)[],
  allyBans: (Champion | null)[],
  enemyBans: (Champion | null)[],
  selectedRole: Role,
  currentDraftSide: DraftSide,
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
    .map(
      (champion) =>
        champion.id,
    );

  const unavailableChampionIdSet =
    new Set(unavailableChampionIds);

  return getChampions()
    .filter(
      (champion) =>
        champion.roles.includes(
          selectedRole,
        ) &&
        !unavailableChampionIdSet.has(
          champion.id,
        ),
    )
    .map((champion) => {
      const isDataRegistered =
        getChampionDetail(champion.id) !== undefined;

      return {
        champion,

        ...calculateScore(
          allyTeam,
          enemyTeam,
          selectedRole,
          champion,
          currentDraftSide,
        ),

        isDataRegistered,
      };
    })
    .sort((a, b) => {
      if (
        a.isDataRegistered !==
        b.isDataRegistered
      ) {
        return Number(
          b.isDataRegistered,
        ) - Number(
          a.isDataRegistered,
        );
      }

      return b.score - a.score;
    });
}
