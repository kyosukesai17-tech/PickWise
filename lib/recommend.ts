import {
  championData,
} from "../data/championData";

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
        championData[champion.id] !== undefined;

      return {
        champion,

        ...calculateScore(
          allyTeam,
          enemyTeam,
          selectedRole,
          champion,
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