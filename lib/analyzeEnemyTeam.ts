import {
  championData,
  defaultChampionData,
} from "../data/championData";

import { TRAITS } from "../data/championData/traits";

import type { Champion } from "../types/champion";

export interface EnemyTeamAnalysis {
  selectedCount: number;

  diveThreatCount: number;
  meleeCount: number;
  rangedCount: number;
  frontlineCount: number;

  hasHeavyDive: boolean;
  isMeleeHeavy: boolean;
  isRangedHeavy: boolean;
  hasMultipleFrontlines: boolean;
}

export function analyzeEnemyTeam(
  team: (Champion | null)[],
): EnemyTeamAnalysis {
  let selectedCount = 0;

  let diveThreatCount = 0;
  let meleeCount = 0;
  let rangedCount = 0;
  let frontlineCount = 0;

  for (const champion of team) {
    if (!champion) continue;

    selectedCount++;

    const data =
      championData[champion.id] ??
      defaultChampionData;

    const isDiveThreat =
      data.traits.includes(TRAITS.ASSASSIN) ||
      data.traits.includes(TRAITS.ENGAGE);

    if (isDiveThreat) {
      diveThreatCount++;
    }

    if (data.attributes.range === "MELEE") {
      meleeCount++;
    }

    if (data.attributes.range === "RANGED") {
      rangedCount++;
    }

    if (
      data.traits.includes(TRAITS.FRONTLINE)
    ) {
      frontlineCount++;
    }
  }

  return {
    selectedCount,

    diveThreatCount,
    meleeCount,
    rangedCount,
    frontlineCount,

    hasHeavyDive:
      diveThreatCount >= 2,

    isMeleeHeavy:
      meleeCount >= 3,

    isRangedHeavy:
      rangedCount >= 3,

    hasMultipleFrontlines:
      frontlineCount >= 2,
  };
}