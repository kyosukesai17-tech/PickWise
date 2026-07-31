import { getChampionDetail } from "./analyzeTraits";
import { TRAITS } from "../src/constants/traits";

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

    const detail = getChampionDetail(champion.id);

    if (!detail) continue;

    selectedCount++;

    const isDiveThreat =
      detail.archetypes.includes("ASSASSIN") ||
      detail.traits.includes(TRAITS.ENGAGE);

    if (isDiveThreat) {
      diveThreatCount++;
    }

    if (detail.rangeType === "Melee") {
      meleeCount++;
    }

    if (detail.rangeType === "Ranged") {
      rangedCount++;
    }

    if (
      detail.archetypes.includes("FRONTLINE")
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
